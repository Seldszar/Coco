import "./assets/styles/main.css";

import { Suspense, useLayoutEffect } from "react";
import { Route, Switch } from "wouter";

import { useSearchParams, useSettings } from "~/browser/common/hooks";
import { Flex } from "~/browser/styled-system/jsx";

import { Header } from "./components/Header";

import { Bounties } from "./routes/Bounties";
import { Donate } from "./routes/Donate";
import { Settings } from "./routes/Settings";

function App() {
  const [searchParams] = useSearchParams();
  const [settings] = useSettings();

  const isPopout = searchParams.has("popout");

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
  }, [settings.theme]);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("popout", isPopout);
  }, [isPopout]);

  return (
    <Flex direction="column" w={{ base: 380, _popout: "auto" }}>
      <Header {...{ isPopout }} />

      <Suspense fallback={null}>
        <Switch>
          <Route path="/bounties/:status" component={Bounties} />
          <Route path="/settings" component={Settings} />
          <Route path="/donate" component={Donate} />
        </Switch>
      </Suspense>
    </Flex>
  );
}

export default App;
