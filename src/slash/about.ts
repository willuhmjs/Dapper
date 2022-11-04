import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { CommandLike } from "./command";

export default <CommandLike>{
	data: new SlashCommandBuilder()
		.setName("about")
		.setDescription("Sends an ephemeral message with info about the bot."),
	async execute(client, interaction) {
		const replyEmbed = new EmbedBuilder()
			.setColor("Green")
			.setTitle("About")
			.setDescription(
				"Give dap to other members in your Discord server and earn social points towards your server's dap leaderboard.\nSupport Server: [https://discord.gg/XDNz3Qv6gr](https://discord.gg/XDNz3Qv6gr)\nOpen the slash command menu to view a list of commands."
			)
			.setURL("https://en.wikipedia.org/wiki/Giving_dap")
			.setThumbnail(
				"https://media.discordapp.net/attachments/1028766392989794444/1029202069812424764/dapper.png?width=406&height=406"
			)
			.setTimestamp();
		interaction.reply({ embeds: [replyEmbed], ephemeral: true });
	},
};
