import { IconTrash } from "@tabler/icons-react";
import { FormEvent, useRef, useState } from "react";

import { WebhookType } from "~/common/constants";
import { Webhook } from "~/common/types";

import { useSettings } from "~/browser/common/hooks";

import { css } from "~/browser/styled-system/css";
import { Box, Flex, Grid } from "~/browser/styled-system/jsx";

import { Button } from "./Button";
import { FormField } from "./FormField";
import { Input } from "./Input";
import { Select } from "./Select";

interface FormValues {
  type: WebhookType;
  url: string;
}

export interface FormProps {
  onSubmit(value: FormValues): void;
  onCancel(): void;
}

export function Form(props: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormValues = (callback: (data: FormValues) => void) => {
    const form = formRef.current;

    if (form?.reportValidity()) {
      const formData = new FormData(form);

      callback({
        type: formData.get("type") as WebhookType,
        url: formData.get("url") as string,
      });
    }
  };
  const onTest = () =>
    handleFormValues((data) => {
      browser.runtime.sendMessage({ data, type: "executeTestWebhook" });
    });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    handleFormValues((data) => {
      props.onSubmit(data);
    });
  };

  return (
    <form ref={formRef} className={css({ spaceY: 6 })} onSubmit={onSubmit}>
      <FormField label="Type">
        <Select
          required
          name="type"
          options={[
            { value: WebhookType.Discord, label: "Discord" },
            { value: WebhookType.Slack, label: "Slack" },
          ]}
        />
      </FormField>

      <FormField label="URL">
        <Input type="url" required name="url" />
      </FormField>

      <Flex gap={3} mt={6}>
        <Button type="button" mr="auto" onClick={onTest}>
          Test
        </Button>

        <Button type="button" color="transparent" onClick={props.onCancel}>
          Cancel
        </Button>

        <Button type="submit" color="purple">
          Add
        </Button>
      </Flex>
    </form>
  );
}

interface NewButtonProps {
  onSubmit(webhook: Webhook): void;
}

function NewButton(props: NewButtonProps) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <Box bg={{ base: "neutral.200", _dark: "neutral.800" }} p={6} rounded="md">
        <Form
          onCancel={() => setOpen(false)}
          onSubmit={(value) => (
            props.onSubmit({ ...value, id: crypto.randomUUID() }), setOpen(false)
          )}
        />
      </Box>
    );
  }

  return (
    <Button color="purple" onClick={() => setOpen(true)}>
      New Webhook
    </Button>
  );
}

export function WebhookManager() {
  const [settings, loading, setSettings] = useSettings();

  if (loading) {
    return null;
  }

  return (
    <Box spaceY="4">
      {settings.webhooks.length > 0 && (
        <Box spaceY="2">
          {settings.webhooks.map((webhook, index) => (
            <Flex
              key={index}
              bg={{ base: "neutral.200", _dark: "neutral.800" }}
              overflow="hidden"
              rounded="md"
            >
              <Box flex="1" p="4" pr="0">
                <Box
                  color={{ base: "neutral.600", _dark: "neutral.400" }}
                  fontSize="sm"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  {webhook.type}
                </Box>

                <Grid>
                  <Box truncate>{webhook.url}</Box>
                </Grid>
              </Box>

              <button
                className={css({
                  cursor: "pointer",
                  display: "grid",
                  flex: "none",
                  px: "4",
                  placeContent: "center",
                  _hover: { bg: { base: "neutral.300", _dark: "neutral.700" } },
                })}
                onClick={() =>
                  setSettings((value) => ({
                    ...value,
                    webhooks: value.webhooks.filter((value) => value.id !== webhook.id),
                  }))
                }
              >
                <IconTrash />
              </button>
            </Flex>
          ))}
        </Box>
      )}

      <NewButton
        onSubmit={(webhook) =>
          setSettings((value) => ({ ...value, webhooks: value.webhooks.concat(webhook) }))
        }
      />
    </Box>
  );
}
