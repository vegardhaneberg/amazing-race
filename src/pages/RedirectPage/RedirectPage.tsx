import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../helpers/CookieHelper";
import { setCurrentChallengeForTeam } from "../../helpers/firebaseHelper";

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
    setCurrentChallengeForTeam(teamId!, challengeId!).then(() => {
      navigate("/currentChallenge");
    });
  }, []);

  return (
    <div>
      <h1>Redirect</h1>
    </div>
  );
}
