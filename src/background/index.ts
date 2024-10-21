import { countBounties } from "~/common/helpers";
import { Bounty } from "~/common/types";

import { getBounties, getBountyBoardSettings } from "./twitch";

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
    return "NONE";
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
        status: node.status.toLowerCase(),
        expiresAt: Date.parse(node.expiresAt),
        payout: node.payoutCents / 100,

        campaign: {
          id: campaign.id,
          title: campaign.title,
          boxArtUrl: campaign.boxArtURL || campaign.game.boxArtURL,
        },
      };
    });
  });
}

async function refreshBounties() {
  let bounties = new Array<Bounty>();
  let active = false;

  try {
    const status = await fetchStatus();

    if (status === "ACCEPTED") {
      bounties = await fetchBounties();
      active = true;
    }
  } catch {} // eslint-disable-line no-empty

  const badgeCount = countBounties(bounties, "available");
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

async function checkAlarm() {
  if (await browser.alarms.get()) {
    return;
  }

  refreshBounties();
}

browser.runtime.onMessage.addListener(async (message) => {
  switch (message.type) {
    case "openBountyBoard":
      return openBountyBoard();

    case "refreshBounties":
      return refreshBounties();
  }

  throw new RangeError("Unknown message type");
});

browser.storage.onChanged.addListener(async (changes) => {
  const { bounties } = changes;

  if (bounties == null) {
    return;
  }
  const { newValue = [], oldValue } = bounties;

  if (oldValue == null) {
    return;
  }

  const { settings } = await browser.storage.local.get({
    settings: {
      notifications: false,
    },
  });

  if (settings.notifications) {
    const newBounties = newValue.filter(
      (newItem) =>
        newItem.status === "available" &&
        oldValue.every((oldItem) => newItem.campaign.id !== oldItem.campaign.id),
    );

    if (newBounties.length === 0) {
      return;
    }

    newBounties.forEach((bounty: Bounty) => {
      browser.notifications.create({
        iconUrl: getIconUrl("purple", 96),
        title: browser.i18n.getMessage("notificationTitle_newBountyAvailable"),
        message: bounty.campaign.title,
        type: "basic",
      });
    });
  }
});

browser.alarms.onAlarm.addListener(refreshBounties);

browser.action.onClicked.addListener(openBountyBoard);
browser.notifications.onClicked.addListener(openBountyBoard);

checkAlarm();
