import { ReactNode } from "react";

import { useFieldContext } from "../Form";
import { FormField } from "../FormField";
import { Select, SelectProps } from "../Select";

export interface SelectFieldProps<T extends string | number> extends SelectProps<T> {
  header?: ReactNode;
}

export function SelectField<T extends string | number>(props: SelectFieldProps<T>) {
  const field = useFieldContext<T>();

  return (
    <FormField {...props}>
      <Select
        {...props}
        value={field.state.value}
        onChange={(event) => field.handleChange(event.currentTarget.value as T)}
      />
    </FormField>
  );
}
