import { BountyStatus } from "~/common/constants";
import { arrayCount } from "~/common/helpers";
import { Bounty, Sponsorship, ThirdPartySponsorship } from "~/common/types";

import { applyMigrations } from "./migrations";

import { fetchBountyBoardStatus, fetchBounties, openBountyBoard } from "./modules/bounties";
import {
  fetchSponsorshipBoardStatus,
  fetchSponsorships,
  fetchThirdPartySponsorships,
  openSponsorshipBoard,
} from "./modules/sponsorships";
import { executeBountyWebhook, executeSponsorshipWebhook, executeTestWebhook } from "./modules/webhooks";

function getIconUrl(color: string, size: number) {
  return browser.runtime.getURL(`icon-${color}-${size}.png`);
}

async function refresh() {
  let bounties = new Array<Bounty>();
  let sponsorships = new Array<Sponsorship>();
  let thirdPartySponsorships = new Array<ThirdPartySponsorship>();

  let enabled = false;
  let count = 0;

  try {
    const status = await fetchBountyBoardStatus();

    if (status) {
      bounties = bounties.concat(await fetchBounties());

      count += arrayCount(bounties, (item) => item.status === BountyStatus.Available);
      enabled = true;
    }
  } catch (error) {
    console.error("An error occured while fetching bounties", error);
  }

  try {
    const status = await fetchSponsorshipBoardStatus();

    if (status) {
      sponsorships = sponsorships.concat(await fetchSponsorships());
      thirdPartySponsorships = thirdPartySponsorships.concat(await fetchThirdPartySponsorships());

      count += arrayCount(sponsorships, (item) => item.status === BountyStatus.Available);
      enabled = true;
    }
  } catch (error) {
    console.error("An error occured while fetching sponsorships", error);
  }

  browser.storage.session.set({
    enabled,

    thirdPartySponsorships,
    sponsorships,
    bounties,
  });

  browser.action.setBadgeBackgroundColor({
    color: [255, 117, 230, 255],
  });

  browser.action.setBadgeText({
    text: count ? count.toString() : null,
  });

  const color = enabled ? "purple" : "gray";

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

  refresh();
}

browser.runtime.onMessage.addListener(async (message) => {
  switch (message.type) {
    case "executeTestWebhook":
      return executeTestWebhook(message.data);

    case "openBountyBoard":
      return openBountyBoard();

    case "openSponsorshipBoard":
      return openSponsorshipBoard();

    case "refresh":
      return refresh();
  }

  throw new RangeError("Unknown message type");
});

interface StorageChange<T> {
  newValue?: T;
  oldValue?: T;
}

function isNewBounty(newBounty: Bounty, oldBounties: Bounty[]) {
  return oldBounties.every((oldBounty) => newBounty.id !== oldBounty.id);
}

function getNewBounties(change: StorageChange<Bounty[]>) {
  const { newValue, oldValue } = change;

  if (newValue == null || oldValue == null) {
    return [];
  }

  return newValue
    .filter((value) => value.status === BountyStatus.Available)
    .filter((value) => isNewBounty(value, oldValue));
}

function isNewSponsorship(newSponsorship: Sponsorship, oldSponsorships: Sponsorship[]) {
  return oldSponsorships.every((oldSponsorship) => newSponsorship.id !== oldSponsorship.id);
}

function getNewSponsorships(change: StorageChange<Sponsorship[]>) {
  const { newValue, oldValue } = change;

  if (newValue == null || oldValue == null) {
    return [];
  }

  return newValue
    .filter((value) => value.status === BountyStatus.Available)
    .filter((value) => isNewSponsorship(value, oldValue));
}

browser.storage.onChanged.addListener(async (changes) => {
  const { settings } = await browser.storage.local.get({
    settings: {
      notifications: false,
      webhooks: [],
    },
  });

  if (changes.bounties) {
    const bounties = getNewBounties(changes.bounties);

    if (settings.notifications) {
      bounties.forEach((bounty) => {
        browser.notifications.create({
          iconUrl: getIconUrl("purple", 96),
          title: browser.i18n.getMessage("notificationTitle_newTwitchBountyAvailable"),
          message: bounty.campaign.title,
          type: "basic",
        });
      });
    }

    settings.webhooks.forEach((webhook) => {
      bounties.forEach((bounty) => executeBountyWebhook(webhook, bounty));
    });
  }

  if (changes.sponsorships) {
    const sponsorships = getNewSponsorships(changes.sponsorships);

    if (settings.notifications) {
      sponsorships.forEach((sponsorship) => {
        browser.notifications.create({
          iconUrl: getIconUrl("purple", 96),
          title: browser.i18n.getMessage("notificationTitle_newTwitchCampaignAvailable"),
          message: sponsorship.brand.name,
          type: "basic",
        });
      });
    }

    settings.webhooks.forEach((webhook) => {
      sponsorships.forEach((sponsorship) => executeSponsorshipWebhook(webhook, sponsorship));
    });
  }
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
