import process, { env } from 'node:process';
import { URL } from 'node:url';
import { Client, EmbedBuilder, GatewayIntentBits, Partials, TextChannel } from 'discord.js';
import { loadEvents } from './util/loaders.js';
import { CustomClient } from './types.js';
import { Cron } from 'croner';

// Initialize the client
// @ts-ignore
const client: CustomClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessageReactions,
	],
	partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

client.guessChannels = [];

new Cron(
	'* 20 16 * * *',
	async () => {
		console.log('Running QOTD Cron');
		const guild = await client.guilds.fetch(process.env.GUILD_ID!);
		const channel = (await guild.channels.fetch(process.env.DAILY_QUESTIONS_CHANNEL_ID!)) as TextChannel;
		const outChannel = (await guild.channels.fetch(process.env.DAILY_ANSWERS_CHANNEL_ID!)) as TextChannel;
		const messages = await channel.messages.fetch({ limit: 100 });
		if (messages.size === 0) {
			console.log('No messages found');
			return;
		}
		const question = messages.first();
		if (!question) {
			console.debug('No question found');
			return;
		}
		const date = new Date();
		const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
		const formattedDate = formatter.format(date);
		const embed = new EmbedBuilder()
			.setTitle(`Question Of The Day | ${formattedDate}`)
			.setDescription(
				`> **${question.cleanContent}**
				> 
				> Want to receive pings for future QOTDs? Enable QOTD pings by running \`/qotdpings\` in <#${env.BOT_COMMANDS_CHANNEL_ID!}>.`,
			)
			.setColor('Random')
			.setFooter({ text: `Question asked by ${question.author.username}` });
		const msg = await outChannel.send({
			embeds: [embed],
			content: `<@&${env.QOTD_ROLE_ID!}>`,
		});
		msg.startThread({ name: `QOTD | ${formattedDate}` });
		await question.delete();
	},
	{ timezone: 'Etc/UTC' },
);

// Load the events and commands
const events = await loadEvents(new URL('events/', import.meta.url));

// Register the event handlers
for (const event of events) {
	client[event.once ? 'once' : 'on'](event.name, async (...args) => {
		try {
			await event.execute(...args);
		} catch (error) {
			console.error(`Error executing event ${String(event.name)}:`, error);
		}
	});
}

// Login to the client
void client.login(process.env.DISCORD_TOKEN);
