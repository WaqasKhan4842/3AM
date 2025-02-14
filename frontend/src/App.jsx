import Home from "./pages/home"
import Login from "./pages/login"
import Register from "./pages/register"
import { ContestantDashboard } from "./pages/contestantDashboard.jsx";
import { CompetitionSignUp } from "./pages/competitionSignUp.jsx";
import {ProfileCreation} from "./pages/profileCreation.jsx";
import {OrganizerDashboard} from "./pages/organizerDashboard.jsx";
import { JudgePanel } from './pages/judgePanel.jsx';
import { AudienceVoting } from "./pages/audienceVoting";
import { ResultsPage } from "./pages/resultPage";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ContestantDashboard />} />
        <Route path="/competition-signup" element={<CompetitionSignUp />} />
        <Route path="/profile-creation" element={<ProfileCreation />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
        <Route path={"/judge-panel"} element={<JudgePanel />} />
        <Route path="/audience-voting" element={<AudienceVoting />} />
        <Route path="/results" element={<ResultsPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
