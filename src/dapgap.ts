import { DapChain } from "./models";
import type { GuildMember, User } from "discord.js";
import type { Collection } from "mongoose";
import { streak } from "./lib/streak";

interface streakOutput {
	streak: number;
	lastDapCooldown: boolean;
}

export const getStreaks = async (
	user1: User | GuildMember,
	user2: User | GuildMember
): Promise<streakOutput> => {
	type DapDocument = Collection & { createdAt: Date; updatedat: Date };
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
			Infinity) < 30000;

	const data = dapData.map(document => +document.createdAt)
	return {
		streak: streak([Date.now(), ...data], 1000 * 60 * 60 * 24),
		lastDapCooldown
	}
};
