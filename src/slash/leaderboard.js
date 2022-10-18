const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays a leaderboard for your server.'),
    async execute(client, interaction) {
        const { GuildDapSchema } = client.Schema;
        let guildUsers = await GuildDapSchema.find({ guildId: interaction.guild.id }).sort({ userDap: -1 });
        // respond with the data
        /*const replyEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("About")
        .setTimestamp();
        interaction.reply({ embeds: [replyEmbed], ephemeral: true});*/
    
    }
}