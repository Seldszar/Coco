import { ReactNode } from "react";

import { Box } from "~/browser/styled-system/jsx";

import { Alert } from "./Alert";
import { BountyCard, BountyCardProps } from "./BountyCard";

interface BountyListProps<T> {
  items: T[];

  header: ReactNode;
  emptyMessage: ReactNode;

  itemProps(item: T): BountyCardProps;
}

export function BountyList<T>(props: BountyListProps<T>) {
  const { items } = props;

  return (
    <Box py="3">
      <Box fontSize="xl" fontWeight="bold" px="4">
        {props.header}
      </Box>

      {items.length === 0 && (
        <Box px="4" py="3">
          <Alert>{props.emptyMessage}</Alert>
        </Box>
      )}

      {items.map((item, index) => (
        <BountyCard key={index} {...props.itemProps(item)} />
      ))}
    </Box>
  );
}
