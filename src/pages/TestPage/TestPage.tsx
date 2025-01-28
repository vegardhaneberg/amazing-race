import { Stack, Button, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import { Coordinate } from "../../helpers/amazingRaceHelper";
import { distance } from "@turf/turf";

function TestPage() {
  const challengeCoordinates: Coordinate[] = [
    { latitude: 59.92145113488405, longitude: 10.73803867420123 }, // Vegard
    { latitude: 59.92378369549516, longitude: 10.736378398421776 }, // Mads
    { latitude: 59.91291816904782, longitude: 10.736472096436001 }, // Mesh
    { latitude: 59.909918234290906, longitude: 10.741901366040695 }, // PayEx
    { latitude: 59.923254611577455, longitude: 10.680592200228512 }, // Multi
    { latitude: 59.91936179299668, longitude: 10.74387067821494 }, // Graveyard
    { latitude: 59.91892830020875, longitude: 10.74846215146542 }, // Martin
  ];
  const [userLocation, setUserLocation] = useState<Coordinate | undefined>();
  const [realDistance, setRealDistance] = useState<number>(10000);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          setUserLocation({ latitude, longitude });
        },
        // if there was an error getting the users location
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const checkDistance = (coord: Coordinate) => {
    getUserLocation();
    if (userLocation) {
      const distance1 = distance(
        [userLocation?.longitude, userLocation?.latitude],
        [coord.longitude, coord.latitude],
        { units: "meters" }
      );
      setRealDistance(distance1);
    }
  };

  return (
    <>
      <Stack align="center" justify="center" px={"sm"}>
        <h1>{realDistance.toFixed(2)}</h1>
        <Flex wrap={"wrap"} gap={"xs"}>
          <Button onClick={() => checkDistance(challengeCoordinates[0])}>
            Vegard
          </Button>
          <Button onClick={() => checkDistance(challengeCoordinates[1])}>
            Mads
          </Button>
          <Button onClick={() => checkDistance(challengeCoordinates[2])}>
            MESH
          </Button>
          <Button onClick={() => checkDistance(challengeCoordinates[3])}>
            PayEx
          </Button>
          <Button onClick={() => checkDistance(challengeCoordinates[4])}>
            Multi
          </Button>
          <Button onClick={() => checkDistance(challengeCoordinates[5])}>
            Graveyard
          </Button>
          <Button onClick={() => checkDistance(challengeCoordinates[6])}>
            Martin
          </Button>
        </Flex>
      </Stack>
    </>
  );
}

export default TestPage;
