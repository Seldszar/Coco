import { useMemo } from "react";
import { RouteComponentProps } from "wouter";

import { useBounties, useBountyBoardStatus } from "~/browser/common/hooks";
import { Box } from "~/browser/styled-system/jsx";

import { BountyCard } from "../components/BountyCard";
import { EmptyMessage } from "../components/EmptyMessage";

export function Bounties(props: RouteComponentProps) {
  const { params } = props;

  const [status] = useBountyBoardStatus();
  const [bounties] = useBounties();

  const filteredBounties = useMemo(
    () => bounties.filter((bounty) => bounty.status === params.status),
    [bounties, params.status],
  );

  if (status === "ACCEPTED") {
    if (filteredBounties.length === 0) {
      return <EmptyMessage>Your bounties will be displayed here</EmptyMessage>;
    }

    return (
      <Box py={3}>
        {filteredBounties.map((bounty) => (
          <BountyCard key={bounty.id} {...{ bounty }} />
        ))}
      </Box>
    );
  }

  return <EmptyMessage>It seems you don't have access to the Bounty Board</EmptyMessage>;
}
