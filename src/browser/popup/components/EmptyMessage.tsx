import { ReactNode } from "react";

import { sva } from "~/browser/styled-system/css";

const recipe = sva({
  slots: ["root", "icon", "message"],

  base: {
    root: {
      display: "flex",
      flexDir: "column",
      gap: 2,
      p: 8,
    },

    icon: {
      fill: "current",
      mx: "auto",
      w: 12,
    },

    message: {
      fontWeight: "medium",
      textAlign: "center",
    },
  },
});

export interface EmptyMessageProps {
  children?: ReactNode;
}

export function EmptyMessage(props: EmptyMessageProps) {
  const styles = recipe({
    // ...
  });

  return (
    <div className={styles.root}>
      <svg className={styles.icon} viewBox="0 0 704 704">
        <path d="M142.455,166.554c44.375,-76.861 184.013,-79.443 311.632,-5.763c127.618,73.681 195.201,195.902 150.825,272.763c-90.007,155.898 -266.692,222.648 -394.311,148.967c-127.619,-73.681 -158.154,-260.069 -68.146,-415.967Zm207.856,254.142l-0.081,-0.022l1.984,82.174l70.475,-59.626c56.594,9.934 103.971,-1.131 122.819,-33.777c30.209,-52.323 -24.234,-140.396 -121.502,-196.553c-97.267,-56.157 -200.761,-59.27 -230.97,-6.947c-30.209,52.323 24.234,140.395 121.501,196.553c11.88,6.859 23.853,12.926 35.774,18.198Z" />
      </svg>

      <div className={styles.message}>{props.children}</div>
    </div>
  );
}
