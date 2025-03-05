import { HTMLStyledProps, styled } from "~/browser/styled-system/jsx";
import { StyledVariantProps } from "~/browser/styled-system/types";

export const Button = styled("button", {
  base: {
    cursor: "pointer",
    fontWeight: "medium",
    px: 5,
    py: 2.5,
    rounded: "md",
  },
  variants: {
    color: {
      neutral: {
        bg: { base: "neutral.500", _hover: "neutral.400" },
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
        bg: { _hover: "neutral.500" },
      },
    },
  },
  defaultVariants: {
    color: "neutral",
  },
});

export type ButtonProps = HTMLStyledProps<typeof Button> & StyledVariantProps<typeof Button>;
