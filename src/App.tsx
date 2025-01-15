import { alpha, AppShell, Flex, Stack, Tabs, Text } from "@mantine/core";
import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { challengeTab, hintTab, homeTab } from "./helpers/constants";
import AdminPage from "./pages/AdminPage/AdminPage";

import CurrentChallengePage from "./pages/CurrentChallengePage/CurrentChallengePage";
import { RedirectPage } from "./pages/RedirectPage/RedirectPage";
import { StartPage } from "./pages/StartPage/StartPage";

function App() {
  const [activeTab, setActiveTab] = useState<string>(homeTab);

  return (
    <AppShell mah={"100vh"} header={{ height: 50 }} h={"100%"}>
      <AppShell.Header style={{ border: "0px solid black" }}>
        <Flex justify={"center"} w={"100%"}>
          <Tabs classNames={{ tab: "tab" }} value={activeTab} w={"100%"}>
            <Tabs.List grow>
              <Tabs.Tab
                value={homeTab}
                onClick={() => setActiveTab(homeTab)}
                w={"33%"}
              >
                <Text>Hjem</Text>
              </Tabs.Tab>
              <Tabs.Tab
                value={hintTab}
                onClick={() => setActiveTab(hintTab)}
                w={"33%"}
              >
                <Text>Hint</Text>
              </Tabs.Tab>
              <Tabs.Tab
                value={challengeTab}
                onClick={() => setActiveTab(challengeTab)}
                w={"33%"}
              >
                <Text>Challenges</Text>
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Flex>
      </AppShell.Header>
      <AppShell.Main>
        <Router>
          <Stack
            maw={"390px"}
            p={"sm"}
            h={"100%"}
            align="center"
            justify="center"
            style={{ overflow: "hidden" }}
          >
            <Routes>
              <Route
                path="*"
                element={<CurrentChallengePage activeTab={activeTab} />}
              />
              <Route path="/redirect" element={<RedirectPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/startpage" element={<StartPage />} />
            </Routes>
          </Stack>
        </Router>
      </AppShell.Main>
      <AppShell.Footer bg={alpha("#4578FC", 0)} bd={"0px solid black"}>
        <Flex w={"100%"} justify={"center"}>
          <Text size="12px">® Made by Boysconsulting™</Text>
        </Flex>
      </AppShell.Footer>
    </AppShell>
  );
}

export default App;
