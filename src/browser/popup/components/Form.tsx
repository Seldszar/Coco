import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { SelectField } from "./fields/SelectField";
import { SubscribeButton } from "./fields/SubscribeButton";
import { SwitchField } from "./fields/SwitchField";
import { TextField } from "./fields/TextField";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,

  fieldComponents: {
    SelectField,
    SwitchField,
    TextField,
  },

  formComponents: {
    SubscribeButton,
  },
});
