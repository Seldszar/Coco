import { Button, ButtonProps } from "../Button";
import { useFormContext } from "../Form";

export interface SubscribeButtonProps extends ButtonProps {}

export function SubscribeButton(props: SubscribeButtonProps) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting || state.isPristine}>
      {(disabled) => <Button {...props} disabled={disabled} />}
    </form.Subscribe>
  );
}
