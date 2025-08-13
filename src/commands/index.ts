import type { RESTPostAPIApplicationCommandsJSONBody, CommandInteraction } from 'discord.js';
import { z } from 'zod';
import type { StructurePredicate } from '../util/loaders.js';

/**
 * Defines the structure of a command
 */
export type Command = {
	/**
	 * The data for the command
	 */
	data: RESTPostAPIApplicationCommandsJSONBody;
	category: string;
	hidden: boolean;
	/**
	 * The function to execute when the command is called
	 *
	 * @param interaction - The interaction of the command
	 */
	execute(interaction: CommandInteraction): Promise<void> | void;
};

export function getCategoryFancyName(category: string): string {
	if (category === 'fun') return '🎮 Fun + Games 🎮';
	if (category === 'utility') return '🛠️ Utility 🛠️';
	return category[0].toUpperCase() + category.slice(1);
}

/**
 * Defines the schema for a command
 */
export const schema = z.object({
	data: z.record(z.any()),
	execute: z.function(),
});

/**
 * Defines the predicate to check if an object is a valid Command type.
 */
export const predicate: StructurePredicate<Command> = (structure: unknown): structure is Command =>
	schema.safeParse(structure).success;
