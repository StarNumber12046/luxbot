import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../index.js';

export default {
	data: {
		name: 'ship',
		description: 'Relationship compatibility tester (100% accurate)',
		options: [
			{
				name: 'user1',
				required: true,
				type: ApplicationCommandOptionType.User,
				description: 'User 1',
			},
			{
				name: 'user2',
				required: true,
				type: ApplicationCommandOptionType.User,
				description: 'User 2',
			},
			{
				name: 'user3',
				required: false,
				type: ApplicationCommandOptionType.User,
				description: 'User 3',
			},
		],
	},
	category: 'fun',
	hidden: false,
	async execute(interaction: ChatInputCommandInteraction) {
		const user1 = interaction.options.getUser('user1');
		const user2 = interaction.options.getUser('user2');
		const user3 = interaction.options.getUser('user3');
		const compatibility = Math.round(Math.random() * 100);
		if (user3) {
			await interaction.reply(`**❤️RELATIONSHIP STATUS❤️**
${user1} + ${user2} + ${user3}
**COMPATIBILITY:** ${compatibility}%`);
			return;
		}
		await interaction.reply(`**❤️RELATIONSHIP STATUS❤️**
${user1} + ${user2}
**COMPATIBILITY:** ${compatibility}%`);
	},
} satisfies Command;
