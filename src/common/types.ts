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
