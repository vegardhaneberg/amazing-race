import { useEffect, useState } from "react";
import { Challenge, Team } from "../../helpers/firebaseHelper";
import { calculateTimeLeft } from "../../helpers/amazingRaceHelper";

interface HintPageProps {
  team: Team;
  currentChallenge: Challenge;
}
function HintPage({ team, currentChallenge }: HintPageProps) {
  const [timeLeft, setTimeLeft] = useState<number>(
    calculateTimeLeft(team.currentChallengeStartTime!)
  );
  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      {currentChallenge && (
        <>
          <h1>HintPage</h1>
          <div>
            {finished ? (
              <h2>Countdown Finished!</h2>
            ) : (
              <h2>Time Left: {formatTime(timeLeft)}</h2>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default HintPage;
