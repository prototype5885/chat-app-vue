import * as signalR from "@microsoft/signalr";
import type { MessageModel } from "../models";

export class SignalRService {
  public static conn: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("/Chat")
    .configureLogging(signalR.LogLevel.Debug)
    .withAutomaticReconnect()
    .build();

  public static async connect() {
    this.conn
      .start()
      .then(() => {
        this.conn.onreconnecting(() => {
          console.warn("Connection lost to SignalR, reconnecting...");
        });
        this.conn.onreconnected(() => {
          console.log("Successfully reconnected to SignalR!");
        });
        console.log("Successfully connected to SignalR!");
      })
      .catch(() => {
        console.warn(
          "Error connecting to SignalR server, retrying in 5 seconds...",
        );
        setTimeout(this.connect, 5000);
      });
  }

  public static disconnect() {
    if (this.conn && this.conn.state === "Connected") {
      this.conn.stop();
      console.log("SignalR disconnected.");
    }
  }
}
