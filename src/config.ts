import { config } from "dotenv";
config();

// Discord bot token
export const token = process.env.TOKEN;

// Discord bot client id
export const clientId = process.env.CLIENTID;

// MongoDB connection string URI
// https://www.mongodb.com/docs/manual/reference/connection-string/
export const mongo = process.env.MONGO;

// The cooldown between daps before dapscore is awarded again, in milliseconds
// default is 1 minute
export const cooldown = +(process.env.COOLDOWN || 60 * 1000);

export const streakGap = +(process.env.STREAK_GAP || 24 * 60 * 60 * 1000);
