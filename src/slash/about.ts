import { SlashCommandBuilder, EmbedBuilder, Client } from "discord.js";
export default {
	data: new SlashCommandBuilder()
		.setName("about")
		.setDescription("Sends an ephemeral message with info about the bot."),
	async execute(client: Client, interaction: any) {
		const replyEmbed = new EmbedBuilder()
			.setColor("Green")
			.setTitle("About")
			.setDescription(
				"Give dap to other members in your Discord server and earn social points towards your server's dap leaderboard.\nSupport Server: [https://discord.gg/XDNz3Qv6gr](https://discord.gg/XDNz3Qv6gr)\nOpen the slash command menu to view a list of commands."
			)
			.setTimestamp();
		interaction.reply({ embeds: [replyEmbed], ephemeral: true });
	},
};
