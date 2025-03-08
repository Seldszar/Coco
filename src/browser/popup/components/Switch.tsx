import { HTMLProps, ReactNode } from "react";

import { cx, sva } from "~/browser/styled-system/css";
import { Circle } from "~/browser/styled-system/jsx";

const recipe = sva({
  slots: ["root", "input", "inner", "icon"],

  base: {
    root: {
      alignItems: "center",
      display: "flex",
      gap: 3,
    },

    input: {
      srOnly: true,
    },

    inner: {
      flex: 1,
    },

    icon: {
      bg: { base: "neutral.400", _dark: "neutral.600" },
      display: "flex",
      flex: "none",
      p: "4px",
      rounded: "full",
      w: 12,

      _peerChecked: {
        bg: "purple.500",
        justifyContent: "end",
      },
    },
  },
});

export interface SwitchProps extends HTMLProps<HTMLInputElement> {
  children?: ReactNode;
}

export function Switch(props: SwitchProps) {
  const styles = recipe({
    // ...
  });

  return (
    <label className={styles.root}>
      <input {...props} type="checkbox" className={cx("peer", styles.input)} />

      <div className={styles.icon}>
        <Circle bg="white" size="14px" />
      </div>

      {props.children && <div className={styles.inner}>{props.children}</div>}
    </label>
  );
}
