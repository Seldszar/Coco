import { EntryWrapper } from "@seldszar/yael";

import { ComponentType } from "react";
import { createRoot } from "react-dom/client";

import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

const wrapper: EntryWrapper<ComponentType> = (Component) => {
  const root = createRoot(document.body);

  root.render(
    <Router hook={useHashLocation}>
      <Component />
    </Router>,
  );
};

export default wrapper;
