import type { ChannelModel, MessageModel, ServerModel } from "@/models";
import { decode } from "@msgpack/msgpack";
import mitt from "mitt";

const types = {
  ServerDeleted: 1,
  ServerModified: 2,

  ChannelCreated: 10,
  ChannelDeleted: 11,
  ChannelModified: 12,

  MessageCreated: 20,
  MessageDeleted: 21,
  MessageModified: 22,
};

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

  public static connect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.warn("WebSocket is already connected.");
      return;
    }

    this.socket = new WebSocket(`ws://${window.location.host}/ws`);

    this.socket.binaryType = "arraybuffer";

    this.socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    this.socket.onmessage = async (event) => {
      let receivedBytes = new Uint8Array(event.data);

      console.log("Websocket message length:", receivedBytes.length);

      if (receivedBytes.length < 2) {
        console.error("Received message is too short");
        return;
      }

      const type = receivedBytes[0];
      const msg = decode(receivedBytes.slice(1, receivedBytes.length), {
        useBigInt64: true,
      }) as any;

      switch (type) {
        case types.ServerDeleted:
          WebSocketService.emitter.emit("ServerDeleted", msg);
          break;
        case types.ServerModified:
          WebSocketService.emitter.emit("ServerModified", msg);
          break;

        case types.ChannelCreated:
          WebSocketService.emitter.emit("ChannelCreated", msg);
          break;
        case types.ChannelDeleted:
          WebSocketService.emitter.emit("ChannelDeleted", msg);
          break;
        case types.ChannelModified:
          WebSocketService.emitter.emit("ChannelModified", msg);
          break;

        case types.MessageCreated:
          WebSocketService.emitter.emit("MessageCreated", msg);
          break;
        case types.MessageDeleted:
          WebSocketService.emitter.emit("MessageDeleted", msg);
          break;
        case types.MessageModified:
          WebSocketService.emitter.emit("MessageModified", msg);
          break;
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed.");
      this.socket = null;
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  public static Disconnect(): void {
    if (this.socket) {
      this.socket.close();
      console.log("WebSocket disconnected.");
      this.socket = null;
    } else {
      console.warn("No WebSocket connection to disconnect.");
    }
  }
}
