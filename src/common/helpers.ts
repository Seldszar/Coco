import { Bounty } from "./types";

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

export function countBounties(bounties: Bounty[], status: string) {
  return bounties.reduce((count, bounty) => count + Number(bounty.status === status), 0);
}
