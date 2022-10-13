const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
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
        
        const giverDap = Math.floor(Math.random() * (6 - 3) + 3);
        const recieverDap = Math.ceil(giverDap / 2);

        const { DapSchema } = client.Schema;
        await new DapSchema({
            giverId: giver.id,
            recieverId: reciever.id,
            giverDap, recieverDap, guildId
        }).save(); 

        let resultsWithGiver = await DapSchema.find( { $or: [{ giverId: giver.id }, { recieverId: giver.id }] });
        let dapscore = 0;
        let localdapscore = 0;
        for (let i = 0; i < resultsWithGiver.length; i++) {
            let increase = resultsWithGiver[i].giverDap;
            dapscore += increase
            if (resultsWithGiver[i].guildId == guildId) localdapscore += increase
        }

        return embedReply(`<@${giver.id}> 🤝 <@${reciever.id}>`, false, `Server Dapscore: ${localdapscore} | Dapscore: ${dapscore}`);
    }
}