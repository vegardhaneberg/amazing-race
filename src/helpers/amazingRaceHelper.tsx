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
