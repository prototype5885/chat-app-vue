export interface ServerModel {
  id: string;
  ownerID: string;
  name: string;
  picture: string;
  banner: string;
}

export interface ChannelModel {
  id: string;
  serverID: string;
  name: string;
}

export interface MessageModel {
  id: string;
  channelID: string;
  userID: string;
  message: string;
  attachments: string[];
  edited: boolean;
  user: UserModel;
}

export interface AddMessageModel {
  message: string;
  channelID: string;
  replyID?: string;
}

export interface UserModel {
  id: string;
  displayName: string;
  picture: string;
}
