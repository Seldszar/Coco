import { useMemo } from "react";
import { RouteComponentProps } from "wouter";

import { useBounties } from "~/browser/common/hooks";
import { Box } from "~/browser/styled-system/jsx";

import { BountyCard } from "../components/BountyCard";
import { EmptyMessage } from "../components/EmptyMessage";

export function Bounties(props: RouteComponentProps) {
  const { params } = props;

  const [bounties] = useBounties();

  const filteredBounties = useMemo(
    () => bounties.filter((bounty) => bounty.status === params.status),
    [bounties, params.status],
  );

  return (
    <Box py={3}>
      {filteredBounties.length === 0 && (
        <EmptyMessage>Your bounties will be displayed here</EmptyMessage>
      )}

      {filteredBounties.map((bounty) => (
        <BountyCard key={bounty.id} {...{ bounty }} />
      ))}
    </Box>
  );
}
