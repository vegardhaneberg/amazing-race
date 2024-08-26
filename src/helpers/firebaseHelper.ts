import { get, ref, set } from "firebase/database";
import { db } from "./../../firebaseConfig";

export type Team = {
  id: string;
  currentChallengeId: string;
  code: string;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
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

  const teamId = teams.find((team) => team.code === answer)?.id;

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

export const setCurrentChallenge = async (
  teamId: string,
  challengeId: string
) => {
  const teamsRef = ref(db, `teams`);
  const teams: Team[] = (await get(teamsRef)).val();
  if (await getChallenge(challengeId)) {
    const editedTeams = teams.map((team) => {
      if (team.id === teamId) {
        team.currentChallengeId = challengeId;
      }
      return team;
    });

    await set(teamsRef, editedTeams);
  }
};
