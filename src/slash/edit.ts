import { subtle } from "crypto";
import {
	SlashCommandBuilder,
	PermissionsBitField,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRow,
} from "discord.js";
import { GuildDapSchema } from "../models";
import type { CommandLike } from "./command";

export default <CommandLike>{
	data: new SlashCommandBuilder()
		.setName("edit")
		.setDescription("An administrator command to edit the profile of a user.")
		.addSubcommand(subcommand => 
			subcommand
			.setName("edit")
			.setDescription("Edit a user's profile.")
			.addUserOption(option =>
				option.setName("user").setDescription("The user to edit.")
			)
			
		)
		.addSubcommand(subcommand =>
			subcommand
			.setName("delete")
			.setDescription("Delete a user's profile.")
			.addUserOption(option =>
				option.setName("user").setDescription("The user to delete.")
			)
		)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
	async execute(client, interaction) {
		const user = interaction.options.getUser("user") || interaction.user;
		const UserGuildData =
			(await GuildDapSchema.findOne({
				userId: user.id,
				guildId: interaction.guild.id,
			})) ||
			(await new GuildDapSchema({
				userId: user.id,
				guildId: interaction.guild.id,
			}).save());



		if (interaction.options.getSubcommand() === "edit") {
			const modal = new ModalBuilder()
				.setTitle(`Editing ${user.username}'s profile`)
				.setCustomId("edit_profile_modal");

			const DapScoreInput = new TextInputBuilder()
				.setCustomId("dap_score_input")
				.setPlaceholder("DapScore")
				.setValue(`${UserGuildData.userDap}` || "0")
				.setMinLength(1)
				.setStyle(TextInputStyle.Short)
				.setLabel("DapScore");

			const DapsGivenInput = new TextInputBuilder()
				.setCustomId("daps_given_input")
				.setPlaceholder("Daps Given")
				.setValue(`${UserGuildData.dapsGiven}` || "0")
				.setMinLength(1)
				.setStyle(TextInputStyle.Short)
				.setLabel("Daps Given");

			const DapsRecievedInput = new TextInputBuilder()
				.setCustomId("daps_recieved_input")
				.setPlaceholder("Daps Recieved")
				.setValue(`${UserGuildData.dapsRecieved}` || "0")
				.setMinLength(1)
				.setStyle(TextInputStyle.Short)
				.setLabel("Daps Recieved");

			const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
				DapScoreInput
			);

			const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
				DapsGivenInput
			);

			const thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
				DapsRecievedInput
			);

			modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
			await interaction.showModal(modal);

			


		} else if (interaction.options.getSubcommand() === "delete") {
			/*await UserGuildData.deleteOne();
			await interaction.reply({
				content: `Deleted ${user.username}'s profile.`,
				ephemeral: true,
			});*/
		}
	},
};
