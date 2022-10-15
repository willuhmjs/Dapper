// stats with a certain person, how many daps youve recieved or given
const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
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
        let guildId = interaction.guild.id;
        let isGuildMember = interaction.guild.members.cache.has(member.id);
        if (!isGuildMember) return embedError("You tried to view the stats of someone from another server and got lost.");
        if (member.bot) return embedError("You tried to view the stats of a bot, but it didn't respond");

        const { DapSchema } = client.Schema;
        let resultsWithMember = await DapSchema.find( { $or: [{ giverId: member.id }, { recieverId: member.id }] });
        let dapscore = 0, localdapscore = 0, dapsrecieved = 0, dapsgiven = 0, totaldaps = 0, localdapsrecieved = 0, localdapsgiven = 0, localtotaldaps = 0;
        for (let i = 0; i < resultsWithMember.length; i++) {
            let increase = resultsWithMember[i].giverDap;
            dapscore += increase
            if (resultsWithMember[i].guildId == guildId) localdapscore += increase

            if (resultsWithMember[i].giverId == member.id) dapsgiven++;
            if (resultsWithMember[i].recieverId == member.id) dapsrecieved++;

            if (resultsWithMember[i].giverId == member.id && resultsWithMember[i].guildId == guildId) localdapsgiven++;
            if (resultsWithMember[i].recieverId == member.id && resultsWithMember[i].guildId == guildId) localdapsrecieved++;
        }
        totaldaps = dapsrecieved + dapsgiven;
        localtotaldaps = localdapsrecieved + localdapsgiven;
        const replyEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Statistics for " + member.user.username)
            .addFields({ name: 'Global Stats', value: `**${dapscore}** DapScore.\n**${dapsgiven}** daps given.\n**${dapsrecieved}** daps recieved.`}, { name: 'Server Stats', value: `**${localdapscore}** DapScore.\n**${localdapsgiven}** daps given.\n**${localdapsrecieved}** daps recieved.`})
            .setTimestamp();
        interaction.reply({ embeds: [replyEmbed]})
    }
}