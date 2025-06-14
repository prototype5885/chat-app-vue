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
  userId: string;
  channelId: string;
  msg: string;
}

export interface AddMessageModel {
  msg: string;
  channelId: string;
}
