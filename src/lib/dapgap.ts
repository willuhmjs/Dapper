import { DapChain } from "../models";
import type { GuildMember, User } from "discord.js";
import type { Collection } from "mongoose";
import { streak } from "./streak";
import { cooldown } from "../config";

interface streakOutput {
	streak: number;
	lastDapCooldown: boolean;
}

const COOLDOWN_TIME = 1000 * 60 * 60 * 24;

export const getStreaks = async (
	user1: User | GuildMember,
	user2: User | GuildMember
): Promise<streakOutput> => {
	type DapDocument = Collection & {
		createdAt: Date;
		updatedat: Date;
		gainedScore: Boolean;
	};
	const dapData: DapDocument[] = await DapChain.find(
		{
			$or: [
				{ recieverId: user1.id, giverId: user2.id },
				{ recieverId: user2.id, giverId: user1.id },
			],
		},
		null,
		{ sort: "-date" }
	);
	let lastDapCooldown: boolean =
		(Date.now() - dapData[dapData.length - 1]?.createdAt.getTime() ||
			Infinity) < cooldown && dapData[dapData.length - 1].gainedScore == true;

	const data = [Date.now(), ...dapData.map((document) => +document.createdAt)];
	const index = streak(data, COOLDOWN_TIME);
	if (index === -1) return { streak: 0, lastDapCooldown };
	return {
		streak: Math.floor((Date.now() - data[index]) / COOLDOWN_TIME) + 1,
		lastDapCooldown,
	};
};
