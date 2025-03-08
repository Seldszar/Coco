import { IconSelector } from "@tabler/icons-react";
import { HTMLProps } from "react";

import { css, cx } from "~/browser/styled-system/css";

export interface SelectOption<T extends string | number> {
  label: string;
  value: T;
}

export interface SelectProps<T extends string | number> extends HTMLProps<HTMLSelectElement> {
  options: SelectOption<T>[];
}

export function Select<T extends string | number>(props: SelectProps<T>) {
  const { className, ...rest } = props;

  return (
    <label className={cx(css({ display: "grid", pos: "relative" }), className)}>
      <select
        {...rest}
        className={css({
          appearance: "none",
          bg: { base: "neutral.300", _dark: "neutral.700" },
          pl: 4,
          pr: 12,
          py: 3,
          rounded: "md",
        })}
      >
        {props.options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>

      <IconSelector
        className={css({ alignSelf: "center", pointerEvents: "none", pos: "absolute", right: 2 })}
      />
    </label>
  );
}
