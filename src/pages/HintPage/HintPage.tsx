import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { buyHint, Challenge, Team } from "../../helpers/firebaseHelper";
import {
  calculateCurrentHint,
  calculateTimeLeft,
} from "../../helpers/amazingRaceHelper";
import { Button } from "@mantine/core";
import { hintPrize, hintTime } from "../../helpers/constants";

interface HintPageProps {
  team: Team;
  currentChallenge: Challenge;
  setTeam: Dispatch<SetStateAction<Team | undefined>>;
}
function HintPage({ team, currentChallenge, setTeam }: HintPageProps) {
  const [currentHint, setCurrentHint] = useState<number>(
    calculateCurrentHint(team.currentChallengeStartTime!)
  );
  const [timeLeft, setTimeLeft] = useState<number>(
    calculateTimeLeft(team.currentChallengeStartTime!, currentHint)
  );
  const [notAffordMessage, setNotAffordMessage] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (currentHint >= 4) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          const nextHint = currentHint + 1;

          if (nextHint < 4) {
            setCurrentHint(nextHint);
            return 60 * hintTime;
          } else {
            setCurrentHint(4);
            return 0;
          }
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [currentHint]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  async function handleBuyHint() {
    if (team.balance >= hintPrize) {
      const newTeam = await buyHint(team);
      setTeam(newTeam);
      setCurrentHint(currentHint + 1);
      setNotAffordMessage(undefined);
    } else setNotAffordMessage("Dere har ikke råd 🥶");
  }

  return (
    <>
      {currentChallenge && (
        <>
          <h1>HintPage</h1>
          <div>
            {currentHint >= 3 ? (
              <h2>Nå får du ikke flere hint! Dere må klare det selv 🥶</h2>
            ) : (
              <h2>{formatTime(timeLeft)}</h2>
            )}
            {currentHint >= 1 && <div>{currentChallenge.firstHint}</div>}
            {currentHint >= 2 && <div>{currentChallenge.secondHint}</div>}
            {currentHint >= 3 && (
              <div>
                Nå kan du klikke på "check my position" og få vite hvor langt
                unna målet du er!
              </div>
            )}
          </div>
        </>
      )}
      {team && <Button onClick={() => handleBuyHint()}>Kjøp hint! </Button>}
      {notAffordMessage && <p style={{ color: "red" }}>{notAffordMessage}</p>}
    </>
  );
}

export default HintPage;
