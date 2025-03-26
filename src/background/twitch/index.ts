import { QueryInput, QueryOperation, QueryResult } from "~/common/types";

import BountiesPage from "./queries/BountiesPage.gql";
import BountyBoardSettings from "./queries/BountyBoardSettings.gql";
import SponsorshipChannelSettings from "./queries/SponsorshipChannelSettings.gql";
import Sponsorships from "./queries/Sponsorships.gql";
import ThirdPartySponsorships from "./queries/ThirdPartySponsorships.gql";

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
  const url = new URL(input, "https://gql.twitch.tv");
  const request = new Request(url, init);

  request.headers.set("Authorization", `OAuth ${await getCookieValue("auth-token")}`);
  request.headers.set("Client-ID", process.env.TWITCH_CLIENT_ID as string);

  const response = await fetch(request);

  if (response.ok) {
    return response.json() as T;
  }

  throw new Error("An error occured with the request");
}

async function getIntegrityToken() {
  const { integrity } = await browser.storage.session.get({
    integrity: {
      expiration: 0,
      token: null,
    },
  });

  if (integrity.expiration > Date.now()) {
    return integrity.token;
  }

  const { expiration, token } = await request("integrity", {
    method: "POST",
  });

  browser.storage.session.set({
    integrity: { expiration, token },
  });

  return token;
}

async function executeOperations(operations: QueryOperation[], cachedResults: QueryResult[]) {
  const results = await request<QueryResult[]>("gql", {
    method: "POST",
    body: JSON.stringify(operations.map(({ retry, input: { query, ...rest } }) => (retry ? { query, ...rest } : rest))),
    headers: {
      "Client-Integrity": await getIntegrityToken(),
    },
  });

  const retryOperations = new Array<QueryOperation>();

  results.forEach((result, index) => {
    const { [index]: operation } = operations;

    if (operation == null) {
      return;
    }

    cachedResults[operation.index] = result;

    if (result.errors?.some((error) => error.message === "PersistedQueryNotFound")) {
      retryOperations.push({ ...operation, retry: true });
    }
  });

  if (retryOperations.length > 0) {
    await executeOperations(retryOperations, cachedResults);
  }

  return cachedResults;
}

async function query(input: QueryInput[]) {
  return executeOperations(
    input.map((input, index) => ({ input, index })),
    [],
  );
}

export function getLogin() {
  return getCookieValue("login");
}

export async function getBountyBoardSettings() {
  const login = await getLogin();

  return query([
    {
      ...BountyBoardSettings,

      variables: {
        login,
      },
    },
  ]);
}

export async function getBounties() {
  const login = await getLogin();

  return query([
    {
      ...BountiesPage,

      variables: {
        status: "AVAILABLE",
        first: 100,
        login,
      },
    },
    {
      ...BountiesPage,

      variables: {
        status: "COMPLETED",
        first: 100,
        login,
      },
    },
    {
      ...BountiesPage,

      variables: {
        status: "LIVE",
        first: 100,
        login,
      },
    },
  ]);
}

export async function getSponsorshipChannelSettings() {
  const login = await getLogin();

  return query([
    {
      ...SponsorshipChannelSettings,

      variables: {
        login,
      },
    },
  ]);
}

export async function getSponsorships() {
  return query([
    {
      ...Sponsorships,

      variables: {
        query: {
          stateCategory: "INVITATION",
        },
      },
    },
    {
      ...Sponsorships,

      variables: {
        query: {
          stateCategory: "ACTIVE",
        },
      },
    },
    {
      ...Sponsorships,

      variables: {
        query: {
          stateCategory: "COMPLETED",
        },
      },
    },
  ]);
}

export async function getThirdPartySponsorships() {
  return query([
    {
      ...ThirdPartySponsorships,

      variables: {
        first: 100,
      },
    },
  ]);
}
