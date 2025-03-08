import { Bounty } from "~/common/types";

import { formatDateTime } from "~/browser/common/helpers";
import { BountyStatus } from "~/common/constants";

export interface BountyDetailsProps {
  bounty: Bounty;
}

export function BountyDetails(props: BountyDetailsProps) {
  const { bounty } = props;

  const dateString = formatDateTime(bounty.date);

  switch (bounty.status) {
    case BountyStatus.Completed:
      return `Completed at ${dateString}`;

    case BountyStatus.Live:
      return `Expires at ${dateString}`;
  }

  return `Available until ${dateString}`;
}
