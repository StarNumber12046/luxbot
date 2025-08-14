import { EmbedBuilder, Events, TextChannel } from 'discord.js';
import type { Event } from './index.js';
import { redis } from '../redis.js';
import { env } from 'process';

export default {
	name: Events.MessageReactionRemove,
	once: false,
	async execute(reaction) {
		console.debug(
			`[Starboard] Reaction added: emoji=${reaction.emoji.name}, messageId=${reaction.message.id}, channelId=${reaction.message.channelId}`,
		);
		if (reaction.partial) {
			console.debug('[Starboard] Reaction is partial, attempting to fetch full reaction object.');
			// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
			try {
				await reaction.fetch();
				console.debug('[Starboard] Successfully fetched partial reaction.');
			} catch (error) {
				console.error('Something went wrong when fetching the message:', error);
				// Return as `reaction.message.author` may be undefined/null
				return;
			}
		}
		if (reaction.emoji.name === '⭐') {
			console.debug(`[Starboard] Star emoji detected for messageId=${reaction.message.id}`);
			const messageReactions = reaction.message.reactions.cache.get(reaction.emoji.name);
			const redisValue: string | null = await redis.get(`starboard:${reaction.message.id}`);
			if (messageReactions) {
				const actualReactions = await messageReactions.fetch();
				const users = Array.from(
					(await actualReactions.users.fetch()).filter((user) => user.id !== reaction.message.author!.id).values(),
				);

				console.debug(`[Starboard] Users (excluding author) who reacted with ⭐: ${users}`);

				if (users.length >= 3) {
					console.debug(
						`[Starboard] Message ${reaction.message.id} reached threshold for starboard. Checking Redis...`,
					);
					console.debug(`[Starboard] Redis value for starboard:${reaction.message.id}:`, redisValue);
					if (!redisValue) {
						console.debug(
							`[Starboard] Message ${reaction.message.id} not yet on starboard. Creating embed and sending to starboard channel.`,
						);
						const embed = new EmbedBuilder()
							.setTitle(reaction.message.content ?? 'Embed / Attachment')
							.setColor('#f1c40f')
							.setDescription(
								`⭐ ${users.length} | https://discord.com/channels/${reaction.message.guildId}/${reaction.message.channelId}/${reaction.message.id} ⭐`,
							)
							.setAuthor({
								name: reaction.message.author?.tag ?? 'Unknown',
								iconURL: reaction.message.author?.displayAvatarURL(),
							});
						const starboardChannel = (await reaction.message.guild?.channels.fetch(env.STARBOARD_CHANNEL_ID!, {
							force: true,
						})) as TextChannel;
						console.debug(`[Starboard] Fetched starboard channel: ${starboardChannel?.id}`);
						const msg = await starboardChannel?.send({ embeds: [embed] });
						console.debug(`[Starboard] Sent message to starboard channel with id: ${msg?.id}`);
						await redis.set(`starboard:${reaction.message.id}`, msg.id);
						console.debug(`[Starboard] Set Redis key starboard:${reaction.message.id} to value: ${msg?.id}`);
					} else {
						console.debug(`[Starboard] Message ${reaction.message.id} is already on the starboard.`);
						const embed = new EmbedBuilder()
							.setTitle(reaction.message.content ?? 'Embed / Attachment')
							.setColor('#f1c40f')
							.setDescription(
								`⭐ ${users.length} | https://discord.com/channels/${reaction.message.guildId}/${reaction.message.channelId}/${reaction.message.id} ⭐`,
							)
							.setAuthor({
								name: reaction.message.author?.tag ?? 'Unknown',
								iconURL: reaction.message.author?.displayAvatarURL(),
							});
						const starboardChannel = (await reaction.message.guild?.channels.fetch(env.STARBOARD_CHANNEL_ID!, {
							force: true,
						})) as TextChannel;
						console.debug(`[Starboard] Fetched starboard channel: ${starboardChannel?.id}`);
						const msg = await starboardChannel?.messages.fetch(redisValue);
						console.debug(`[Starboard] Fetched message from starboard channel with id: ${msg?.id}`);
						await msg?.edit({ embeds: [embed] });
					}
				} else {
					console.debug(`[Starboard] Message ${reaction.message.id} does not meet starboard threshold.`);
					if (redisValue) {
						const starboardChannel = (await reaction.message.guild?.channels.fetch(env.STARBOARD_CHANNEL_ID!, {
							force: true,
						})) as TextChannel;
						console.debug(`[Starboard] Fetched starboard channel: ${starboardChannel?.id}`);
						const msg = await starboardChannel?.messages.fetch(redisValue);
						await msg.delete();
						await redis.del(`starboard:${reaction.message.id}`);
					}
				}
			} else {
				console.debug(`[Starboard] No messageReactions found for emoji ⭐ on messageId=${reaction.message.id}`);
			}
		}
	},
} satisfies Event<Events.MessageReactionRemove>;
