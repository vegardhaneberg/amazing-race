import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import AdminPage from "./pages/AdminPage/AdminPage";
import CurrentChallengePage from "./pages/CurrentChallengePage/CurrentChallengePage";
import { RedirectPage } from "./pages/RedirectPage/RedirectPage";
import { StartPage } from "./pages/StartPage/StartPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<StartPage />} />
        <Route path="/redirect" element={<RedirectPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/currentchallenge" element={<CurrentChallengePage />} />
      </Routes>
    </Router>
  );
}

export default App;
