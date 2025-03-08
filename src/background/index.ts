import { BountyBoardStatus, BountyStatus, WebhookType } from "~/common/constants";
import { countBounties } from "~/common/helpers";
import { Bounty, Webhook } from "~/common/types";

import { applyMigrations } from "./migrations";
import { getBounties, getBountyBoardSettings, getLogin } from "./twitch";

function getIconUrl(color: string, size: number) {
  return browser.runtime.getURL(`icon-${color}-${size}.png`);
}

async function openBountyBoard() {
  const [tab] = await browser.tabs.query({
    url: "*://dashboard.twitch.tv/*/bounties*",
  });

  return tab
    ? browser.tabs.update(tab.id, { active: true })
    : browser.tabs.create({ url: "https://dashboard.twitch.tv/bounties" });
}

async function fetchStatus() {
  const [{ data }] = await getBountyBoardSettings();

  if (data == null) {
    return BountyBoardStatus.None;
  }

  const {
    user: {
      bountyBoardSettings: { status },
    },
  } = data;

  browser.storage.session.set({
    status,
  });

  return status;
}

async function fetchBounties() {
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
          switch (node.status) {
            case BountyStatus.Completed:
              return Date.parse(node.trackingStoppedAt);

            case BountyStatus.Live:
              return Date.parse(node.expiresAt);
          }

          return Date.parse(campaign.endTime);
        },

        get amount() {
          switch (node.status) {
            case BountyStatus.Completed:
              return node.payoutCents / 100;
          }

          return node.maximumPayoutCents / 100;
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

async function refresh() {
  let bounties = new Array<Bounty>();
  let active = false;

  try {
    const status = await fetchStatus();

    if (status === BountyBoardStatus.Accepted) {
      bounties = await fetchBounties();
      active = true;
    }
  } catch {} // eslint-disable-line no-empty

  const badgeCount = countBounties(bounties, BountyStatus.Available);
  const color = active ? "purple" : "gray";

  browser.storage.session.set({
    bounties,
  });

  browser.action.setBadgeBackgroundColor({
    color: [255, 117, 230, 255],
  });

  browser.action.setBadgeText({
    text: badgeCount ? badgeCount.toString() : null,
  });

  browser.action.setIcon({
    path: {
      16: getIconUrl(color, 16),
      32: getIconUrl(color, 32),
    },
  });

  browser.alarms.create({
    delayInMinutes: 5,
  });
}

async function formatTestWebhook(webhook: Webhook) {
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

async function formatBountyWebhook(webhook: Webhook, bounty: Bounty) {
  const login = await getLogin();

  switch (webhook.type) {
    case WebhookType.Discord:
      return {
        username: browser.i18n.getMessage("extensionName"),
        avatar_url: "https://github.com/Seldszar/Coco/raw/main/public/icon-purple-96.png",
        content: browser.i18n.getMessage("bountyWebhook_messageContent", login),
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
        text: browser.i18n.getMessage("bountyWebhook_messageContent", login),
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
                  text: browser.i18n.getMessage("bountyWebhook_buttonLabel"),
                },
              },
            ],
          },
        ],
      };
  }

  throw new RangeError("Webhook type not supported");
}

async function executeWebhook(webhook: Webhook, body: any) {
  return fetch(webhook.url, {
    headers: [["Content-Type", "application/json"]],
    body: JSON.stringify(body),
    method: "POST",
  });
}

async function executeTestWebhook(webhook: Webhook) {
  return executeWebhook(webhook, await formatTestWebhook(webhook));
}

async function executeBountyWebhook(webhook: Webhook, bounty: Bounty) {
  return executeWebhook(webhook, await formatBountyWebhook(webhook, bounty));
}

async function checkAlarm() {
  if (await browser.alarms.get()) {
    return;
  }

  refresh();
}

browser.runtime.onMessage.addListener(async (message) => {
  switch (message.type) {
    case "executeTestWebhook":
      return executeTestWebhook(message.data);

    case "openBountyBoard":
      return openBountyBoard();

    case "refresh":
      return refresh();
  }

  throw new RangeError("Unknown message type");
});

browser.storage.onChanged.addListener(async (changes) => {
  const { bounties } = changes;

  if (bounties == null) {
    return;
  }

  const { newValue, oldValue } = bounties;

  if (oldValue == null) {
    return;
  }

  const { settings } = await browser.storage.local.get({
    settings: {
      notifications: false,
      webhooks: [],
    },
  });

  const newBounties = newValue.filter(
    (newItem: Bounty) =>
      newItem.status === BountyStatus.Available &&
      oldValue.every((oldItem: Bounty) => newItem.campaign.id !== oldItem.campaign.id),
  );

  if (newBounties.length === 0) {
    return;
  }

  if (settings.notifications) {
    newBounties.forEach((bounty: Bounty) => {
      browser.notifications.create({
        iconUrl: getIconUrl("purple", 96),
        title: browser.i18n.getMessage("notificationTitle_newBountyAvailable"),
        message: bounty.campaign.title,
        type: "basic",
      });
    });
  }

  settings.webhooks.forEach((webhook: Webhook) => {
    newBounties.forEach((bounty: Bounty) => executeBountyWebhook(webhook, bounty));
  });
});

browser.runtime.onInstalled.addListener(async () => {
  await applyMigrations();
  await refresh();
});

browser.runtime.onStartup.addListener(refresh);
browser.alarms.onAlarm.addListener(refresh);

browser.action.onClicked.addListener(openBountyBoard);
browser.notifications.onClicked.addListener(openBountyBoard);

checkAlarm();
