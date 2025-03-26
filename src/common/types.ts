import { BountyStatus, WebhookType } from "./constants";

export interface Money {
  currencyCode: string;
  amount: number;
}

export interface BountyCampaign {
  id: string;
  title: string;
  sponsor: string;
  displayName: string;
  boxArtUrl: string;
}

export interface Bounty {
  id: string;
  date: number;
  amount: number;
  status: BountyStatus;
  campaign: BountyCampaign;
  url: string;
}

export interface SponsorshipBrand {
  imageUrl: string;
  name: string;
}

export interface Sponsorship {
  id: string;
  date: number;
  description: string;
  status: BountyStatus;
  brand: SponsorshipBrand;
  amount: Money;
  url: string;
}

export interface ThirdPartySponsorship {
  id: string;
  url: string;
  brand: SponsorshipBrand;
  conversionAmount: Money;
  baseAmount: Money;
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
