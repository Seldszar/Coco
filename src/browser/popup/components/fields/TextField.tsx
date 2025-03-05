import { useFieldContext } from "../Form";
import { FormField, FormFieldProps } from "../FormField";
import { Input } from "../Input";

export interface TextFieldProps extends FormFieldProps {}

export function TextField(props: TextFieldProps) {
  const field = useFieldContext<string>();

  return (
    <FormField {...props}>
      <Input
        value={field.state.value}
        onChange={(event) => field.handleChange(event.target.value)}
      />
    </FormField>
  );
}
