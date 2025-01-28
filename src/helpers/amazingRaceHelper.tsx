import { hintTime } from "./constants";

export const calculateTimeLeft = (
  currentChallengeStartTime: number,
  currentHint: number
): number => {
  const hintFactor = currentHint + 1;
  return Math.round(
    (currentChallengeStartTime +
      hintTime * 60 * 1000 * hintFactor -
      Date.now()) /
      1000
  );
};

export const calculateCurrentHint = (
  currentChallengeStartTime: number
): number => {
  const diff = (Date.now() - currentChallengeStartTime) / 1000 / 60;

  return Math.floor(diff / hintTime);
};

export type Coordinate = { latitude: number; longitude: number };

export const getUserLocation = (): Promise<Coordinate> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
          reject(error);
        }
      );
    } else {
      const errorMsg = "Geolocation is not supported by this browser.";
      console.error(errorMsg);
      reject(new Error(errorMsg));
    }
  });
};
