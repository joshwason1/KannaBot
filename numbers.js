const axios = require('axios');
const cheerio = require('cheerio');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require('fs');

function lookup(client) {
    client.on('messageCreate', async message => {
        let config = JSON.parse(fs.readFileSync('./config.json'));
		let numbers = config.numbers;
        if (numbers.includes(message.channelId)) {
            if(Number.isInteger(Number(message.content)) && Number(message.content) > 0) {
                const code = Number(message.content);
                try {
                    const response = await axios.get(`https://nhentai.net/g/${code}/`);
                    let $ = cheerio.load(response.data);
                    $('.title .pretty').text()
                    const cover = new MessageAttachment(`${$('#cover.lazyload').attr('data-src')}`, 'cover.png');
                    let tags = [];
                    let artists = [];
                    
                    $('#tags div:nth-child(3) .tags .name').each(function (i,el) {
                        tags.push($(this).text());
                    });
                    
                    $('#tags div:nth-child(4) .tags .name').each(function (i,el) {
                        artists.push($(this).text());
                    });

                    let pages = $('#tags div:nth-child(8) .tags .name').text();

                    const embed = new MessageEmbed()
                        .setTitle(`${$('.title .pretty').text()}`)
                        .setURL(`https://nhentai.net/g/${code}/`)
                        .setImage(`${$('#cover .lazyload').attr('data-src')}`)
                        .addFields(
                            { name: 'Tags', value: tags.join(', ')},
                            { name: 'Artist', value: artists.join(', ')},
                            { name: 'Pages', value: pages}
                        );
                    message.channel.send({ embeds: [embed]});
                                    
                } catch (error) {
                    console.log(error)
                }
                
            }
        } else {
            return;
        }
    });
}
module.exports = {
    lookup
};


    

