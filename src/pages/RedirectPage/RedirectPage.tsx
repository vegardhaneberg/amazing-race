import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../helpers/CookieHelper";
import { getTeam, updateTeam } from "../../helpers/backendHelper";

export function RedirectPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const challengeId = queryParams.get("id");
    const teamId = getCookie("team");

    if (!teamId) {
      navigate("/");
    }
    if (!challengeId) {
      navigate("/currentChallenge");
    }
    getTeam(teamId!).then((team) => {
      if (!team) {
        navigate("/");
      }
      team!.currentChallengeId = challengeId!;
      updateTeam(team!).then(() => navigate("/currentChallenge"));
    });
  }, []);

  return (
    <div>
      <h1>Redirect</h1>
    </div>
  );
}
