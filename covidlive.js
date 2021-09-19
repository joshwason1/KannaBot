const axios = require('axios');
const cheerio = require('cheerio');

function freedom(client) {
    setInterval(async function () {
        let date = new Date();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();

        if (h === 12 && m === 0 && s === 0) {
            try {
                const response = await axios.get("https://covidlive.com.au/nsw");
                let $ = cheerio.load(response.data)
                client.channels.cache.get('885817675786387458').send(`Days until foursome: ${$(".info.DAYS-UNTIL-VACCINATION-SECOND .info-item.info-item-2.DAYS .touch").contents().get(0).nodeValue}`);
            } catch(error) {
                console.log(error);
            };
        }
    }, 1000);
};

module.exports = {
    freedom
};


    

