import { EmbedBuilder, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { loadCommands } from '../util/loaders.js';
import { getCategoryFancyName, type Command } from './index.js';

function getAllCategories(commands: Map<string, Command>) {
	const categories: Map<string, Command[]> = new Map();

	for (const [, command] of commands) {
		if (command.hidden) continue;
		if (!categories.has(command.category)) {
			categories.set(command.category, []);
		}
		categories.get(command.category)?.push(command);
	}

	return categories;
}

export default {
	data: {
		name: 'help',
		description: 'Gets help ',
	},
	category: 'other',
	hidden: true,
	async execute(interaction) {
		const commands = await loadCommands(new URL('../commands/', import.meta.url));
		const categories = Array.from(getAllCategories(commands).entries());
		const embed = new EmbedBuilder()
			.setTitle('**HELP**')
			.setDescription(
				`PREFIX **|** .
				> COMMANDS
				${categories
					.map(
						(category) =>
							`> ${getCategoryFancyName(category[0])}\n${category[1]
								.map(
									(command) =>
										`> \`${command.data.name}\` - ${(command.data as RESTPostAPIChatInputApplicationCommandsJSONBody).description}`,
								)
								.join('\n')}`,
					)
					.join('\n')}
					More to come!`,
			)
			.addFields([
				{
					inline: true,
					value: 'Made by StarNumber',
					name: 'LuxAirport / LuxPlanes',
				},
			])
			.setColor('#1c83dd');
		await interaction.reply({ embeds: [embed] });
	},
} satisfies Command;
