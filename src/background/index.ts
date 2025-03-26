import { BountyStatus } from "~/common/constants";
import { arrayCount, getIconUrl } from "~/common/helpers";
import { Bounty, Sponsorship, ThirdPartySponsorship } from "~/common/types";

import { applyMigrations } from "./migrations";

import { bountyModule } from "./modules/bounties";
import { sponsorshipModule } from "./modules/sponsorships";
import { webhookModule } from "./modules/webhooks";

async function refresh() {
  let bounties = new Array<Bounty>();
  let sponsorships = new Array<Sponsorship>();
  let thirdPartySponsorships = new Array<ThirdPartySponsorship>();

  let enabled = false;
  let count = 0;

  try {
    const status = await bountyModule.fetchBountyBoardStatus();

    if (status) {
      bounties = bounties.concat(await bountyModule.fetchBounties());

      count += arrayCount(bounties, (item) => item.status === BountyStatus.Available);
      enabled = true;
    }
  } catch (error) {
    console.error("An error occured while fetching bounties", error);
  }

  try {
    const status = await sponsorshipModule.fetchSponsorshipBoardStatus();

    if (status) {
      sponsorships = sponsorships.concat(await sponsorshipModule.fetchSponsorships());
      thirdPartySponsorships = thirdPartySponsorships.concat(await sponsorshipModule.fetchThirdPartySponsorships());

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
    delayInMinutes: 1,
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
      return webhookModule.executeTestWebhook(message.data);

    case "openBountyBoard":
      return bountyModule.openBountyBoard();

    case "openSponsorshipBoard":
      return sponsorshipModule.openSponsorshipBoard();

    case "refresh":
      return refresh();
  }

  throw new RangeError("Unknown message type");
});

browser.storage.onChanged.addListener(async (changes) => {
  const { settings } = await browser.storage.local.get({
    settings: {
      notifications: false,
      webhooks: [],
    },
  });

  if (changes.bounties) {
    const { newValue = [], oldValue = [] } = changes.bounties;

    if (newValue.length > 0) {
      const bounties = bountyModule.filterNewBounties(newValue, oldValue);

      if (settings.notifications) {
        bounties.forEach(bountyModule.createNotification);
      }

      settings.webhooks.forEach((webhook) => {
        bounties.forEach((bounty) => webhookModule.executeBountyWebhook(webhook, bounty));
      });
    }
  }

  if (changes.sponsorships) {
    const { newValue = [], oldValue = [] } = changes.sponsorships;

    if (newValue.length > 0) {
      const sponsorships = sponsorshipModule.filterNewSponsorships(newValue, oldValue);

      if (settings.notifications) {
        sponsorships.forEach(sponsorshipModule.createNotification);
      }

      settings.webhooks.forEach((webhook) => {
        sponsorships.forEach((sponsorship) => webhookModule.executeSponsorshipWebhook(webhook, sponsorship));
      });
    }
  }
});

browser.runtime.onInstalled.addListener(async () => {
  await applyMigrations();
  await refresh();
});

browser.runtime.onStartup.addListener(refresh);
browser.alarms.onAlarm.addListener(refresh);

browser.notifications.onClicked.addListener((notificationId) => {
  const [type] = notificationId.split(":");

  switch (type) {
    case "bounty":
      return bountyModule.openBountyBoard();

    case "sponsorship":
      return sponsorshipModule.openSponsorshipBoard();
  }
});

checkAlarm();
