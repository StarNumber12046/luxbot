import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../index.js';

export default {
	data: {
		name: 'coinflip',
		description: 'Toss a coin',
	},
	category: 'fun',
	hidden: false,
	async execute(interaction: ChatInputCommandInteraction) {
		const result = Math.round(Math.random()) === 0 ? 'Heads' : 'Tails';
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle('Coin Flip')
					.setColor('#f1c40f')
					.addFields([
						{
							name: 'Result',
							value: `The coin landed on ${result}!`,
							inline: false,
						},
					]),
			],
		});
	},
} satisfies Command;
