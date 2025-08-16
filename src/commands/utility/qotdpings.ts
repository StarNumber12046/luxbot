import { ChatInputCommandInteraction, EmbedBuilder, GuildMemberRoleManager } from 'discord.js';
import { Command } from '../index.js';

export default {
	data: {
		name: 'qotdpings',
		description: 'Get notified whenever a QOTD is posted',
	},
	category: 'utility',
	hidden: false,
	async execute(interaction: ChatInputCommandInteraction) {
		const role = await interaction.guild?.roles.fetch(process.env.QOTD_ROLE_ID!);
		if (!role) {
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle('Invalid Role')
						.setColor('#e74d3c')
						.addFields([
							{
								name: 'Error',
								value: 'Could not find the QOTD role',
								inline: false,
							},
						]),
				],
			});
			return;
		}
		if ((interaction.member?.roles as GuildMemberRoleManager).cache.has(role.id)) {
			const embed = new EmbedBuilder()
				.setTitle('QOTD Pings')
				.setColor('#e74d3c')
				.setDescription('You have been removed from `QOTD Pings`.');
			await interaction.reply({
				embeds: [embed],
			});
			(interaction.member?.roles as GuildMemberRoleManager).remove(role);
			return;
		}
		await (interaction.member?.roles as GuildMemberRoleManager).add(role);
		const embed = new EmbedBuilder()
			.setTitle('QOTD Pings')
			.setColor('#2ecc70')
			.setDescription(
				'You have received the `QOTD Pings` role. If you would like to stop getting notified for QOTDs, run `/qotdpings` again to remove the role.',
			);
		await interaction.reply({
			embeds: [embed],
		});
	},
} satisfies Command;
