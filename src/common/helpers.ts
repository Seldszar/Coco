import { BountyStatus } from "./constants";

export class Deferred<T> {
  readonly promise: Promise<T>;

  resolve!: (value: T | PromiseLike<T>) => void;
  reject!: (reason?: any) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export function formatMoney(input: any) {
  return {
    amount: input.amount / Math.pow(10, input.minorUnits),
    currencyCode: input.currencyCode,
  };
}

export function formatBrand(activities: any[]) {
  let imageUrl = "";
  let name = "";

  activities.forEach((activity) => {
    const { advertiser } = activity;

    if (advertiser) {
      imageUrl ||= advertiser.imageAsset.lightModeURL;
      name ||= advertiser.name;
    }

    name ||= activity.advertiserName;
  });

  return { imageUrl, name };
}

export function formatSponsorshipStatus(input: string) {
  switch (input) {
    case "COMPLETED":
    case "COMPLETE_PAID":
    case "CREATOR_FINISHED":
    case "PENDING_MODERATION":
    case "PENDING_PAYOUT":
      return BountyStatus.Completed;

    case "ACTIVE":
    case "PAUSED":
      return BountyStatus.Live;
  }

  return BountyStatus.Available;
}

export function arrayCount<T>(items: T[], callback: (item: T) => boolean) {
  return items.reduce((count, item) => count + Number(callback(item)), 0);
}

export function getIconUrl(color: string, size: number) {
  return browser.runtime.getURL(`icon-${color}-${size}.png`);
}
