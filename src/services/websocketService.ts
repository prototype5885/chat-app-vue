import type { ChannelModel, MessageModel, ServerModel } from "@/models";
import mitt from "mitt";

type EmitterEvents = {
  ServerDeleted: string;
  ServerModified: ServerModel;

  ChannelCreated: ChannelModel;
  ChannelDeleted: string;
  ChannelModified: ChannelModel;

  MessageCreated: MessageModel;
  MessageDeleted: string;
  MessageModified: MessageModel;
};

export class WebSocketService {
  private static socket: WebSocket | null = null;

  public static emitter = mitt<EmitterEvents>();

  public static connect() {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        console.warn("WebSocket is already connected.");
        return;
      }

      const wsProtocol = window.location.protocol.startsWith("https")
        ? "wss"
        : "ws";

      this.socket = new WebSocket(`${wsProtocol}://${window.location.host}/ws`);

      this.socket.onopen = () => {
        console.debug("WebSocket connection established.");
        resolve(true);
      };

      this.socket.onmessage = async (event) => {
        const [type, ...rest] = event.data.split(/\r?\n/);
        const jsonString = rest.join("\n");
        const msg = JSON.parse(jsonString);
        WebSocketService.emitter.emit(type, msg);
      };

      this.socket.onclose = () => {
        console.debug("WebSocket connection closed.");
        this.socket = null;
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      };
    });
  }

  public static Disconnect(): void {
    if (this.socket) {
      this.socket.close();
      console.debug("WebSocket disconnected.");
      this.socket = null;
    } else {
      console.warn("No WebSocket connection to disconnect.");
    }
  }
}
