import { QueryInput, QueryResult } from "~/common/types";

import BountyBoardSettings from "./queries/BountyBoardSettings.gql";
import BountiesPage from "./queries/BountiesPage.gql";

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

async function query<T = any>(input: QueryInput, initial = true): Promise<T> {
  const { data, errors } = await request<QueryResult<T>>("gql", {
    body: JSON.stringify(initial ? { ...input, query: undefined } : input),
    method: "POST",
    headers: {
      "Client-Integrity": await getIntegrityToken(),
    },
  });

  if (errors == null) {
    return data;
  }

  if (errors.some((error) => error.message === "PersistedQueryNotFound")) {
    return query(input, false);
  }

  throw new Error("An error occured with the GraphQL server");
}

export async function getBountyBoardSettings() {
  const login = await getCookieValue("login");

  return query({
    ...BountyBoardSettings,

    variables: {
      login,
    },
  });
}

interface BountiesPageVariables {
  status: string;
}

export async function getBountiesPage(variables: BountiesPageVariables) {
  const login = await getCookieValue("login");

  return query({
    ...BountiesPage,

    variables: {
      status: variables.status,
      login,
    },
  });
}
