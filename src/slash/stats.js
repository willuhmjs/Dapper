// stats with a certain person, how many daps youve recieved or given
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View the dap stats of another member.')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('The server member who you want to view stats from.')
                .setRequired(false)
        ),
    async execute(client, interaction) {
        function embedError(text) {
            const replyEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(text)
            .setTimestamp();

            interaction.reply({ embeds: [replyEmbed], ephemeral: true});
        }

        let member = interaction.options.getMember('member') || interaction.member;
        let isGuildMember = interaction.guild.members.cache.has(member.id);
        if (!isGuildMember) return embedError("You tried to view the stats of someone from another server and got lost.");
        if (member.bot) return embedError("You tried to view the stats of a bot, but it didn't respond");

        const { GuildDapSchema } = client.Schema;
        let UserGuildData = await GuildDapSchema.findOne({ userId: member.id, guildId: interaction.guild.id})
        
        const replyEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Statistics for " + member.user.username)
            .setDescription(`**${UserGuildData.userDap || 0}** DapScore.\n**${UserGuildData.dapsGiven || 0}** daps given.\n**${UserGuildData.dapsRecieved || 0}** daps recieved.`)
            .setTimestamp();
        interaction.reply({ embeds: [replyEmbed]})
    }
}