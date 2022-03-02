const axios = require('axios');
const cheerio = require('cheerio');

function freedom(client) {
    setInterval(async function () {
        let date = new Date();

        if (date > new Date('2021/10/30 00:00:00')) {
            return;
        }

        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();

        if (h === 12 && m === 0 && s === 0) {
            try {                       
                const response = await axios.get("https://covidlive.com.au/nsw");
                let $ = cheerio.load(response.data);
                client.channels.cache.get('885817675786387458').send(`**Days until 70% double dose vaccination:** Milestone reached!\n**Days until 80% double dose vaccination:** ${$(".info.DAYS-UNTIL-VACCINATION-SECOND .info-item.info-item-3.DAYS .touch").contents().get(0).nodeValue}\n**Days until foursome:** ${Math.floor(Math.abs(date - new Date('2021/10/16 13:00:00'))/86400000)} (TBC)`); 
            } catch(error) {
                console.log(error);
            };
        }
    }, 1000);
};

module.exports = {
    freedom
};


    

