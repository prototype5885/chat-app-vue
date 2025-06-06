export interface ServerModel {
  id: string;
  name: string;
  pic: string;
  ownerId: string;
}

export interface ChannelModel {
  id: string;
  serverId: string;
  name: string;
}

export interface MessageModel {
  id: string;
  userId: string;
  channelId: string;
  msg: string;
}

export interface AddServerModel {
  name: string;
}

export interface AddChannelModel {
  name: string;
  serverId: string;
}

export interface AddMessageModel {
  msg: string;
  channelId: string;
}
