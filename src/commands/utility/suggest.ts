import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, TextChannel } from 'discord.js';
import { Command } from '../index.js';
import { env } from 'process';

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
		const guild = await interaction.client.guilds.fetch(env.GUILD_ID!);
		const channel = (await guild.channels.fetch(env.SUGGESTIONS_CHANNEL_ID!)) as TextChannel;
		const embed = new EmbedBuilder()
			.setTitle('**SUGGESTION**')
			.setColor('#30d5c7')
			.setDescription(suggestion)
			.setThumbnail(interaction.user.displayAvatarURL())
			.setFooter({ text: `SUGGESTED BY: ${interaction.user.username}` });
		const msg = await channel.send({
			embeds: [embed],
		});
		const thread = await msg.startThread({
			name: `${interaction.user.displayName}'s Suggestion`,
		});
		await thread.send(`Suggested by <@${interaction.user.id}>`);
		await msg.react('✅');
		await msg.react('❌');
		await interaction.reply(
			'Thanks for your suggestion! Your suggestion will be brought to the attention of staff members.',
		);
	},
} satisfies Command;
