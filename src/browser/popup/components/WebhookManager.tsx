import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { z } from "zod";

import { WebhookType } from "~/common/constants";
import { Webhook } from "~/common/types";

import { useSettings } from "~/browser/common/hooks";

import { css } from "~/browser/styled-system/css";
import { Box, Flex, Grid } from "~/browser/styled-system/jsx";

import { Button } from "./Button";
import { useAppForm } from "./Form";

export interface FormProps {
  onSubmit(webhook: Webhook): void;
  onCancel(): void;
}

export function Form(props: FormProps) {
  const form = useAppForm({
    defaultValues: {
      id: crypto.randomUUID(),
      type: "",
      url: "",
    },

    onSubmit({ value }) {
      props.onSubmit(value as Webhook);
    },
  });

  const executeTestWebhook = () =>
    browser.runtime.sendMessage({ type: "executeTestWebhook", data: form.state.values });

  return (
    <form.AppForm>
      <form
        className={css({ spaceY: 6 })}
        onSubmit={(event) => (event.preventDefault(), form.handleSubmit())}
      >
        <form.AppField name="type" validators={{ onChange: z.nativeEnum(WebhookType) }}>
          {(field) => (
            <field.SelectField
              className={css({ flex: "none" })}
              header="Type"
              options={[
                {
                  value: WebhookType.Discord,
                  label: "Discord",
                },
                {
                  value: WebhookType.Slack,
                  label: "Slack",
                },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField name="url" validators={{ onChange: z.string().url() }}>
          {(field) => <field.TextField className={css({ flex: 1 })} header="URL" />}
        </form.AppField>

        <Flex gap={3} mt={6}>
          <form.SubscribeButton type="button" mr="auto" onClick={executeTestWebhook}>
            Test
          </form.SubscribeButton>

          <Button type="button" color="transparent" onClick={props.onCancel}>
            Cancel
          </Button>

          <form.SubscribeButton color="purple">Save</form.SubscribeButton>
        </Flex>
      </form>
    </form.AppForm>
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
          onSubmit={(webhook) => (props.onSubmit(webhook), setOpen(false))}
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
