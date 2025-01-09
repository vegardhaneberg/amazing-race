import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../helpers/CookieHelper";
import { Challenge, getCurrentChallege } from "../../helpers/firebaseHelper";
import "./CurrentChallengePage.css";
import { distance } from "@turf/turf";

export type Coordinate = { latitude: number; longitude: number };

export const testList: Coordinate[] = [
  { latitude: 59.92145113488405, longitude: 10.73803867420123 },
  { latitude: 59.92378369549516, longitude: 10.736378398421776 },
  { latitude: 59.91291816904782, longitude: 10.736472096436001 },
  { latitude: 59.909918234290906, longitude: 10.741901366040695 },
  { latitude: 59.923254611577455, longitude: 10.680592200228512 },
  { latitude: 59.91936179299668, longitude: 10.74387067821494 },
  { latitude: 59.91892830020875, longitude: 10.74846215146542 },
];

function CurrentChallengePage() {
  const navigate = useNavigate();
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>();
  const [userLocation, setUserLocation] = useState<Coordinate | undefined>();
  const [realDistance, setRealDistance] = useState<number>(10000);

  useEffect(() => {
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

  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          console.log(latitude, longitude);
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

  const checkDistance = (coor: Coordinate) => {
    getUserLocation();
    if (userLocation) {
      console.log(
        [userLocation?.latitude, userLocation?.longitude],
        [coor?.latitude, coor?.longitude]
      );
      const distance1 = distance(
        [userLocation?.longitude, userLocation?.latitude],
        [coor?.longitude, coor?.latitude],
        { units: "meters" }
      );
      setRealDistance(distance1);
    }
  };

  return (
    <>
      {currentChallenge && (
        <div>
          <h1>{currentChallenge.title}</h1>
          <h3>{currentChallenge.description}</h3>
          <h1>{realDistance}</h1>
          <button onClick={() => checkDistance(testList[0])}>Vegard</button>
          <button onClick={() => checkDistance(testList[1])}>Mads</button>
          <button onClick={() => checkDistance(testList[2])}>MESH</button>
          <button onClick={() => checkDistance(testList[3])}>PayEx</button>
          <button onClick={() => checkDistance(testList[4])}>Multi</button>
          <button onClick={() => checkDistance(testList[5])}>Graveyard</button>
          <button onClick={() => checkDistance(testList[6])}>Martin</button>
        </div>
      )}
    </>
  );
}

export default CurrentChallengePage;
