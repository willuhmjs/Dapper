const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DapChain } = require('../models');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('dap')
        .setDescription('Dap up another member!')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('The server member you want to dap up.')
                .setRequired(true)
        ),
    async execute(client, interaction) {
        function embedReply(text, error = false, footer) {
            const color = error ? "Red" : "Green"; 
            const replyEmbed = new EmbedBuilder()
            .setColor(color)
            .setDescription(text)
            .setTimestamp();

            if (footer) replyEmbed.setFooter({text: footer});
            interaction.reply({ embeds: [replyEmbed], ephemeral: error});
        }

        let reciever = interaction.options.getUser('member');
        let giver = interaction.user;
        let guildId = interaction.guild.id;
        let isGuildMember = interaction.guild.members.cache.has(reciever.id);
        if (!isGuildMember) return embedReply("You tried to dap up someone from another server. It didn't go well.", true);
        if (reciever.id == giver.id) return embedReply("You tried to dap up yourself, but you looked too lonely.", true)
        if (reciever.bot) return embedReply("You tried to dap up a robot, but it had no hands.", true)
        
        const giverDap = Math.floor(Math.random() * (60 - 30) + 30);
        const recieverDap = Math.ceil(giverDap / 2);

        const { getStreaks } = require("../dapgap");
        const { lastDapHeute } = await getStreaks(giver, reciever);
        if (lastDapHeute) return embedReply(`<@${giver.id}> 🤝 <@${reciever.id}>`);
        

        const { GuildDapSchema, DapChain } = client.Schema;
        // push transaction to dapchain
        await new DapChain({
            giverId: giver.id,
            recieverId: reciever.id,
            guildId: interaction.guild.id
        }).save();

        // update GIVER

        let giverGuildDap = await GuildDapSchema.findOne({userId: giver.id, guildId });
        if (!giverGuildDap) {
            giverGuildDap = await new GuildDapSchema({
                userId: giver.id,
                userDap: giverDap,
                dapsGiven: 1,
                guildId
            }).save();
        } else {
            giverGuildDap.userDap += giverDap;
            giverGuildDap.dapsGiven++;
            await giverGuildDap.save()
        }

        // update RECIEVER

        let recieverGuildDap = await GuildDapSchema.findOne({userId: reciever.id, guildId });
        if (!recieverGuildDap) {
            recieverGuildDap = await new GuildDapSchema({
                userId: reciever.id,
                userDap: recieverDap,
                dapsRecieved: 1,
                guildId
            }).save();
        } else {
            recieverGuildDap.userDap += recieverDap;
            recieverGuildDap.dapsRecieved++;
            await recieverGuildDap.save()
        }
 
        return embedReply(`<@${giver.id}> 🤝 <@${reciever.id}>`, false, `+${giverDap} DapScore`);
    }
}