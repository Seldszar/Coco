import { Icon } from "@tabler/icons-react";
import { HTMLProps, ReactNode } from "react";

import { styled } from "~/browser/styled-system/jsx";

const MenuItem = styled("button", {
  base: {
    alignItems: "center",
    display: "flex",
    gap: 3,
    px: 4,
    py: 2.5,
    rounded: "md",
    w: "full",

    _hover: {
      bg: { base: "neutral.300", _dark: "neutral.700" },
    },
  },
});

export interface MenuItemProps {
  disabled?: boolean;

  icon: Icon;
  title: ReactNode;

  onClick?(): void;
}

export interface MenuProps extends HTMLProps<HTMLDivElement> {
  items: MenuItemProps[];
}

export function Menu(props: MenuProps) {
  const { items, ...rest } = props;

  return (
    <div {...rest}>
      {items.map((item, index) => {
        if (item.disabled) {
          return null;
        }

        return (
          <MenuItem key={index} onClick={item.onClick}>
            <item.icon size={18} />
            {item.title}
          </MenuItem>
        );
      })}
    </div>
  );
}
