import { styled } from "~/browser/styled-system/jsx";

export const Paragraph = styled("div", {
  base: {
    "& p": {
      mb: { base: 3, _last: 0 },
    },
  },
});
