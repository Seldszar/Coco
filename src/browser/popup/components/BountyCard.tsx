import { Bounty } from "~/common/types";

import { currencyAmount, shortDateTime } from "~/browser/common/helpers";
import { sva } from "~/browser/styled-system/css";

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

        <p className={classes.details}>Expires at {shortDateTime(bounty.expiresAt)}</p>
      </div>

      <strong className={classes.payout}>{currencyAmount(bounty.payout)}</strong>
    </a>
  );
}
