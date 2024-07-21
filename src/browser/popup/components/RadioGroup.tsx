import { useId } from "react";

import { Grid } from "~/browser/styled-system/jsx";

import { Radio } from "./Radio";

export interface RadioGroupProps {
  options: any[];

  value: string;
  onChange(value: string): void;
}

export function RadioGroup(props: RadioGroupProps) {
  const id = useId();

  return (
    <Grid gap={2}>
      {props.options.map((option) => (
        <Radio
          key={option.value}
          children={option.children}
          checked={option.value === props.value}
          onChange={(event) => props.onChange(event.target.value)}
          value={option.value}
          name={id}
        />
      ))}
    </Grid>
  );
}
