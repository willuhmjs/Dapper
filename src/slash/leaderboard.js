const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the leaderboard for your server.'),
    async execute(client, interaction) {
        const { GuildDapSchema } = client.Schema;
        const { Pagination } = require('pagination.djs');
        const pagination = new Pagination(interaction, { limit: 10 }); 
       
        let users = []; // pages of data, 10 lines each
        
        let guildUsers = await GuildDapSchema.find({ guildId: interaction.guild.id }).sort({ userDap: -1 });
        for (let i = 0; i < guildUsers.length; i++) {
            const guildUser = guildUsers[i];
            users.push(`${i+1}. <@${guildUser.userId}>: ${guildUser.userDap}`);
        }
        pagination
        .setDescriptions(users)
        .setColor("Green")
        .setTitle("Leaderboard")
        .setTimestamp();
        pagination.render();
        // respond with the data
    
    }
}