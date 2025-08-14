import { EmbedBuilder, Events } from 'discord.js';
import type { Event } from './index.js';
import { CustomClient } from '../types.js';

export default {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		const validGuessGames = (message.client as CustomClient).guessChannels.filter(
			(game) => game.channelId === message.channelId,
		);
		console.log(validGuessGames);
		validGuessGames.forEach((game) => {
			console.log(game.answers);
			if (game.answers.includes(message.content.toLowerCase())) {
				const embed = new EmbedBuilder()
					.setTitle('Correct!')
					.setColor('#2ecc70')
					.setDescription(`<@${message.author.id}> answered the question correctly.`);
				message.reply({
					embeds: [embed],
				});
				return;
			}
			const valueIndex = (message.client as CustomClient).guessChannels.indexOf(game);
			console.log(valueIndex);
			(message.client as CustomClient).guessChannels.splice(valueIndex, 1);
			console.log((message.client as CustomClient).guessChannels);
		});
	},
} satisfies Event<Events.MessageCreate>;
