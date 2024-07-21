import { ReactNode } from "react";

import { sva } from "~/browser/styled-system/css";

const recipe = sva({
  slots: ["root", "header"],

  base: {
    root: {
      p: 8,
    },

    header: {
      fontSize: "2xl",
      fontWeight: "bold",
      mb: 4,
    },
  },
});

export interface SectionProps {
  children?: ReactNode;
  header?: ReactNode;
}

export function Section(props: SectionProps) {
  const classes = recipe({
    // ...
  });

  return (
    <section className={classes.root}>
      <header className={classes.header}>{props.header}</header>

      {props.children}
    </section>
  );
}
