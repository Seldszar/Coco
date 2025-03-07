import { ChangeEventHandler, ReactNode } from "react";

import { cx, sva } from "~/browser/styled-system/css";
import { Circle } from "~/browser/styled-system/jsx";

const recipe = sva({
  slots: ["root", "input", "indicator", "inner"],

  base: {
    root: {
      alignItems: "center",
      bg: { base: "neutral.200", _dark: "neutral.800" },
      display: "flex",
      gap: 3,
      px: 4,
      py: 3,
      rounded: "md",
      w: "full",

      _hover: {
        bg: { base: "neutral.300", _dark: "neutral.700" },
      },
    },

    input: {
      srOnly: true,
    },

    indicator: {
      borderColor: { base: "black", _dark: "white" },
      borderWidth: 2,
    },

    inner: {
      flex: 1,
    },
  },

  variants: {
    checked: {
      true: {
        root: {
          bg: { base: "neutral.300", _dark: "neutral.700" },
        },

        indicator: {
          borderWidth: 6,
        },
      },
    },
  },
});

export interface RadioProps {
  children?: ReactNode;

  name: string;
  value: string;

  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export function Radio(props: RadioProps) {
  const styles = recipe({
    checked: props.checked,
  });

  return (
    <label className={styles.root}>
      <input
        type="radio"
        name={props.name}
        value={props.value}
        checked={props.checked}
        onChange={props.onChange}
        className={cx("peer", styles.input)}
      />

      <Circle className={styles.indicator} size="20px" />
      <div className={styles.inner}>{props.children}</div>
    </label>
  );
}
