import { Sponsorship } from "~/common/types";

import { Box } from "~/browser/styled-system/jsx";

import { Alert } from "./Alert";
import { SponsorshipCard } from "./SponsorshipCard";

interface SponsorshipListProps {
  sponsorships: Sponsorship[];
}

export function SponsorshipList(props: SponsorshipListProps) {
  const { sponsorships } = props;

  return (
    <Box p="3" spaceY="3">
      <Box fontSize="xl" fontWeight="bold">
        Twitch Campaigns
      </Box>

      <Box spaceY="2">
        {sponsorships.length === 0 && <Alert>No campaign available right now</Alert>}

        {sponsorships.map((sponsorship) => (
          <SponsorshipCard key={sponsorship.id} {...{ sponsorship }} />
        ))}
      </Box>
    </Box>
  );
}
