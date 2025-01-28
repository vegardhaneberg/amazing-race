import { Button, Stack, Text, Title } from "@mantine/core";
import { distance } from "@turf/turf";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coordinate, getUserLocation } from "../../helpers/amazingRaceHelper";
import {
  challengeDistanceLimit,
  hintTab,
  homeTab,
} from "../../helpers/constants";
import { getCookie } from "../../helpers/CookieHelper";
import {
  Challenge,
  getCurrentChallege,
  getNextChallenge,
  getTeam,
  setCurrentChallengeForTeam,
  Team,
} from "../../helpers/firebaseHelper";
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
  const [userLocation, setUserLocation] = useState<Coordinate | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    const teamId = getCookie("team");

    if (teamId) {
      getCurrentChallege(teamId).then((challenge) => {
        setCurrentChallenge(challenge);
      });
      getTeam(teamId).then((firebaseTeam) => {
        setTeam(firebaseTeam);
      });
    } else navigate("/startpage");
  }, []);

  // const getUserLocation = () => {
  //   // if geolocation is supported by the users browser
  //   if (navigator.geolocation) {
  //     // get the current users location
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         // save the geolocation coordinates in two variables
  //         const { latitude, longitude } = position.coords;
  //         // update the value of userlocation variable
  //         setUserLocation({ latitude, longitude });
  //       },
  //       // if there was an error getting the users location
  //       (error) => {
  //         console.error("Error getting user location:", error);
  //       }
  //     );
  //   }
  //   // if geolocation is not supported by the users browser
  //   else {
  //     console.error("Geolocation is not supported by this browser.");
  //   }
  // };

  useEffect(() => {
    getUserLocation().then((currentPosition) =>
      setUserLocation(currentPosition)
    );
  }, []);

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
          const nextChallenge = await getNextChallenge(currentChallenge.id);
          setCurrentChallengeForTeam(team.id, nextChallenge.id);
          setCurrentChallenge(nextChallenge);
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
          {activeTab === hintTab && currentChallenge && team && (
            <HintPage
              currentChallenge={currentChallenge}
              team={team}
              setTeam={setTeam}
            />
          )}
        </>
      )}
    </>
  );
}

export default CurrentChallengePage;
