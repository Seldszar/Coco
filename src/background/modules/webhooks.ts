import { WebhookType } from "~/common/constants";
import { Bounty, Sponsorship, Webhook } from "~/common/types";

import { getLogin } from "../twitch";

class WebhookModule {
  executeWebhook(webhook: Webhook, body: any) {
    return fetch(webhook.url, {
      headers: [["Content-Type", "application/json"]],
      body: JSON.stringify(body),
      method: "POST",
    });
  }

  async formatTestWebhook(webhook: Webhook) {
    const login = await getLogin();

    switch (webhook.type) {
      case WebhookType.Discord:
        return {
          username: browser.i18n.getMessage("extensionName"),
          avatar_url: "https://github.com/Seldszar/Coco/raw/main/public/icon-purple-96.png",
          content: browser.i18n.getMessage("testWebhook_messageContent", login),
        };

      case WebhookType.Slack:
        return {
          text: browser.i18n.getMessage("testWebhook_messageContent", login),
        };
    }

    throw new RangeError("Webhook type not supported");
  }

  async formatBountyWebhook(webhook: Webhook, bounty: Bounty) {
    const login = await getLogin();

    switch (webhook.type) {
      case WebhookType.Discord:
        return {
          username: browser.i18n.getMessage("extensionName"),
          avatar_url: "https://github.com/Seldszar/Coco/raw/main/public/icon-purple-96.png",
          content: browser.i18n.getMessage("twitchBountyWebhook_messageContent", login),
          embeds: [
            {
              title: bounty.campaign.sponsor,
              description: bounty.campaign.title,
              url: "https://dashboard.twitch.tv/bounties",
              color: "11032055",
              thumbnail: {
                url: bounty.campaign.boxArtUrl,
              },
              footer: {
                text: browser.i18n.getMessage("extensionName"),
                icon_url: "https://github.com/Seldszar/Coco/raw/main/public/icon-purple-32.png",
              },
            },
          ],
        };

      case WebhookType.Slack:
        return {
          text: browser.i18n.getMessage("twitchBountyWebhook_messageContent", login),
          blocks: [
            {
              type: "actions",
              elements: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `*<https://dashboard.twitch.tv/bounties|${bounty.campaign.sponsor}>*\n${bounty.campaign.title}`,
                  },
                  accessory: {
                    type: "image",
                    image_url: bounty.campaign.boxArtUrl,
                    alt_text: bounty.campaign.title,
                  },
                },
                {
                  type: "button",
                  url: "https://dashboard.twitch.tv/bounties",
                  text: {
                    type: "plain_text",
                    text: browser.i18n.getMessage("twitchBountyWebhook_buttonLabel"),
                  },
                },
              ],
            },
          ],
        };
    }

    throw new RangeError("Webhook type not supported");
  }

  async formatSponsorshipWebhook(webhook: Webhook, sponsorship: Sponsorship) {
    const login = await getLogin();

    switch (webhook.type) {
      case WebhookType.Discord:
        return {
          username: browser.i18n.getMessage("extensionName"),
          avatar_url: "https://github.com/Seldszar/Coco/raw/main/public/icon-purple-96.png",
          content: browser.i18n.getMessage("twitchCampaignWebhook_messageContent", login),
          embeds: [
            {
              title: sponsorship.brand.name,
              description: sponsorship.description,
              url: "https://dashboard.twitch.tv/monetization/sponsorships",
              color: "11032055",
              thumbnail: {
                url: sponsorship.brand.imageUrl,
              },
              footer: {
                text: browser.i18n.getMessage("extensionName"),
                icon_url: "https://github.com/Seldszar/Coco/raw/main/public/icon-purple-32.png",
              },
            },
          ],
        };

      case WebhookType.Slack:
        return {
          text: browser.i18n.getMessage("twitchCampaignWebhook_messageContent", login),
          blocks: [
            {
              type: "actions",
              elements: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `*<https://dashboard.twitch.tv/monetization/sponsorships|${sponsorship.brand.name}>*\n${sponsorship.description}`,
                  },
                  accessory: {
                    type: "image",
                    image_url: sponsorship.brand.imageUrl,
                    alt_text: sponsorship.brand.name,
                  },
                },
                {
                  type: "button",
                  url: "https://dashboard.twitch.tv/bounties",
                  text: {
                    type: "plain_text",
                    text: browser.i18n.getMessage("twitchCampaignWebhook_buttonLabel"),
                  },
                },
              ],
            },
          ],
        };
    }

    throw new RangeError("Webhook type not supported");
  }

  async executeTestWebhook(webhook: Webhook) {
    return this.executeWebhook(webhook, await this.formatTestWebhook(webhook));
  }

  async executeBountyWebhook(webhook: Webhook, bounty: Bounty) {
    return this.executeWebhook(webhook, await this.formatBountyWebhook(webhook, bounty));
  }

  async executeSponsorshipWebhook(webhook: Webhook, sponsorship: Sponsorship) {
    return this.executeWebhook(webhook, await this.formatSponsorshipWebhook(webhook, sponsorship));
  }
}

export const webhookModule = new WebhookModule();
