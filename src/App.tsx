import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage/AdminPage";
import CurrentChallengePage from "./pages/CurrentChallengePage/CurrentChallengePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome</h1>} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/currentchallenge" element={<CurrentChallengePage />} />
      </Routes>
    </Router>
  );
}

export default App;
