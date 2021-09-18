const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Displays an user\'s avatar')
        .addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
        
        if (user) {
            const embedOther = new MessageEmbed()
                .setColor('#FFFFFF')
                .setTitle(`${user.username}\'s Avatar:`)
                .setImage(user.displayAvatarURL({dynamic: true}) + '?size=1024');
            return interaction.reply({embeds: [embedOther]});
        } else {
            const embedSelf = new MessageEmbed()
                .setColor('#FFFFFF')
                .setTitle(`Your Avatar:`)
                .setImage(interaction.user.displayAvatarURL({dynamic: true}) +'?size=1024');
            return interaction.reply({embeds: [embedSelf]});
        };

       
	},
};