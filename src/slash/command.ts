import {
	Client,
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	CacheType,
} from "discord.js";

export type ChatInputCommandAssertedInteraction =
	ChatInputCommandInteraction<CacheType> & {
		guild: ChatInputCommandInteraction<CacheType>["guild"] & {};
	};

export interface CommandLike {
	data: SlashCommandBuilder;
	execute: (
		client: Client,
		interaction: ChatInputCommandAssertedInteraction
	) => unknown;
}
