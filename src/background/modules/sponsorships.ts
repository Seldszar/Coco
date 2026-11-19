import { BountyStatus } from "~/common/constants";
import { formatMoney, getIconUrl } from "~/common/helpers";
import { Sponsorship, ThirdPartySponsorship } from "~/common/types";

import { getSponsorshipInstances, getThirdPartySponsorshipOffers, getUser } from "../twitch";

class SponsorshipModule {
  async openSponsorshipBoard() {
    const [tab] = await browser.tabs.query({
      url: "*://dashboard.twitch.tv/*/monetization/sponsorships*",
    });

    const user = await getUser();

    return tab
      ? browser.tabs.update(tab.id, { active: true })
      : browser.tabs.create({ url: `https://dashboard.twitch.tv/u/${user.login}/monetization/sponsorships` });
  }

  openSponsorshipPage(sponsorship: Sponsorship) {
    return browser.tabs.create({ url: sponsorship.url });
  }

  async fetchSponsorshipPortalAccess() {
    const user = await getUser();

    return user.roles.isAffiliate || user.roles.isPartner;
  }

  async fetchSponsorships() {
    const responses = await getSponsorshipInstances();

    return responses.flatMap<Sponsorship>(({ data }) => {
      if (data.sponsorshipInstances == null) {
        return [];
      }

      return data.sponsorshipInstances.edges.map(({ node }) => ({
        id: node.id,
        description: node.description,
        campaignId: node.campaignID,

        status: this.formatSponsorshipStatus(node.state),
        brand: this.formatBrand(node.advertiser),

        get date() {
          return Date.parse(node.endsAt);
        },

        get amount() {
          return formatMoney(
            this.status === BountyStatus.Completed ? node.self.paymentActual : node.self.paymentMaximum,
          );
        },

        get url() {
          return `https://dashboard.twitch.tv/monetization/sponsorships/details/${this.id.replace("campaignInstance.", "")}`;
        },
      }));
    });
  }

  async fetchThirdPartySponsorships() {
    const responses = await getThirdPartySponsorshipOffers();

    return responses.flatMap<ThirdPartySponsorship>(({ data }) => {
      if (data.thirdPartySponsorshipOffers == null) {
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
      .filter((newSponsorship) =>
        oldSponsorships.every((oldSponsorship) => newSponsorship.campaignId !== oldSponsorship.campaignId),
      );
  }

  formatBrand(advertiser: any) {
    const imageUrl = advertiser.imageAsset.lightModeURL;
    const name = advertiser.name;

    return { imageUrl, name };
  }

  formatSponsorshipStatus(input: string) {
    switch (input) {
      case "PENDING_CREATOR_APPROVAL":
        return BountyStatus.Available;

      case "ACTIVE":
      case "PAUSED":
      case "PENDING_CREATOR_RESIGN":
        return BountyStatus.Active;

      case "COMPLETED":
      case "COMPLETE_PAID":
      case "CREATOR_FINISHED":
      case "PENDING_MODERATION":
      case "PENDING_PAYOUT":
      case "PENDING_AUDIT":
      case "PENDING_PERFORMANCE_CALCULATION":
        return BountyStatus.Completed;
    }

    return BountyStatus.None;
  }
}

export const sponsorshipModule = new SponsorshipModule();
