import { IconChevronDown, IconChevronUp, IconExternalLink, IconHeart, IconSettings } from "@tabler/icons-react";
import { useLocation } from "wouter";

import { BountyStatus } from "~/common/constants";
import { arrayCount } from "~/common/helpers";

import { useSponsorships, useToggle } from "~/browser/common/hooks";

import { sva } from "~/browser/styled-system/css";
import { Grid, styled } from "~/browser/styled-system/jsx";

import { Button } from "./Button";
import { Menu } from "./Menu";
import { TabList } from "./TabList";

const recipe = sva({
  slots: ["root", "top", "tabs", "toggle", "menu", "footer"],

  base: {
    root: {
      borderBottomWidth: 1,
      borderColor: { base: "neutral.300", _dark: "black" },
    },

    top: {
      alignItems: "center",
      display: "flex",
      pr: 3,
    },

    tabs: {
      flex: 1,
      gap: 8,
      px: 8,
    },

    toggle: {
      p: 1,
      rounded: "md",

      _hover: {
        bg: { base: "neutral.300", _dark: "neutral.700" },
      },
    },

    menu: {
      px: 4,
      py: 3,
    },

    footer: {
      color: { base: "neutral.600", _dark: "neutral.400" },
      display: "flex",
      fontSize: "sm",
      gap: 2,
      justifyContent: "end",
      pb: 3,
      px: 4,

      "& a": {
        _hover: {
          color: { base: "black", _dark: "white" },
        },
      },
    },
  },
});

export interface HeaderProps {
  isPopout?: boolean;
}

export function Header(props: HeaderProps) {
  const [sponsorships] = useSponsorships();

  const [isMenuOpen, toggleMenu] = useToggle(false);
  const [, navigate] = useLocation();

  const classes = recipe({
    isMenuOpen,
  });

  const getBadgeCount = (status: BountyStatus) =>
    arrayCount(sponsorships, (sponsorship) => sponsorship.status === status);

  const openSponsorshipBoard = () =>
    browser.runtime.sendMessage({
      type: "openSponsorshipBoard",
    });

  return (
    <header className={classes.root}>
      <div className={classes.top}>
        <TabList
          className={classes.tabs}
          items={[
            {
              badgeText: getBadgeCount(BountyStatus.Available),
              href: "/bounties/available",
              title: "Available",
            },
            {
              badgeText: getBadgeCount(BountyStatus.Live),
              href: "/bounties/live",
              title: "In Queue",
            },
            {
              href: "/bounties/completed",
              title: "Completed",
            },
          ]}
        />

        <button className={classes.toggle} onClick={() => toggleMenu()}>
          {isMenuOpen ? <IconChevronUp /> : <IconChevronDown />}
        </button>
      </div>

      {isMenuOpen && (
        <>
          <Grid pt={3} px={4}>
            <Button color="purple" onClick={() => openSponsorshipBoard()}>
              Open Sponsorship Board
            </Button>
          </Grid>

          <Menu
            className={classes.menu}
            items={[
              {
                title: "Popout",
                icon: IconExternalLink,
                disabled: props.isPopout,
                onClick() {
                  open("?popout=true", "popout", "width=424,height=600");
                },
              },
              {
                title: "Settings",
                icon: IconSettings,
                onClick() {
                  navigate("/settings");
                },
              },
              {
                title: "Donate",
                icon: IconHeart,
                onClick() {
                  navigate("/donate");
                },
              },
            ]}
          />

          <ul className={classes.footer}>
            <li>
              by{" "}
              <a href="https://seldszar.fr" target="_blank">
                Seldszar
              </a>
            </li>

            <styled.li flex={1} />

            <li>
              <a href="https://github.com/seldszar/coco/releases" target="_blank">
                Release Notes
              </a>
            </li>
            <li>&middot;</li>
            <li>
              <a href="https://github.com/seldszar/coco" target="_blank">
                Source Code
              </a>
            </li>
          </ul>
        </>
      )}
    </header>
  );
}
