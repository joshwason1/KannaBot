// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { createAudioPlayer } = require('@discordjs/voice');
const { token } = require('./config.json');
const covidlive = require('./covidlive.js');
const music = require('./music.js');


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

const player = createAudioPlayer();

// When the client is ready, run this code (only once)
client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}.`);
    covidlive.freedom(c);
    
    client.user.setPresence({activities: [{name: 'VC and crying because of Nicole...', type: 'LISTENING'}]});

    music.initialise();
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try {
        await command.execute(interaction, player);
    
    } catch (error) {
        console.error(error);
        if (interaction.replied) {
            await interaction.followUp({content: 'There was an error while executing this command', ephemeral: true});
        }  else {
            await interaction.reply({content: 'There was an error while executing this command', ephemeral: true});
        }
    }

});  

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});

// Login to Discord with your client's token
client.login(token);