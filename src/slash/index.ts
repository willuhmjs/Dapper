import type { CommandLike } from "./command";

import about from "./about";
import dap from "./dap";
import leaderboard from "./leaderboard";
import stats from "./stats";
import profile from "./profile";

export const commands: CommandLike[] = [about, dap, leaderboard, stats, profile];
