import { config } from "dotenv";
config();

export const token = process.env.TOKEN;
export const clientId = process.env.CLIENTID;
export const mongo = process.env.MONGO;
export const cooldown = 60 * 1000;