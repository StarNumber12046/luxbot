import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../index.js';

export default {
	data: {
		name: 'info',
		description: "View LuxPlanes's social media handles",
	},
	category: 'utility',
	hidden: false,
	execute(interaction: ChatInputCommandInteraction) {
		const embed = new EmbedBuilder()
			.setTitle('LuxPlanes Information')
			.setDescription('Links to LuxPlanes social media accounts:')
			.setColor('#1c83dd')
			.addFields([
				{
					name: 'Youtube',
					value: '[LuxPlanes YouTube](https://youtube.com/LuxPlanes)',
					inline: false,
				},
				{
					name: 'TikTok',
					value: '[LuxPlanes TikTok](https://tiktok.com/@LuxPlanes)',
					inline: false,
				},
				{
					name: 'Instagram',
					value: '[LuxPlanes Instagram](https://instagram.com/luxplanes.lu)',
					inline: false,
				},
			]);
		interaction.reply({ embeds: [embed] });
	},
} satisfies Command;
