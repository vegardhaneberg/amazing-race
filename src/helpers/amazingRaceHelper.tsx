export const calculateTimeLeft = (
  currentChallengeStartTime: number
): number => {
  return Math.round(
    (currentChallengeStartTime + 10 * 60 * 1000 - Date.now()) / 1000
  );
};
