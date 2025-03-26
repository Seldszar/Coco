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

export function arrayCount<T>(items: T[], callback: (item: T) => boolean) {
  return items.reduce((count, item) => count + Number(callback(item)), 0);
}

export function getIconUrl(color: string, size: number) {
  return browser.runtime.getURL(`icon-${color}-${size}.png`);
}

export function getBountyStatus(input: string) {
  switch (input) {
    case "available":
      return BountyStatus.Available;

    case "completed":
      return BountyStatus.Completed;

    case "live":
      return BountyStatus.Live;
  }

  throw new RangeError("Invalid bounty status");
}
