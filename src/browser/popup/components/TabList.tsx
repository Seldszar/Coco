import { Link } from "wouter";

import { cva, cx, sva } from "~/browser/styled-system/css";

const recipe = sva({
  slots: ["root", "badge"],

  base: {
    root: {
      display: "flex",
    },

    badge: {
      bg: "purple.500",
      color: "white",
      ml: 1,
      px: 1.5,
      py: 0.5,
      rounded: "sm",
    },
  },
});

const tab = cva({
  base: {
    py: 4,
  },

  variants: {
    isActive: {
      true: {
        shadow: "inset 0 -3px 0 {colors.purple.500}",
      },
    },
  },
});

export interface TabListProps {
  className?: string;

  items: any[];
}

export function TabList(props: TabListProps) {
  const { items } = props;

  const classes = recipe({
    // ...
  });

  return (
    <nav className={cx(classes.root, props.className)}>
      {items.map((item, index) => (
        <Link key={index} href={item.href} className={(isActive) => tab({ isActive })}>
          <strong>{item.title}</strong>

          {item.badgeText ? <sup className={classes.badge}>{item.badgeText}</sup> : null}
        </Link>
      ))}
    </nav>
  );
}
