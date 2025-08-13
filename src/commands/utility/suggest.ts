import { ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../index.js';

export default {
	data: {
		name: 'suggest',
		description: 'Suggest a feature to the staff members',
		options: [
			{ name: 'suggestion', required: true, type: ApplicationCommandOptionType.String, description: 'Suggestion' },
		],
	},
	category: 'utility',
	hidden: false,
	async execute(interaction: ChatInputCommandInteraction) {
		const suggestion = interaction.options.getString('suggestion');
		await interaction.reply(
			'Thank you for suggesting ' + suggestion + '. Unfortunately, this command is currently not finished.',
		);
	},
} satisfies Command;
