import { commands } from "./slash"
import {
	Client,
	Collection,
	GatewayIntentBits,
	Routes,
	ActivityType,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import { REST } from "@discordjs/rest";
import mongoose from "mongoose";
import { clientId, token, mongo } from "./config";
import { GuildDapSchema, DapChain } from "./models";
import type { CommandLike, ChatInputCommandAssertedInteraction }	from "./slash/command"

if (!token) throw Error("No token!");
if (!clientId) throw Error("No clientId!");

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

(client as any).Schema = { GuildDapSchema, DapChain };
const commandList = new Collection<string, CommandLike>();

const commandData: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []

for (const command of commands) {
	commandList.set(command.data.name, command);
	commandData.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

rest
	.put(Routes.applicationCommands(clientId), { body: commandData })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);

client.once("ready", async () => {
	if (!mongo) throw Error("No mongo!");
	if (!client.user) throw Error("Unexpected: client.user is null");
	client.user.setActivity("/dap", { type: ActivityType.Listening });
	console.log("Connected to Discord API!");
	mongoose.connect(mongo, (error) => {
		if (error) throw error;
		else console.log("Connected to MongoDB");
		//client.user.setAvatar("https://media.discordapp.net/attachments/1028766392989794444/1029202069812424764/dapper.png?width=406&height=406");
	});
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	if (!interaction.guild) return;

	const command = commandList.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction as ChatInputCommandAssertedInteraction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

client.login(token);
