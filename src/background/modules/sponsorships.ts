import { BountyStatus } from "~/common/constants";
import { formatMoney, getIconUrl } from "~/common/helpers";
import { Sponsorship, ThirdPartySponsorship } from "~/common/types";

import { getSponsorshipChannelSettings, getSponsorships, getThirdPartySponsorships } from "../twitch";

class SponsorshipModule {
  async openSponsorshipBoard() {
    const [tab] = await browser.tabs.query({
      url: "*://dashboard.twitch.tv/*/monetization/sponsorships*",
    });

    return tab
      ? browser.tabs.update(tab.id, { active: true })
      : browser.tabs.create({ url: "https://dashboard.twitch.tv/monetization/sponsorships" });
  }

  openSponsorshipPage(sponsorship: Sponsorship) {
    return browser.tabs.create({ url: sponsorship.url });
  }

  async fetchSponsorshipBoardStatus() {
    const [{ data }] = await getSponsorshipChannelSettings();

    if (data == null) {
      return false;
    }

    const {
      userSponsorshipSettings: { isProfileEligible },
    } = data;

    return isProfileEligible;
  }

  async fetchSponsorships() {
    const responses = await getSponsorships();

    return responses.flatMap<Sponsorship>(({ data }) => {
      if (data == null) {
        return [];
      }

      return data.sponsorshipInstances.edges.map(({ node }) => ({
        id: node.id,
        description: node.description,

        status: this.formatSponsorshipStatus(node.state),
        brand: this.formatBrand(node.activities),

        get date() {
          switch (this.status) {
            case BountyStatus.Completed:
              return Date.parse(node.activation.endsAt);

            case BountyStatus.Live:
              return Date.parse(node.activation.startsAt);
          }

          return Date.parse(node.acceptBy);
        },

        get amount() {
          return formatMoney(this.status === BountyStatus.Completed ? node.paymentActual : node.paymentPotential);
        },

        get url() {
          return `https://dashboard.twitch.tv/monetization/sponsorships/details/${this.id}`;
        },
      }));
    });
  }

  async fetchThirdPartySponsorships() {
    const responses = await getThirdPartySponsorships();

    return responses.flatMap<ThirdPartySponsorship>(({ data }) => {
      if (data == null) {
        return [];
      }

      return data.thirdPartySponsorshipOffers.edges.map(({ node }) => ({
        id: node.id,

        baseAmount: formatMoney(node.basePay),
        conversionAmount: formatMoney(node.averageEarningsPerConvertedUser),

        brand: {
          imageUrl: node.brandImageURL,
          name: node.brandName,
        },

        url: node.thirdPartyBrokerOfferURL,
      }));
    });
  }

  createNotification(sponsorship: Sponsorship) {
    browser.notifications.create(`sponsorship:${sponsorship.id}`, {
      iconUrl: getIconUrl("purple", 96),
      title: browser.i18n.getMessage("notificationTitle_newTwitchCampaignAvailable"),
      message: sponsorship.brand.name,
      type: "basic",
    });
  }

  filterNewSponsorships(newSponsorships: Sponsorship[], oldSponsorships: Sponsorship[]) {
    return newSponsorships
      .filter((newSponsorship) => newSponsorship.status === BountyStatus.Available)
      .filter((newSponsorship) => oldSponsorships.every((oldSponsorship) => newSponsorship.id !== oldSponsorship.id));
  }

  formatBrand(activities: any[]) {
    let imageUrl = "";
    let name = "";

    activities.forEach((activity) => {
      const { advertiser } = activity;

      if (advertiser) {
        imageUrl ||= advertiser.imageAsset.lightModeURL;
        name ||= advertiser.name;
      }

      name ||= activity.advertiserName;
    });

    return { imageUrl, name };
  }

  formatSponsorshipStatus(input: string) {
    switch (input) {
      case "COMPLETED":
      case "COMPLETE_PAID":
      case "CREATOR_FINISHED":
      case "PENDING_MODERATION":
      case "PENDING_PAYOUT":
        return BountyStatus.Completed;

      case "ACTIVE":
      case "PAUSED":
        return BountyStatus.Live;
    }

    return BountyStatus.Available;
  }
}

export const sponsorshipModule = new SponsorshipModule();
