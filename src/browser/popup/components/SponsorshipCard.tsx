import { Sponsorship } from "~/common/types";

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
      objectFit: "cover",
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

export interface SponsorshipCardProps {
  sponsorship: Sponsorship;
}

export function SponsorshipCard(props: SponsorshipCardProps) {
  const { sponsorship } = props;

  const classes = recipe({
    // ...
  });

  return (
    <a className={classes.root} href={sponsorship.url} target="_blank">
      <img className={classes.image} src={sponsorship.brand.imageUrl} alt={sponsorship.brand.name} />

      <div className={classes.inner}>
        <Flex>
          <h3 className={classes.name} title={sponsorship.brand.name}>
            {sponsorship.brand.name}
          </h3>

          <strong className={classes.payout}>{formatCurrency(sponsorship.amount)}</strong>
        </Flex>

        <p className={classes.details}>
          <BountyDetails status={sponsorship.status} date={sponsorship.date} />
        </p>
      </div>
    </a>
  );
}
