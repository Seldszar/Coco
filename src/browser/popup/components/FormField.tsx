import { ReactNode } from "react";

import { css, cx, sva } from "~/browser/styled-system/css";

const recipe = sva({
  slots: ["label"],

  base: {
    label: {
      color: { base: "neutral.600", _dark: "neutral.400" },
      fontSize: "sm",
      fontWeight: "bold",
      mb: 2,
      textTransform: "uppercase",
    },
  },
});

export interface FormFieldProps {
  className?: string;

  label?: ReactNode;
  children?: ReactNode;
}

export function FormField(props: FormFieldProps) {
  const styles = recipe({
    // ...
  });

  return (
    <label className={cx(css({ display: "block" }), props.className)}>
      {props.label && <div className={styles.label}>{props.label}</div>}
      {props.children}
    </label>
  );
}
