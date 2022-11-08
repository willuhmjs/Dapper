import { DapChain } from "../models";
import type { GuildMember, User } from "discord.js";
import type { Collection } from "mongoose";
import { streak } from "./streak";
import { cooldown, streakGap } from "../config";

interface streakOutput {
	streak: number;
	lastDapCooldown: boolean;
}

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
		{ sort: "ascending" }
	);
	let lastDapCooldown: boolean =
		(Date.now() - dapData[dapData.length - 1]?.createdAt.getTime() ||
			Infinity) < cooldown && dapData[dapData.length - 1].gainedScore == true;

			// sort by descending
	const data = [Date.now(), ...dapData.map((document) => +document.createdAt)].sort((a, b) => b - a);
	const index = streak(data, streakGap);
	if (index === -1) return { streak: 0, lastDapCooldown };
	return {
		streak: Math.floor((Date.now() - data[index]) / streakGap) + 1,
		lastDapCooldown,
	};
};
