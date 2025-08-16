import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../index.js';
import { readFileSync } from 'fs';

export default {
	data: {
		name: 'fakefact',
		description: 'Receive a believable fake fact that you can trick your friends with',
	},
	category: 'fun',
	hidden: false,
	async execute(interaction: ChatInputCommandInteraction) {
		const factsFile = readFileSync('facts.txt');
		const facts = factsFile.toString().split('\n');
		const randomFact = facts[Math.floor(Math.random() * facts.length)];
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle('**FUN FACT!**')
					.setColor('Random')
					.setDescription(`> **DID YOU KNOW?**\n> ${randomFact}`)
					.setFooter({ text: `Accuracy: ${Math.round(Math.random() * 100)}%` }),
			],
		});
	},
} satisfies Command;
