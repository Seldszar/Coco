export interface BountyCampaign {
  boxArtUrl: string;
  title: string;
}

export interface Bounty {
  id: string;
  status: string;
  expiresAt: number;
  payout: number;

  campaign: BountyCampaign;
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

export interface QueryResult<T> {
  errors?: Error[];
  data: T;
}
