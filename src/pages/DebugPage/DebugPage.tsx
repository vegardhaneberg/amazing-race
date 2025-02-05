import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { Team } from "../../helpers/backendHelper";

function DebugPage() {
  const [team, setTeam] = useState<Team>();

  const signalRUrl =
    "https://amazing-race-oslo-web-backend.azurewebsites.net/listen";
  // const signalRUrl = "https://localhost:7192/listen";

  useEffect(() => {
    const connection: HubConnection = new HubConnectionBuilder()
      .withUrl(signalRUrl, { withCredentials: false })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("Connected to the hub");
      })
      .catch((err: string) => {
        console.error("Error connecting to the hub:", err);
      });

    connection.on("ReceiveMessage", (team) => {
      console.log("received team!!");
      setTeam(team);
    });
    return () => {
      connection.stop();
    };
  }, []);

  return (
    <>
      <div>
        <h1>Debug Page</h1>
        {team && (
          <>
            <p>{team.id}</p>
            <p>{team.balance}</p>
            <p>{team.code}</p>
            <p>{team.currentChallengeId}</p>
            <p>{team.currentChallengeStartTime}</p>
          </>
        )}
      </div>
    </>
  );
}

export default DebugPage;
