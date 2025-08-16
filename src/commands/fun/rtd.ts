import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../index.js';

export default {
	data: {
		name: 'rtd',
		description: 'Roll a dice with your inputted amount of sides',
		options: [
			{
				name: 'sides',
				required: true,
				type: ApplicationCommandOptionType.Integer,
				description: 'The amount of sides on the dice',
			},
		],
	},
	category: 'fun',
	hidden: false,
	async execute(interaction: ChatInputCommandInteraction) {
		const sides = await interaction.options.getInteger('sides');
		if (!sides) {
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle('Invalid Input')
						.setColor('#e74d3c')
						.addFields([
							{
								name: 'Error',
								value: 'You must provide a valid amount of sides for the dice',
								inline: false,
							},
						]),
				],
			});
			return;
		}
		const result = Math.round(Math.random() * sides);
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle('🎲 Dice Rolling 🎲')
					.setColor('#0f8f8f')
					.addFields([
						{
							name: 'Result',
							value: `The dice rolled a **${result}**!`,
							inline: false,
						},
					]),
			],
		});
	},
} satisfies Command;
