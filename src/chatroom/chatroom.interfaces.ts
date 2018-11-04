export interface IChatroomArgs {
	chatroom: string;
}

export interface ISendMessageArgs {
	message: string;
	chatroom: string;
}

export interface ICreateChatroomArgs {
	users?: [string];
}

export interface IJoinChatroomArgs {
	chatroom: string;
}

export interface ISubscribeToNewMessageArgs {
	chatroom: string;
}
