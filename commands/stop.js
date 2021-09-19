const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops playing music'),
	async execute(interaction) {
		await interaction.reply({content:'Music stopped', ephemeral:true});

        const connection = getVoiceConnection(interaction.guildId);
        connection.destroy();
	},
};

