import { BountyStatus, WebhookType } from "./constants";

export interface BountyCampaign {
  id: string;
  title: string;
  sponsor: string;
  displayName: string;
  boxArtUrl: string;
}

export interface Bounty {
  id: string;
  status: BountyStatus;
  date: number;
  amount: number;
  campaign: BountyCampaign;
}

export interface Webhook {
  id: string;
  type: WebhookType;
  url: string;
}

export interface QueryInput {
  operationName?: string;
  query?: string;
  variables?: Record<string, any>;
  extensions?: {
    persistedQuery: {
      sha256Hash: string;
      version: number;
    };
  };
}

export interface QueryOperation {
  input: QueryInput;

  index: number;
  retry?: boolean;
}

export interface QueryResult<T = any> {
  errors?: Error[];
  data: T;
}
