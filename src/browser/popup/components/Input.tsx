import { styled } from "~/browser/styled-system/jsx";

export const Input = styled("input", {
  base: {
    bg: { base: "neutral.300", _dark: "neutral.700" },
    px: 4,
    py: 3,
    rounded: "md",
    w: "full",
  },
});
