import { SlashCommandBuilder, EmbedBuilder, User } from "discord.js";
import type { CommandLike } from "./command";

export default <CommandLike>{
	data: new SlashCommandBuilder()
		.setName("dap")
		.setDescription("Dap up another member!")
		.addUserOption((option) =>
			option
				.setName("member")
				.setDescription("The server member you want to dap up.")
				.setRequired(true)
		),
	async execute(client, interaction) {
		function embedReply(text: string, error = false, footer?: string) {
			const color = error ? "Red" : "Green";
			const replyEmbed = new EmbedBuilder()
				.setColor(color)
				.setDescription(text)
				.setTimestamp();

			if (footer) replyEmbed.setFooter({ text: footer });
			interaction.reply({ embeds: [replyEmbed], ephemeral: error });
		}

		let reciever: User | null = interaction.options.getUser("member");

		if (!reciever) return embedReply("You tried to dap up a ghost.", true);

		let giver: User = interaction.user;
		let guildId = interaction.guild.id;
		let isGuildMember = interaction.guild.members.cache.has(reciever.id);
		if (!isGuildMember)
			return embedReply(
				"You tried to dap up someone from another server. It didn't go well.",
				true
			);
		if (reciever.id == giver.id)
			return embedReply(
				"You tried to dap up yourself, but you looked too lonely.",
				true
			);
		if (reciever.bot)
			return embedReply(
				"You tried to dap up a robot, but it had no hands.",
				true
			);

		const addDap = Math.floor(Math.random() * (15 - 5) + 5);

		const { getStreaks } = require("../dapgap");
		const { lastDapCooldown } = await getStreaks(giver, reciever);

		const { GuildDapSchema, DapChain } = (client as any).Schema;
		// push transaction to dapchain
		const dap = new DapChain({
			giverId: giver.id,
			recieverId: reciever.id,
			guildId: interaction.guild.id,
		});

		if (lastDapCooldown) {
			dap.gainedScore = false;
			return embedReply(`<@${giver.id}> 🤝 <@${reciever.id}>`);
		}

		await dap.save();

		// update GIVER

		let giverGuildDap = await GuildDapSchema.findOne({
			userId: giver.id,
			guildId,
		});
		if (!giverGuildDap) {
			giverGuildDap = await new GuildDapSchema({
				userId: giver.id,
				userDap: addDap,
				dapsGiven: 1,
				guildId,
			}).save();
		} else {
			giverGuildDap.userDap += addDap;
			giverGuildDap.dapsGiven++;
			await giverGuildDap.save();
		}

		// update RECIEVER

		let recieverGuildDap = await GuildDapSchema.findOne({
			userId: reciever.id,
			guildId,
		});
		if (!recieverGuildDap) {
			recieverGuildDap = await new GuildDapSchema({
				userId: reciever.id,
				userDap: addDap,
				dapsRecieved: 1,
				guildId,
			}).save();
		} else {
			recieverGuildDap.userDap += addDap;
			recieverGuildDap.dapsRecieved++;
			await recieverGuildDap.save();
		}

		return embedReply(
			`<@${giver.id}> 🤝 <@${reciever.id}>`,
			false,
			`+${addDap} DapScore`
		);
	},
};
