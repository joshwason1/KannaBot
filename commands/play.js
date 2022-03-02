const { SlashCommandBuilder } = require('@discordjs/builders');
const { Message, VoiceChannel } = require('discord.js');
const { joinVoiceChannel, createAudioResource, AudioPlayerStatus, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const YTSearch = require('youtube-sr').default;
const ytdl = require('ytdl-core');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays songs from YouTube')
        .addStringOption(option => 
            option.setName('search')
            .setDescription('Enter a search term or a YouTube URL')
            .setRequired(true)),
	async execute(interaction, player, queue) {
        await interaction.deferReply({ephemeral:true});
        
        try {
            const voiceChannel = interaction.member.voice.channel;
            if (!voiceChannel)
                return interaction.followUp({content:'You need to be in a voice channel to play music', ephemeral:true});
            const permissions = voiceChannel.permissionsFor(interaction.client.user);
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                return interaction.followUp({content:'Lacking permissions to join and speak in voice channel', ephemeral:true});
            }

            let songInfo;
                       
            if(interaction.options.getString('search').startsWith('http')){
                try {
                    songInfo = await ytdl.getInfo(interaction.options.getString('search'))
                } catch {
                    return interaction.followUp({content:'Invalid URL', ephemeral:true});
                }
            } else {
                const result = await YTSearch.search(interaction.options.getString('search'), { limit: 1 })
                songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${result[0].id}`);
            }
            
            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };
            
            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            if (!queue.has(interaction.guildId)) {
                queue.set(interaction.guildId, {songs:[], channel:interaction.channel})
            }
            queue.get(interaction.guildId).songs.push(createAudioResource(ytdl(song.url),{
                metadata: {
                    title: song.title,
                }
            }));

            await interaction.followUp({content:`${song.title} has been added to the queue`, ephemeral:true});
            
            connection.subscribe(player);
            await entersState(connection,VoiceConnectionStatus.Ready);
            
            if (queue.get(interaction.guildId).songs.length == 1) {
                playQueue(queue, interaction, connection);
            }

        } catch (error) {
            console.error(error);
        }

        async function playQueue (queue, interaction, connection) {
            if (queue.get(interaction.guildId).songs.length > 0) {
                player.play(queue.get(interaction.guildId).songs[0]);
                queue.get(interaction.guildId).channel.send(`Now Playing: **${queue.get(interaction.guildId).songs[0].metadata.title}**`);
                player.once(AudioPlayerStatus.Idle, () => {
                    queue.get(interaction.guildId).songs.shift();
                    playQueue(queue, interaction, connection);
                });
            } else {
                interaction.channel.send('End of queue');
                connection.destroy();
            }
        }
    }   
};

