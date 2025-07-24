export interface ServerModel {
  id: bigint;
  ownerID: bigint;
  name: string;
  picture: string;
  banner: string;
}

export interface ChannelModel {
  id: bigint;
  serverID: bigint;
  name: string;
}

export interface MessageModel {
  id: bigint;
  channelID: bigint;
  userID: bigint;
  message: string;
  attachments: string[];
  edited: boolean;
}

export interface AddMessageModel {
  message: string;
  channelID: bigint;
  replyID?: bigint;
}

export interface UserModel {
  id: bigint;
  displayName: string;
  picture: string;
}
