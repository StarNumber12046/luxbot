import { Client } from 'discord.js';
export type Quiz = { answers: string[]; question: string; channelId: string; id: number };

export type CustomClient = Client & { guessChannels: Quiz[] };
