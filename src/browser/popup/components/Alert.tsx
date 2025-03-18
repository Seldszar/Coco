import { ReactNode } from "react";

import { css } from "~/browser/styled-system/css";

export interface AlertProps {
  children?: ReactNode;
}

export function Alert(props: AlertProps) {
  return (
    <div className={css({ bg: { base: "neutral.200", _dark: "neutral.800" }, p: 4, rounded: "md" })}>
      {props.children}
    </div>
  );
}
