import { styled } from "~/browser/styled-system/jsx";

import { Button } from "../components/Button";
import { ButtonGroup } from "../components/ButtonGroup";
import { Paragraph } from "../components/Paragraph";
import { Section } from "../components/Section";

export function Donate() {
  return (
    <Section header="Donate">
      <Paragraph mb={8}>
        <p>Coco is a free extension that does not collect or sell personal user data.</p>
        <p>
          Donations, although optional but greatly appreciated, help support my work and encourage
          me to offer the best quality products possible.
        </p>
        <p>Thank you for your support!</p>
      </Paragraph>

      <ButtonGroup>
        <styled.a href="https://go.seldszar.fr/paypal" target="_blank" display="grid">
          <Button>Donate with PayPal</Button>
        </styled.a>
        <styled.a href="https://go.seldszar.fr/coinbase" target="_blank" display="grid">
          <Button>Donate with Coinbase</Button>
        </styled.a>
      </ButtonGroup>
    </Section>
  );
}
