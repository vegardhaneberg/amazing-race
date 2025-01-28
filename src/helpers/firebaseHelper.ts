import { get, ref, set } from "firebase/database";
import { db } from "./../../firebaseConfig";
import { hintPrize, hintTime } from "./constants";

export type Team = {
  id: string;
  currentChallengeId: string;
  currentChallengeStartTime?: number | undefined;
  code: string;
  balance: number;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  firstHint: string;
  secondHint: string;
  latitude: number;
  longitude: number;
};

export const getTeam = async (teamId: string) => {
  const teamsRef = ref(db, `teams`);
  const teams: Team[] = (await get(teamsRef)).val();
  const team = teams.find((team) => team.id === teamId);
  return team;
};

export const getChallenge = async (challengeId: string) => {
  const challengeRef = ref(db, `challenges`);
  const firebaseData = await get(challengeRef);
  const challenges: Challenge[] = firebaseData.val();
  const currentChallenge = challenges.find(
    (challenge) => challenge.id === challengeId
  );

  return currentChallenge;
};

export const validateTeamCode = async (answer: string) => {
  const teamsRef = ref(db, `teams`);

  const firebaseData = await get(teamsRef);
  const teams: Team[] = Object.values(firebaseData.val());

  const teamId = teams.find(
    (team) => team.code.toLowerCase() === answer.toLowerCase()
  )?.id;

  return teamId;
};

export const getCurrentChallege = async (teamId: string) => {
  const team = await getTeam(teamId);

  const challengeRef = ref(db, `challenges`);
  const firebaseData = await get(challengeRef);
  const challenges: Challenge[] = firebaseData.val();
  const currentChallenge = challenges.find(
    (challenge) => challenge.id === team!.currentChallengeId // TODO: finne ut hvordan vi løser dette
  );

  return currentChallenge;
};

export const setCurrentChallengeForTeam = async (
  teamId: string,
  challengeId: string
) => {
  const teamsRef = ref(db, `teams`);
  const teams: Team[] = (await get(teamsRef)).val();
  if (await getChallenge(challengeId)) {
    const editedTeams = teams.map((team) => {
      if (team.id === teamId) {
        team.currentChallengeId = challengeId;
        team.currentChallengeStartTime = Date.now();
      }
      return team;
    });

    await set(teamsRef, editedTeams);
  }
};

export const getChallenges = async () => {
  const challengeRef = ref(db, `challenges`);
  const firebaseData = await get(challengeRef);
  const challenges: Challenge[] = firebaseData.val();

  return challenges;
};

export const getNextChallenge = async (challengeId: string) => {
  const challenges = await getChallenges();
  const i = challenges.findIndex((c) => c.id === challengeId);
  return challenges[i + 1];
};

export const buyHint = async (team: Team): Promise<Team> => {
  team.balance = team.balance - 50;
  team.currentChallengeStartTime =
    team.currentChallengeStartTime! - hintTime * 60 * 1000;

  const teamsRef = ref(db, `teams`);

  const teams: Team[] = (await get(teamsRef)).val();

  const editedTeams = teams.map((t) => {
    if (t.id === team.id) {
      t.balance = t.balance - hintPrize;
      t.currentChallengeStartTime =
        t.currentChallengeStartTime! - hintTime * 60 * 1000;
    }
    return t;
  });

  await set(teamsRef, editedTeams);

  return editedTeams.find((t) => t.id === team.id)!;
};
