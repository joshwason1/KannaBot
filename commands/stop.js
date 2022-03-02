const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops playing music'),
	async execute(interaction, queue) {
		await interaction.reply({content:'Music stopped', ephemeral:true});

		queue.delete(interaction.guildId);
        const connection = getVoiceConnection(interaction.guildId);
        connection.destroy();
	},
};

