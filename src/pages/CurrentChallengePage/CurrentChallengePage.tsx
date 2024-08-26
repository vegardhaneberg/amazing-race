import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../helpers/CookieHelper";
import { Challenge, getCurrentChallege } from "../../helpers/firebaseHelper";
import "./CurrentChallengePage.css";

function CurrentChallengePage() {
  const navigate = useNavigate();
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>();

  useEffect(() => {
    // const queryParams = new URLSearchParams(location.search);
    // const taskId = queryParams.get("id");
    // if (taskId !== null) {
    //   const oldChallengeId = getCookie("currentChallenge");
    //   if (oldChallengeId !== undefined) {
    //     if (parseInt(oldChallengeId) < parseInt(taskId)) {
    //       setCookie("currentChallenge", taskId);
    //     }
    //   }
    // }

    // const currentChallengeIdFirebase = getCookie("currentChallenge");
    // if (currentChallengeIdFirebase !== undefined) {
    //   setCurrentChallengeId(parseInt(currentChallengeIdFirebase));
    // } else {
    //   setCookie("currentChallenge", "1");
    //   setCurrentChallengeId(1);
    // }
    const teamId = getCookie("team");
    if (!teamId) {
      navigate("/");
    }
    if (teamId) {
      getCurrentChallege(teamId).then((challenge) => {
        setCurrentChallenge(challenge);
      });
    }
  }, []);

  return (
    <>
      {currentChallenge && (
        <div>
          <h1>{currentChallenge.title}</h1>
          <h3>{currentChallenge.description}</h3>
        </div>
      )}
    </>
  );
}

export default CurrentChallengePage;
