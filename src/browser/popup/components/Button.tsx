import { HTMLStyledProps, styled } from "~/browser/styled-system/jsx";
import { StyledVariantProps } from "~/browser/styled-system/types";

export const Button = styled("button", {
  base: {
    cursor: "pointer",
    fontWeight: "medium",
    px: 5,
    py: 2.5,
    rounded: "md",

    _disabled: {
      cursor: "not-allowed",
      opacity: 0.5,
    },
  },
  variants: {
    color: {
      neutral: {
        bg: {
          base: "neutral.300",
          _dark: "neutral.700",
          _hover: { base: "neutral.400", _dark: "neutral.600" },
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
      transparent: {
        bg: { _hover: { base: "neutral.300", _dark: "neutral.700" } },
      },
    },
  },
  defaultVariants: {
    color: "neutral",
  },
});

export type ButtonProps = HTMLStyledProps<typeof Button> & StyledVariantProps<typeof Button>;
