import { ReactNode } from "react";

import { sva } from "~/browser/styled-system/css";
import { Flex } from "~/browser/styled-system/jsx";

const recipe = sva({
  slots: ["root", "image", "inner", "name", "details", "payout"],

  base: {
    root: {
      alignItems: "center",
      display: "flex",
      gap: 4,
      px: 4,
      py: 3,

      _hover: {
        bg: { base: "neutral.200", _dark: "neutral.800" },
      },
    },

    image: {
      aspectRatio: "square",
      bg: { base: "white", _dark: "black" },
      h: 14,
      objectFit: "contain",
      objectPosition: "center",
      rounded: "md",
      shadow: "lg",
    },

    inner: {
      flex: 1,
      minW: 0,
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
  url: string;
  title: string;
  payout: string;
  image: string;

  details?: ReactNode;
}

export function BountyCard(props: BountyCardProps) {
  const classes = recipe();

  return (
    <a className={classes.root} href={props.url} target="_blank">
      <img className={classes.image} src={props.image} alt={props.title} />

      <div className={classes.inner}>
        <Flex>
          <h3 className={classes.name} title={props.title}>
            {props.title}
          </h3>

          <strong className={classes.payout}>{props.payout}</strong>
        </Flex>

        <p className={classes.details}>{props.details}</p>
      </div>
    </a>
  );
}
