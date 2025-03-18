import { Bounty } from "~/common/types";

import { formatCurrency } from "~/browser/common/helpers";
import { sva } from "~/browser/styled-system/css";

import { BountyDetails } from "./BountyDetails";
import { Flex } from "~/browser/styled-system/jsx";

const recipe = sva({
  slots: ["root", "image", "inner", "name", "details", "payout"],

  base: {
    root: {
      bg: { base: "neutral.200", _dark: "neutral.800" },
      display: "flex",
      overflow: "hidden",
      rounded: "md",
    },

    image: {
      aspectRatio: "square",
      bg: { base: "white", _dark: "black" },
      h: "64px",
      objectFit: "contain",
      objectPosition: "center",
    },

    inner: {
      flex: 1,
      minW: 0,
      px: 4,
      py: 3,
    },

    name: {
      flex: 1,
      fontWeight: "bold",
      truncate: true,
    },

    details: {
      color: { base: "black/50", _dark: "white/50" },
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
    <a className={classes.root} href={bounty.url} target="_blank">
      <img className={classes.image} src={bounty.campaign.boxArtUrl} alt={bounty.campaign.title} />

      <div className={classes.inner}>
        <Flex>
          <h3 className={classes.name} title={bounty.campaign.title}>
            {bounty.campaign.title}
          </h3>

          <strong className={classes.payout}>{formatCurrency({ amount: bounty.amount, currencyCode: "USD" })}</strong>
        </Flex>

        <p className={classes.details}>
          <BountyDetails status={bounty.status} date={bounty.date} />
        </p>
      </div>
    </a>
  );
}
