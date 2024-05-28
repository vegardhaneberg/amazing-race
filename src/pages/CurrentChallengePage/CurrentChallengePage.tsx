import { useLocation } from "react-router-dom";
import "./CurrentChallengePage.css";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "../../helpers/CookieHelper";

function CurrentChallengePage() {
  const location = useLocation();
  const [currentChallengeId, setCurrentChallengeId] = useState<number>();

  const challenges = [
    "first challenge",
    "second challenge",
    "third challenge",
    "fourth challenge",
    "nub",
    "yo",
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get("id");
    if (taskId !== null) {
      const oldChallengeId = getCookie("currentChallenge");
      if (oldChallengeId !== undefined) {
        if (parseInt(oldChallengeId) < parseInt(taskId)) {
          setCookie("currentChallenge", taskId);
        }
      }
    }

    const currentChallengeIdFirebase = getCookie("currentChallenge");
    if (currentChallengeIdFirebase !== undefined) {
      setCurrentChallengeId(parseInt(currentChallengeIdFirebase));
    } else {
      setCookie("currentChallenge", "1");
      setCurrentChallengeId(1);
    }
  }, []);

  return (
    <>{currentChallengeId && <h1>{challenges[currentChallengeId - 1]}</h1>}</>
  );
}

export default CurrentChallengePage;
