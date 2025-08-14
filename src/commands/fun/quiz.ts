import { ChatInputCommandInteraction, EmbedBuilder, Message, TextChannel } from 'discord.js';
import { Command } from '../index.js';
import { env } from 'process';
import { CustomClient, Quiz } from '../../types.js';

export default {
	data: {
		name: 'quiz',
		description: 'Get asked a random aviation question!',
	},
	category: 'fun',
	hidden: false,
	async execute(interaction: ChatInputCommandInteraction) {
		const questions = await interaction.client.guilds
			.fetch(env.GUILD_ID!)
			.then((guild) =>
				guild.channels
					.fetch(env.QUIZ_QUESTIONS_CHANNEL_ID!)
					.then((channel) => (channel as TextChannel | null)?.messages.fetch({ limit: 100 })),
			);
		const question = questions?.filter(Boolean).random() as Message<true>;
		console.log(question);
		const raw = question.cleanContent.split('|');
		const questionText = raw[0].trim();
		const answers = raw[1].split(',').map((answer) => answer.trim().toLowerCase());
		const embed = new EmbedBuilder()
			.setTitle('Aviation Quiz')
			.setColor('Random')
			.setDescription(questionText)
			.setFooter({ text: 'You have 30 seconds to answer!' });
		await interaction.reply({
			embeds: [embed],
		});
		const questionId = Math.floor(Math.random() * 10000);
		const quiz = {
			answers: answers,
			question: questionText,
			channelId: interaction.channelId,
			id: questionId,
		} satisfies Quiz;
		(interaction.client as CustomClient).guessChannels.push(quiz);
		setTimeout(() => {
			// Remove the quiz from the list if it still exists
			console.log('in setTimeout()');
			console.log((interaction.client as CustomClient).guessChannels);
			const index = (interaction.client as CustomClient).guessChannels.findIndex((game) => game.id === questionId);
			if (index !== -1) {
				(interaction.client as CustomClient).guessChannels.splice(index, 1);
				interaction.followUp({
					embeds: [
						new EmbedBuilder()
							.setTitle("Time's Up!")
							.setColor('#e74d3c')
							.setDescription('The correct answer was `' + answers[0] + '`'),
					],
				});
			}
		}, 30_000);
	},
} satisfies Command;
