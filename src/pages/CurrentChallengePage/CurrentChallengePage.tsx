import { Button, Stack, Text, Title } from "@mantine/core";
import { distance } from "@turf/turf";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  calculateCurrentHint,
  Coordinate,
  getUserLocation,
} from "../../helpers/amazingRaceHelper";
import {
  Challenge,
  getChallenge,
  getTeam,
  setNextChallengeForTeam,
  Team,
} from "../../helpers/backendHelper";
import {
  challengeDistanceLimit,
  hintTab,
  homeTab,
} from "../../helpers/constants";
import { getCookie } from "../../helpers/CookieHelper";
import { useSignalR } from "../../helpers/useSignalR";
import HintPage from "../HintPage/HintPage";
import "./CurrentChallengePage.css";

interface CurrentChallengePageProps {
  activeTab: string;
}
function CurrentChallengePage({ activeTab }: CurrentChallengePageProps) {
  const [showGif, setShowGif] = useState<boolean>(false);
  const [gifPath, setGifPath] = useState<string>("/Failed.gif");
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>();
  const [team, setTeam] = useState<Team>();
  const [currentHint, setCurrentHint] = useState<number>();
  const [userLocation, setUserLocation] = useState<Coordinate | undefined>();
  const navigate = useNavigate();
  const signalRUrl =
    "https://amazing-race-oslo-web-backend.azurewebsites.net/listen";
  // const signalRUrl = "https://localhost:7192/listen";

  // Get the team from the api on inititial component mount
  useEffect(() => {
    const teamId = getCookie("team");
    if (!teamId) navigate("/startpage");

    getTeam(teamId!).then((team) => {
      if (team) {
        console.log("Temalol", team);
        setTeam(team);
        setCurrentHint(calculateCurrentHint(team.currentChallengeStartTime!));
        getChallenge(team.currentChallengeId).then(
          (currentChallengeFireBase) => {
            console.log("lolo", currentChallengeFireBase);
            setCurrentChallenge(currentChallengeFireBase);
          }
        );
      }
    });
  }, []);

  useEffect(() => {
    getUserLocation().then((currentPosition) =>
      setUserLocation(currentPosition)
    );
  }, []);

  const handleReceiveMessage = useCallback((team: Team | undefined) => {
    console.log("Received SignalR message:", team);
    if (team) {
      setTeam(team);
      setCurrentHint(calculateCurrentHint(team.currentChallengeStartTime!));
      getChallenge(team.currentChallengeId).then((fireBaseCurrentChallenge) => {
        setCurrentChallenge(fireBaseCurrentChallenge);
      });
    }
  }, []);

  useSignalR({
    url: signalRUrl,
    teamId: getCookie("team")!,
    onReceiveMessage: handleReceiveMessage,
  });

  const checkDistance = async () => {
    if (team) {
      getUserLocation().then((pos) => setUserLocation(pos));
      if (userLocation && currentChallenge) {
        const distanceToChallengePoint = distance(
          [userLocation?.longitude, userLocation?.latitude],
          [currentChallenge.longitude, currentChallenge.latitude],
          { units: "meters" }
        );

        if (distanceToChallengePoint <= challengeDistanceLimit) {
          setGifPath("/Success.gif");
          setShowGif(true);
          const nextChallengeResponse = await setNextChallengeForTeam({
            team: team,
            currentChallengeNumber: currentChallenge.challengeNumber,
          });
          setTeam(nextChallengeResponse!.team);
          setCurrentChallenge(nextChallengeResponse!.challenge);
          await new Promise((p) => setTimeout(p, 3000));
          setShowGif(false);
        } else {
          setGifPath("/Failed.gif");
          setShowGif(true);
          await new Promise((p) => setTimeout(p, 3000));
          setShowGif(false);
        }
      }
    }
  };

  return (
    <>
      {showGif ? (
        <div className="gif-overlay">
          <img src={gifPath} alt="Loading..." />
        </div>
      ) : (
        <>
          {activeTab === homeTab && currentChallenge && team && (
            <Stack align="center" justify="center" px={"sm"}>
              <Title order={1} ta={"center"}>
                {currentChallenge.title}
              </Title>
              <Text size="lg" ta={"center"}>
                {currentChallenge.description}
              </Text>
              <Button onClick={() => checkDistance()}>
                Sjekk posisjonen min
              </Button>
            </Stack>
          )}
          {activeTab === hintTab && currentChallenge && team && currentHint && (
            <HintPage
              currentChallenge={currentChallenge}
              currentHint={currentHint}
              team={team}
              setTeam={setTeam}
              setCurrentHint={setCurrentHint}
            />
          )}
        </>
      )}
    </>
  );
}

export default CurrentChallengePage;
