import { useSettings } from "~/browser/common/hooks";
import { Box } from "~/browser/styled-system/jsx";

import { FormField } from "../components/FormField";
import { RadioGroup } from "../components/RadioGroup";
import { Section } from "../components/Section";
import { Switch } from "../components/Switch";
import { WebhookManager } from "../components/WebhookManager";

export function Settings() {
  const [settings, , updateSettings] = useSettings();

  return (
    <Box divideColor={{ base: "neutral.300", _dark: "neutral.700" }} divideY={1}>
      <Section header="Appearance">
        <FormField header="Theme">
          <RadioGroup
            value={settings.theme}
            onChange={(theme) => updateSettings((value) => ({ ...value, theme }))}
            options={[
              {
                value: "light",
                children: "Light",
              },
              {
                value: "dark",
                children: "Dark",
              },
            ]}
          />
        </FormField>
      </Section>

      <Section header="Notifications">
        <Switch
          checked={settings.notifications}
          onChecked={(notifications) => updateSettings((value) => ({ ...value, notifications }))}
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
