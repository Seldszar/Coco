import { EntryWrapper } from "@seldszar/yael";

import { ComponentType, Suspense } from "react";
import { createRoot } from "react-dom/client";

import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";

const { hook } = memoryLocation({
  path: "/bounties/available",
});

const wrapper: EntryWrapper<ComponentType> = (Component) => {
  const root = createRoot(document.body);

  root.render(
    <Router hook={hook}>
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    </Router>,
  );
};

export default wrapper;
