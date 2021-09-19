const { SlashCommandBuilder } = require('@discordjs/builders');
const { Message, VoiceChannel } = require('discord.js');
const fs = require('fs');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, NoSubscriberBehavior, StreamType, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
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
	async execute(interaction, player) {
        await interaction.deferReply({ephemeral:true});
        
        //const serverQueue = fs.readFileSync(JSON.parse('../queue.json'));

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
            
            

            const resource = createAudioResource(ytdl(song.url), {
                inputType: StreamType.Arbitrary,
            });

            
            connection.subscribe(player);
            await entersState(connection,VoiceConnectionStatus.Ready);
            player.play(resource);
                    

            await interaction.followUp({content:`Now Playing: **${song.title}**`, ephemeral:true});
        } catch (error) {
            console.error(error);
        }
        
    }

        
};
