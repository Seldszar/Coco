import { countBounties } from "~/common/helpers";
import { Bounty } from "~/common/types";

function getIconUrl(color: string, size: number) {
  return browser.runtime.getURL(`icon-${color}-${size}.png`);
}

async function getCookieValue(name: string) {
  const cookie = await browser.cookies.get({
    url: "https://twitch.tv",
    name,
  });

  if (cookie == null) {
    throw new Error("Cookie not found");
  }

  return cookie.value;
}

async function request<T = any>(input: string, init?: RequestInit) {
  const request = new Request(input, init);

  request.headers.set("Authorization", `OAuth ${await getCookieValue("auth-token")}`);
  request.headers.set("Client-ID", "kimne78kx3ncx6brgo4mv6wki5h1ko");

  const response = await fetch(request);

  if (response.ok) {
    return response.json() as T;
  }

  throw new Error("An error occured with the request");
}

async function fetchIntegrityToken() {
  const { integrity } = await browser.storage.session.get({
    integrity: {
      expiration: 0,
      token: null,
    },
  });

  if (integrity.expiration > Date.now()) {
    return integrity.token;
  }

  const { expiration, token } = await request("https://gql.twitch.tv/integrity", {
    method: "POST",
  });

  await browser.storage.session.set({
    integrity: { expiration, token },
  });

  return token;
}

async function graphql<T = any>(body: any[]) {
  const responses = await request<any[]>("https://gql.twitch.tv/gql", {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "Client-Integrity": await fetchIntegrityToken(),
    },
  });

  return responses.map<T>(({ data, errors }) => {
    if (errors) {
      throw new Error("An error occured with the GraphQL server");
    }

    return data;
  });
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
  const login = await getCookieValue("login");

  const [
    {
      user: { bountyBoardSettings },
    },
  ] = await graphql([
    {
      operationName: "AccessIsBountiesEnabledQuery",
      extensions: {
        persistedQuery: {
          sha256Hash: "30e68974abf8a6396c3ae9fb0d8de1eeae0372b98ad1393ae7287bda6bb04791",
          version: 1,
        },
      },
      variables: {
        channelLogin: login,
      },
    },
  ]);

  return bountyBoardSettings.status;
}

async function fetchBounties() {
  const login = await getCookieValue("login");

  const responses = await graphql([
    {
      operationName: "SunlightBountyBoardDashboard_BountyList",
      extensions: {
        persistedQuery: {
          sha256Hash: "77ce2a5e6c854c657d86206bb77630347707819042b4fa83bcb3aedb77d8238f",
          version: 1,
        },
      },
      variables: {
        status: "AVAILABLE",
        first: 20,
        login,
      },
    },
    {
      operationName: "SunlightBountyBoardDashboard_BountyList",
      extensions: {
        persistedQuery: {
          sha256Hash: "77ce2a5e6c854c657d86206bb77630347707819042b4fa83bcb3aedb77d8238f",
          version: 1,
        },
      },
      variables: {
        status: "LIVE",
        first: 20,
        login,
      },
    },
  ]);

  return responses.flatMap<Bounty>((data) => {
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
          boxArtUrl: campaign.boxArtURL || campaign.game.boxArtURL,
          title: campaign.title,
        },
      };
    });
  });
}

browser.alarms.onAlarm.addListener(async () => {
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
});

browser.runtime.onInstalled.addListener(async () => {
  await browser.alarms.clearAll();

  browser.alarms.create({
    periodInMinutes: 5,
    when: 0,
  });
});

browser.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case "openBountyBoard":
      return openBountyBoard();
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
        newItem.status === "available" && oldValue.every((oldItem) => newItem.id !== oldItem.id),
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

browser.action.onClicked.addListener(openBountyBoard);
browser.notifications.onClicked.addListener(openBountyBoard);
