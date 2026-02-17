import { BountyStatus } from "~/common/constants";

import { formatDateTime } from "~/browser/common/helpers";

export interface BountyDetailsProps {
  status: BountyStatus;
  date: number;
}

export function BountyDetails(props: BountyDetailsProps) {
  const dateString = formatDateTime(props.date);

  switch (props.status) {
    case BountyStatus.Completed:
      return `Completed at ${dateString}`;

    case BountyStatus.Active:
      return `Expires at ${dateString}`;
  }

  return `Available until ${dateString}`;
}
