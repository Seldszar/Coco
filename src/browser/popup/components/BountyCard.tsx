import { Bounty } from "~/common/types";

import { formatCurrency } from "~/browser/common/helpers";
import { sva } from "~/browser/styled-system/css";

import { BountyDetails } from "./BountyDetails";

const recipe = sva({
  slots: ["root", "image", "inner", "name", "details", "payout"],

  base: {
    root: {
      alignItems: "center",
      display: "flex",
      gap: 4,
      pos: "relative",
      px: 4,
      py: 3,

      _hover: {
        bg: { base: "neutral.200", _dark: "neutral.800" },
      },
    },

    image: {
      aspectRatio: "portrait",
      bg: "black",
      objectFit: "cover",
      objectPosition: "center",
      w: 12,
    },

    inner: {
      flex: 1,
      minW: 0,
    },

    name: {
      fontWeight: "bold",
      truncate: true,
    },

    details: {
      color: { base: "neutral.600", _dark: "neutral.400" },
    },

    payout: {},
  },
});

export interface BountyCardProps {
  bounty: Bounty;
}

export function BountyCard(props: BountyCardProps) {
  const { bounty } = props;

  const classes = recipe({
    // ...
  });

  return (
    <a
      className={classes.root}
      href={`https://dashboard.twitch.tv/bounties/${bounty.id}`}
      target="_blank"
    >
      <img className={classes.image} src={bounty.campaign.boxArtUrl} alt={bounty.campaign.title} />

      <div className={classes.inner}>
        <h3 className={classes.name} title={bounty.campaign.title}>
          {bounty.campaign.title}
        </h3>

        <p className={classes.details}>
          <BountyDetails bounty={bounty} />
        </p>
      </div>

      <strong className={classes.payout}>{formatCurrency(bounty.amount)}</strong>
    </a>
  );
}
