import { useFieldContext } from "../Form";
import { Switch, SwitchProps } from "../Switch";

export interface SwitchFieldProps extends Omit<SwitchProps, "checked" | "onChecked"> {}

export function SwitchField(props: SwitchFieldProps) {
  const field = useFieldContext<boolean>();

  return (
    <Switch
      {...props}
      checked={field.state.value}
      onChecked={(checked) => field.handleChange(checked)}
    />
  );
}
