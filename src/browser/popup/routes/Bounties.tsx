import { useMemo } from "react";
import { DefaultParams, RouteComponentProps } from "wouter";

import { BountyBoardStatus } from "~/common/constants";

import { useBounties, useBountyBoardStatus } from "~/browser/common/hooks";
import { Box } from "~/browser/styled-system/jsx";

import { BountyCard } from "../components/BountyCard";
import { Button } from "../components/Button";
import { EmptyMessage } from "../components/EmptyMessage";

interface RouteParams extends DefaultParams {
  status: string;
}

export function Bounties(props: RouteComponentProps<RouteParams>) {
  const { params } = props;

  const [status] = useBountyBoardStatus();
  const [bounties] = useBounties();

  const filteredBounties = useMemo(
    () => bounties.filter((bounty) => bounty.status === params.status.toUpperCase()),
    [bounties, params.status],
  );

  const refresh = () =>
    browser.runtime.sendMessage({
      type: "refresh",
    });

  if (status === BountyBoardStatus.Accepted) {
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

  return (
    <EmptyMessage>
      <Box pb={3}>It seems you don't have access to the Bounty Board</Box>
      <Button onClick={() => refresh()}>Retry</Button>
    </EmptyMessage>
  );
}
