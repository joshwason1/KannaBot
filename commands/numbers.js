const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { stringify } = require('querystring');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('numbers')
		.setDescription('Adds/Removes channel from number channel lookup list'),
	async execute(interaction) {
		let config = JSON.parse(fs.readFileSync('./config.json'));
		let numbers = config.numbers;
		if(numbers.includes(interaction.channelId)) {
			numbers.splice(numbers.indexOf(interaction.channelId), 1);
			config.numbers = numbers;
			fs.writeFileSync('./config.json', JSON.stringify(config));
			await interaction.reply('Channel Removed!');
		} else {
			numbers.push(interaction.channelId);
			config.numbers = numbers;
			fs.writeFileSync('./config.json', JSON.stringify(config));
			await interaction.reply('Channel Added!');
		}
	},	
};