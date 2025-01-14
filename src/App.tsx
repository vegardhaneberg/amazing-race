import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import "@mantine/core/styles.css";
import AdminPage from "./pages/AdminPage/AdminPage";
import CurrentChallengePage from "./pages/CurrentChallengePage/CurrentChallengePage";
import { RedirectPage } from "./pages/RedirectPage/RedirectPage";
import { StartPage } from "./pages/StartPage/StartPage";
import { AppShell, Flex, Tabs } from "@mantine/core";

function App() {
  return (
    <AppShell>
      <AppShell.Header>
        <Flex justify={"center"}>
          <Tabs>
            <Tabs.List>
              <Tabs.Tab value="LOL">Lol</Tabs.Tab>
              <Tabs.Tab value="LOL1">Lol1</Tabs.Tab>
              <Tabs.Tab value="LOL2">Lol2</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Flex>
      </AppShell.Header>
      <AppShell.Main>
        <Router>
          <Routes>
            <Route path="*" element={<StartPage />} />
            <Route path="/redirect" element={<RedirectPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route
              path="/currentchallenge"
              element={<CurrentChallengePage />}
            />
          </Routes>
        </Router>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
