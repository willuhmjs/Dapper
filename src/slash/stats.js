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
        function embedReply(text, error = false, footer) {
            const color = error ? "Red" : "Green"; 
            const replyEmbed = new EmbedBuilder()
            .setColor(color)
            .setDescription(text)
            .setTimestamp();

            if (footer) replyEmbed.setFooter({text: footer});
            interaction.reply({ embeds: [replyEmbed], ephemeral: error});
        }

        let member = interaction.options.getUser('member') || interaction.member;
        let guildId = interaction.guild.id;
        let isGuildMember = interaction.guild.members.cache.has(member.id);
        if (!isGuildMember) return embedReply("You tried to view the stats of someone from another server and got lost.", true);
        if (member.bot) return embedReply("You tried to view the stats of a bot, but it didn't respond", true)

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
        embedReply([dapscore, localdapscore, dapsrecieved, dapsgiven, totaldaps, localdapsrecieved, localdapsgiven, localtotaldaps].join(" "));
    }
}