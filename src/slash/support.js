const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Sends an ephemeral invite to the Dapper support server.'),
    async execute(client, interaction) {
        function embedReply(text, error = false, footer) {
            const color = error ? "Red" : "Green"; 
            const replyEmbed = new EmbedBuilder()
            .setColor(color)
            .setDescription(text);

            if (footer) replyEmbed.setFooter({text: footer});
            interaction.reply({ embeds: [replyEmbed], ephemeral: error});
        }
        interaction.reply('')
    }
}