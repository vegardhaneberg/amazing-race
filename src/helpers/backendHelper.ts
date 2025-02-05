import axios from "axios";
import { hintTime } from "./constants";

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
  challengeNumber: number;
};

export type NextChallengeRequest = {
  team: Team;
  currentChallengeNumber: number;
};

export type NextChallengeResponse = {
  team: Team;
  challenge: Challenge;
};

const backendUrl = "https://amazing-race-oslo-web-backend.azurewebsites.net";
// const backendUrl = "https://localhost:7192";

export const getTeam = async (teamId: string): Promise<Team | undefined> => {
  try {
    const response = await axios.get<Team>(`${backendUrl}/team?id=${teamId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting team data:", error);
  }
};

export const buyHint = async (team: Team): Promise<Team | undefined> => {
  team.balance = team.balance - 50;
  team.currentChallengeStartTime =
    team.currentChallengeStartTime! - hintTime * 60 * 1000;

  try {
    const response = await axios.put<Team>(`${backendUrl}/team`, team);
    return response.data;
  } catch (error) {
    console.error("Error sending PUT /team:", error);
  }
};

export const getChallenge = async (
  challengeId: string
): Promise<Challenge | undefined> => {
  try {
    const response = await axios.get<Challenge>(
      `${backendUrl}/challenge?id=${challengeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting challenge:", error);
  }
};

export const getChallenges = async (): Promise<Challenge[] | undefined> => {
  try {
    const response = await axios.get<Challenge[]>(`${backendUrl}/challenges`);
    return response.data;
  } catch (error) {
    console.error("Error getting team data:", error);
  }
};

export const setNextChallengeForTeam = async (
  nextChallenge: NextChallengeRequest
): Promise<NextChallengeResponse | undefined> => {
  try {
    const response = await axios.post<NextChallengeResponse>(
      `${backendUrl}/team/next-challenge`,
      nextChallenge
    );
    return response.data;
  } catch (error) {
    console.error("Error getting team data:", error);
  }
};

export const validateTeamCode = async (
  answer: string
): Promise<Team | undefined> => {
  try {
    console.log("fheuiwhfeuiw");
    const response = await axios.get<Team>(
      `${backendUrl}/teams/validation?answer=${answer}`
    );
    if (response.status === 200) return response.data;
    return undefined;
  } catch (error) {
    console.error("Error getting team data:", error);
  }
};

export const updateTeam = async (team: Team): Promise<Team | undefined> => {
  try {
    const response = await axios.put<Team>(`${backendUrl}/team/`, team);
    return response.data;
  } catch (error) {
    console.error("Error getting team data:", error);
  }
};
