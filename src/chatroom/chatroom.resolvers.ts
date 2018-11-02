import { withFilter } from 'graphql-subscriptions';
import { getUserId } from '../utils';
import {
	IChatroomArgs,
	ICreateChatroomArgs,
	IJoinChatroomArgs,
	ISendMessageArgs
} from './chatroom.interfaces';

const PUBSUB_NEW_MESSAGE = 'PUBSUB_NEW_MESSAGE';

const chatroomResolver = {
	Query: {
		async chatroom(parent, args: IChatroomArgs, ctx: Context, info) {
			return await ctx.db.query.chatroom(
				{
					where: {
						id: args.chatroom
					}
				},
				info
			);
		}
	},
	Mutation: {
		async createChatroom(parent, { users }: ICreateChatroomArgs, ctx: Context, info) {
			const userId = [await getUserId(ctx)];
			if (users) {
				userId.push(...users);
			}
			return await ctx.db.mutation.createChatroom(
				{
					data: {
						users: {
							connect: userId.map(id => ({ id }))
						}
					}
				},
				info
			);
		},
		async joinChatroom(parent, { chatroom }: IJoinChatroomArgs, ctx: Context, info) {
			const userID = await getUserId(ctx);
			const isInTheRoom = await ctx.db.exists.Chatroom({
				id: chatroom,
				users_some: {
					id: userID
				}
			});
			if (isInTheRoom) {
				throw new Error('This user is already in this chatroom');
			}
			return await ctx.db.mutation.updateChatroom(
				{
					where: {
						id: chatroom
					},
					data: {
						users: {
							connect: {
								id: userID
							}
						}
					}
				},
				info
			);
		},
		async sendMessage(
			parent,
			{ message, chatroom }: ISendMessageArgs,
			ctx: Context,
			info
		) {
			const newMessage = await ctx.db.mutation.createMessage(
				{
					data: {
						message,
						writer: {
							connect: {
								id: await getUserId(ctx)
							}
						},
						chatroom: {
							connect: {
								id: chatroom
							}
						}
					}
				},
				info
			);
			ctx.pubsub.publish(PUBSUB_NEW_MESSAGE, {
				newMessage: { ...newMessage, chatroom: { id: chatroom } }
			});
			return newMessage;
		}
	},
	Subscription: {
		newMessage: {
			subscribe: withFilter(
				(parent, args, { pubsub }: Context) =>
					pubsub.asyncIterator(PUBSUB_NEW_MESSAGE),
				(payload, args) => {
					return payload.newMessage.chatroom.id === args.chatroom;
				}
			)
		}
	}
};

export default chatroomResolver;
