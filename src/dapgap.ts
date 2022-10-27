import { DapChain } from "./models";
import type { GuildMember, User } from "discord.js";
import type { Collection } from "mongoose";

interface streakOutput {
	streak: number;
	lastDapCooldown: boolean;
}

export const getStreaks = async (
	user1: User | GuildMember,
	user2: User | GuildMember
): Promise<streakOutput | never> => {
	type DapDocument = Collection & { createdAt: Date; updatedat: Date };
	const DapData: DapDocument[] = await DapChain.find(
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
		(Date.now() - DapData[DapData.length - 1]?.createdAt.getTime() ||
			Infinity) < 30000;
	if (DapData.length == 0) {
		return { streak: 0, lastDapCooldown };
	} else if (DapData.length == 1) {
		console.log(Date.now() - DapData[0].createdAt.getTime());
		if (Date.now() - DapData[0].createdAt.getTime() < 86400000)
			return { streak: 1, lastDapCooldown }; else return { streak: 0, lastDapCooldown };
	} else if (DapData.length > 1) {
		let streak = 1;
		for (let i = 1; i < DapData.length; i++) {
			if (
				DapData[i].createdAt.getTime() - DapData[i - 1].createdAt.getTime() <
				86400000
			)
				streak++;
			else return { streak, lastDapCooldown };
		}
		return { streak, lastDapCooldown };
	}
	throw Error("Impossible condition");
};
