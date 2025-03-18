import { Bounty } from "~/common/types";

import { Box } from "~/browser/styled-system/jsx";

import { Alert } from "./Alert";
import { BountyCard } from "./BountyCard";

interface BountyListProps {
  bounties: Bounty[];
}

export function BountyList(props: BountyListProps) {
  const { bounties } = props;

  return (
    <Box p="3" spaceY="3">
      <Box fontSize="xl" fontWeight="bold">
        Twitch Bounties
      </Box>

      <Box spaceY="2">
        {bounties.length === 0 && <Alert>No bounties available right now</Alert>}

        {bounties.map((bounty) => (
          <BountyCard key={bounty.id} {...{ bounty }} />
        ))}
      </Box>
    </Box>
  );
}
