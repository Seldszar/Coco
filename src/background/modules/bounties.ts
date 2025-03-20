import { BountyStatus } from "~/common/constants";
import { getIconUrl } from "~/common/helpers";
import { Bounty } from "~/common/types";

import { getBountyBoardSettings, getBounties } from "../twitch";

class BountyModule {
  async openBountyBoard() {
    const [tab] = await browser.tabs.query({
      url: "*://dashboard.twitch.tv/*/bounties*",
    });

    return tab
      ? browser.tabs.update(tab.id, { active: true })
      : browser.tabs.create({ url: "https://dashboard.twitch.tv/bounties" });
  }

  openBountyPage(bounty: Bounty) {
    return browser.tabs.create({ url: bounty.url });
  }

  async fetchBountyBoardStatus() {
    const [{ data }] = await getBountyBoardSettings();

    if (data == null) {
      return false;
    }

    const {
      user: {
        bountyBoardSettings: { status },
      },
    } = data;

    return status === "ACCEPTED";
  }

  async fetchBounties() {
    const responses = await getBounties();

    return responses.flatMap<Bounty>(({ data }) => {
      if (data == null) {
        return [];
      }

      const {
        user: { bountiesPage },
      } = data;

      return bountiesPage.edges.map(({ node }) => {
        const { campaign } = node;

        return {
          id: node.id,
          status: node.status,

          get date() {
            switch (this.status) {
              case BountyStatus.Completed:
                return Date.parse(node.trackingStoppedAt);

              case BountyStatus.Live:
                return Date.parse(node.expiresAt);
            }

            return Date.parse(campaign.endTime);
          },

          get amount() {
            switch (this.status) {
              case BountyStatus.Completed:
                return node.payoutCents / 100;
            }

            return node.maximumPayoutCents / 100;
          },

          get url() {
            return `https://dashboard.twitch.tv/bounties/${this.id}`;
          },

          campaign: {
            id: campaign.id,
            title: campaign.title,
            sponsor: campaign.sponsor,
            displayName: campaign.displayName || campaign.game.displayName,
            boxArtUrl: campaign.boxArtURL || campaign.game.boxArtURL,
          },
        };
      });
    });
  }

  createNotification(bounty: Bounty) {
    browser.notifications.create(`bounty:${bounty.id}`, {
      iconUrl: getIconUrl("purple", 96),
      title: browser.i18n.getMessage("notificationTitle_newTwitchBountyAvailable"),
      message: bounty.campaign.title,
      type: "basic",
    });
  }
}

export const bountyModule = new BountyModule();
