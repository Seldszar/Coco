import { Bounty } from "~/common/types";

import { formatDateTime } from "~/browser/common/helpers";

export interface BountyDetailsProps {
  bounty: Bounty;
}

export function BountyDetails(props: BountyDetailsProps) {
  const { bounty } = props;

  const dateString = formatDateTime(bounty.date);

  switch (bounty.status) {
    case "COMPLETED":
      return `Completed at ${dateString}`;

    case "LIVE":
      return `Expires at ${dateString}`;
  }

  return `Available until ${dateString}`;
}
