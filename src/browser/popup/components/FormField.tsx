import { ReactNode } from "react";

import { css, cx, sva } from "~/browser/styled-system/css";

const recipe = sva({
  slots: ["header"],

  base: {
    header: {
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
  children?: ReactNode;
  header?: ReactNode;
}

export function FormField(props: FormFieldProps) {
  const styles = recipe({
    // ...
  });

  return (
    <label className={cx(css({ display: "block" }), props.className)}>
      <div className={styles.header}>{props.header}</div>
      {props.children}
    </label>
  );
}
