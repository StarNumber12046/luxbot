import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../index.js';

export default {
	data: {
		name: 'metar',
		description: 'Get the latest METAR for a given airport/weather station',
		options: [
			{
				name: 'airport',
				required: true,
				type: ApplicationCommandOptionType.String,
				description: 'Airport to get the METAR for',
			},
		],
	},
	category: 'fun',
	hidden: false,
	async execute(interaction: ChatInputCommandInteraction) {
		const airport = await interaction.options.getString('airport');
		console.log(airport);
		const response = await fetch(`https://api.met.no/weatherapi/tafmetar/1.0/metar.txt?icao=${airport}`, {
			headers: { 'User-Agent': 'LuxBot/1.0 (https://github.com/StarNumber12046/LuxBot)' },
		});
		const data = (await response.text())
			.split('\n')
			.filter((line) => line != '')
			.at(-1);
		console.log(data);
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`${airport} METAR`)
					.setColor('#f1c40f')
					.addFields([
						{
							name: 'METAR',
							value: data ?? "Couldn't find the METAR for the provided airport",
							inline: false,
						},
					]),
			],
		});
	},
} satisfies Command;
