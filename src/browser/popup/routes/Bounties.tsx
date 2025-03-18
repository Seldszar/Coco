import { useMemo } from "react";
import { DefaultParams, RouteComponentProps } from "wouter";

import { useBounties, useSponsorships, useStatus } from "~/browser/common/hooks";
import { css } from "~/browser/styled-system/css";
import { Box } from "~/browser/styled-system/jsx";

import { BountyList } from "../components/BountyList";
import { Button } from "../components/Button";
import { SponsorshipList } from "../components/SponsorshipList";

interface RouteParams extends DefaultParams {
  status: string;
}

export function Bounties(props: RouteComponentProps<RouteParams>) {
  const { params } = props;

  const [status] = useStatus();
  const [bounties] = useBounties();
  const [sponsorships] = useSponsorships();

  const filteredBounties = useMemo(
    () => bounties.filter((bounty) => bounty.status === params.status.toUpperCase()),
    [bounties, params.status],
  );

  const filteredSponsorships = useMemo(
    () => sponsorships.filter((sponsorship) => sponsorship.status === params.status.toUpperCase()),
    [sponsorships, params.status],
  );

  const refresh = () =>
    browser.runtime.sendMessage({
      type: "refresh",
    });

  if (status) {
    return (
      <Box py="3">
        <BountyList bounties={filteredBounties} />
        <SponsorshipList sponsorships={filteredSponsorships} />
      </Box>
    );
  }

  return (
    <div className={css({ p: 8, spaceY: 2 })}>
      <svg className={css({ fill: "current", mx: "auto", w: 12 })} viewBox="0 0 704 704">
        <path d="M142.455,166.554c44.375,-76.861 184.013,-79.443 311.632,-5.763c127.618,73.681 195.201,195.902 150.825,272.763c-90.007,155.898 -266.692,222.648 -394.311,148.967c-127.619,-73.681 -158.154,-260.069 -68.146,-415.967Zm207.856,254.142l-0.081,-0.022l1.984,82.174l70.475,-59.626c56.594,9.934 103.971,-1.131 122.819,-33.777c30.209,-52.323 -24.234,-140.396 -121.502,-196.553c-97.267,-56.157 -200.761,-59.27 -230.97,-6.947c-30.209,52.323 24.234,140.395 121.501,196.553c11.88,6.859 23.853,12.926 35.774,18.198Z" />
      </svg>

      <div className={css({ fontWeight: "medium", spaceY: 3, textAlign: "center" })}>
        <div>It seems you don't have access to the Bounty Board</div>
        <Button onClick={() => refresh()}>Retry</Button>
      </div>
    </div>
  );
}
