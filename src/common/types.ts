export interface BountyCampaign {
  id: string;
  title: string;
  boxArtUrl: string;
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

export interface QueryOperation {
  input: QueryInput;

  index: number;
  retry?: boolean;
}

export interface QueryResult<T = any> {
  errors?: Error[];
  data: T;
}
