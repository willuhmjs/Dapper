// stats with a certain person, how many daps youve recieved or given
import { SlashCommandBuilder, EmbedBuilder, Client, GuildMember } from "discord.js";
import { getStreaks } from "../dapgap";
export default {
	data: new SlashCommandBuilder()
		.setName("stats")
		.setDescription("View the dap stats of another member.")
		.addUserOption((option) =>
			option
				.setName("member")
				.setDescription("The server member who you want to view stats from.")
				.setRequired(false)
		),
	async execute(client: Client, interaction: any) {
		function embedError(text: string) {
			const replyEmbed = new EmbedBuilder()
				.setColor("Red")
				.setDescription(text)
				.setTimestamp();

			interaction.reply({ embeds: [replyEmbed], ephemeral: true });
		}

		let member: GuildMember = interaction.options.getMember("member") || interaction.member;
		let isGuildMember = interaction.guild.members.cache.has(member.id);
		if (!isGuildMember)
			return embedError(
				"You tried to view the stats of someone from another server and got lost."
			);
		if (member.user.bot)
			return embedError(
				"You tried to view the stats of a bot, but it didn't respond"
			);

		let { streak } = await getStreaks(interaction.member, member);

		const { GuildDapSchema } = (client as any).Schema;
		let UserGuildData =
			(await GuildDapSchema.findOne({
				userId: member.id,
				guildId: interaction.guild.id,
			})) || {};

		const replyEmbed = new EmbedBuilder()
			.setColor("Green")
			.setTitle("Statistics for *" + member.nickname || member.user.username + "*")
			.setDescription(
				`**${UserGuildData.userDap || 0}** DapScore.\n**${
					UserGuildData.dapsGiven || 0
				}** daps given.\n**${UserGuildData.dapsRecieved || 0}** daps recieved.`
			)
			.setTimestamp();

		if (streak)
			replyEmbed.setFooter({ text: `🔥 You have a ${streak} day streak!` });
		interaction.reply({ embeds: [replyEmbed] });
	},
};
