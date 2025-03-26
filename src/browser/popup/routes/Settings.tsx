import { useSettings } from "~/browser/common/hooks";
import { Box } from "~/browser/styled-system/jsx";

import { FormField } from "../components/FormField";
import { Section } from "../components/Section";
import { Select } from "../components/Select";
import { Switch } from "../components/Switch";
import { WebhookManager } from "../components/WebhookManager";

export function Settings() {
  const [settings, , updateSettings] = useSettings();

  return (
    <Box divideColor={{ base: "neutral.300", _dark: "neutral.700" }} divideY={1}>
      <Section header="Appearance">
        <FormField label="Theme">
          <Select
            value={settings.theme}
            onChange={(event) => updateSettings((value) => ({ ...value, theme: event.currentTarget.value }))}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </FormField>
      </Section>

      <Section header="Notifications">
        <Switch
          checked={settings.notifications}
          onChange={(event) => updateSettings((value) => ({ ...value, notifications: event.currentTarget.checked }))}
        >
          Enable Notifications
        </Switch>
      </Section>

      <Section header="Webhooks">
        <WebhookManager />
      </Section>
    </Box>
  );
}
