import { styled } from "~/browser/styled-system/jsx";

export const Button = styled("button", {
  base: {
    cursor: "pointer",
    fontWeight: "medium",
    p: 2.5,
    rounded: "md",
  },
  variants: {
    color: {
      neutral: {
        base: {
          bg: { base: "black", _dark: "white" },
          color: { base: "white", _dark: "black" },
        },
        _hover: {
          bg: { base: "neutral.700", _dark: "neutral.300" },
        },
      },
      purple: {
        bg: { base: "purple.500", _hover: "purple.400" },
        color: "white",
      },
      red: {
        bg: { base: "red.500", _hover: "red.400" },
        color: "white",
      },
    },
  },
  defaultVariants: {
    color: "neutral",
  },
});
