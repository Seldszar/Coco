import { ReactNode } from "react";

import { sva } from "~/browser/styled-system/css";

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
  children?: ReactNode;
  header?: ReactNode;
}

export function FormField(props: FormFieldProps) {
  const styles = recipe({
    // ...
  });

  return (
    <label>
      <div className={styles.header}>Theme</div>
      {props.children}
    </label>
  );
}
