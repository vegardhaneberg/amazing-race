import { Button, Flex, Stack, Text, Title } from "@mantine/core";
import { distance } from "@turf/turf";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  calculateCurrentHint,
  calculateTimeLeft,
  getUserLocation,
} from "../../helpers/amazingRaceHelper";
import { buyHint, Challenge, Team } from "../../helpers/backendHelper";
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
  const [currentDistance, setCurrentDistance] = useState<number>(0);
  const [showDistance, setShowDistance] = useState<boolean>(false);

  useEffect(() => {
    if (currentHint >= 4) {
      getUserLocation().then((pos) => {
        const distanceToChallengePoint = distance(
          [pos.longitude, pos.latitude],
          [currentChallenge.longitude, currentChallenge.latitude],
          { units: "meters" }
        );
        setCurrentDistance(distanceToChallengePoint);
        setShowDistance(true);
      });
    }

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

  function checkPosition() {
    getUserLocation().then((pos) => {
      const distanceToChallengePoint = distance(
        [pos.longitude, pos.latitude],
        [currentChallenge.longitude, currentChallenge.latitude],
        { units: "meters" }
      );
      setCurrentDistance(distanceToChallengePoint);
      setShowDistance(true);
    });
  }

  return (
    <>
      {currentChallenge && (
        <Stack gap={"lg"}>
          <Title order={1} ta={"center"}>
            HintPage
          </Title>

          {currentHint >= 3 ? (
            <Title order={2} ta={"center"}>
              Nå får du ikke flere hint! Dere må klare det selv 🥶
            </Title>
          ) : (
            <Title order={2} ta={"center"}>
              {formatTime(timeLeft)}
            </Title>
          )}
          {currentHint >= 1 && (
            <Text size="lg" ta={"center"}>
              {currentChallenge.firstHint}
            </Text>
          )}
          {currentHint >= 2 && (
            <Text size="lg" ta={"center"}>
              {currentChallenge.secondHint}
            </Text>
          )}
          {currentHint >= 3 && (
            <>
              <Text size="lg" ta={"center"}>
                Klikk på knappen under for å få vite hvor langt unna dere er (må
                klikke igjen for å refreshe)
              </Text>
              <Flex justify={"center"}>
                <Button onClick={() => checkPosition()}>Sjekk!</Button>
              </Flex>

              {showDistance && (
                <Text size="md" ta={"center"}>
                  {currentDistance.toFixed(0)} meter
                </Text>
              )}
            </>
          )}
        </Stack>
      )}
      {team && currentHint < 4 && (
        <Button onClick={() => handleBuyHint()}>Kjøp hint!</Button>
      )}
      {notAffordMessage && <p style={{ color: "red" }}>{notAffordMessage}</p>}
    </>
  );
}

export default HintPage;
