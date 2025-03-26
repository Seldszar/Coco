import { ReactNode } from "react";

import { Box } from "~/browser/styled-system/jsx";

export interface AlertProps {
  children?: ReactNode;
}

export function Alert(props: AlertProps) {
  return (
    <Box bg={{ base: "neutral.200", _dark: "neutral.800" }} p="4" rounded="md">
      {props.children}
    </Box>
  );
}
