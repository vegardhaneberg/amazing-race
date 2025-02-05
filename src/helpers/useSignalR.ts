import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { Team } from "./backendHelper";

interface UseSignalROptions {
  url: string;
  teamId: string;
  onReceiveMessage: (data: Team) => void;
}

export const useSignalR = ({
  url,
  teamId,
  onReceiveMessage,
}: UseSignalROptions) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${url}?teamId=${teamId}`, { withCredentials: false })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [url]);

  useEffect(() => {
    if (!connection) return;

    connection
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");
        connection.on("ReceiveMessage", onReceiveMessage);
      })
      .catch((error) => console.error("SignalR Connection Error: ", error));

    // Cleanup on unmount
    return () => {
      connection.stop().then(() => console.log("SignalR connection stopped"));
    };
  }, [connection, onReceiveMessage]);

  return connection;
};
