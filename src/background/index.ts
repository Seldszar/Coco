async function cookie(name: string) {
  const cookie = await browser.cookies.get({
    url: "https://twitch.tv",
    name,
  });

  if (cookie == null) {
    throw new Error("Cookie not found");
  }

  return cookie.value;
}

async function request(input: string, init?: RequestInit) {
  const request = new Request(input, init);

  request.headers.set("Authorization", `OAuth ${await cookie("auth-token")}`);
  request.headers.set("Client-ID", "kimne78kx3ncx6brgo4mv6wki5h1ko");

  const response = await fetch(request);

  if (response.ok) {
    return response.json();
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

async function graphql(body: unknown) {
  const { data, errors } = await request("https://gql.twitch.tv/gql", {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      "Client-Integrity": await fetchIntegrityToken(),
    },
  });

  if (errors) {
    throw new Error("An error occured with the GraphQL server");
  }

  return data;
}

async function openBountyBoard() {
  const [tab] = await browser.tabs.query({
    url: "*://dashboard.twitch.tv/*/bounties*",
  });

  return tab
    ? browser.tabs.update(tab.id, { active: true })
    : browser.tabs.create({ url: "https://dashboard.twitch.tv/bounties" });
}

async function refreshBountyState() {
  const login = await cookie("login");

  const {
    user: { bountyBoardSettings },
  } = await graphql({
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
  });

  if (bountyBoardSettings.status !== "ACCEPTED") {
    return 0;
  }

  const {
    user: { bountiesPage },
  } = await graphql({
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
  });

  return bountiesPage.edges.length;
}

browser.alarms.onAlarm.addListener(async () => {
  let items = {
    online: false,
    count: 0,
  };

  try {
    const count = await refreshBountyState();

    items = {
      online: true,
      count,
    };
  } catch {} // eslint-disable-line no-empty

  const getIconPath = (size: number) =>
    browser.runtime.getURL(`icon-${items.online ? "purple" : "gray"}-${size}.png`);

  await Promise.all([
    browser.action.setBadgeBackgroundColor({
      color: [255, 117, 230, 255],
    }),
    browser.action.setBadgeText({
      text: items.count ? items.count.toString() : null,
    }),
    browser.action.setIcon({
      path: {
        16: getIconPath(16),
        32: getIconPath(32),
      },
    }),
  ]);
});

browser.runtime.onInstalled.addListener(async (details) => {
  if (details.reason !== "install") {
    return;
  }

  browser.alarms.create({
    periodInMinutes: 5,
    when: 0,
  });
});

browser.action.onClicked.addListener(openBountyBoard);
browser.notifications.onClicked.addListener(openBountyBoard);
