const fs = require('fs');

module.exports = {
    initialise: function () {
        const queue = new Map();
        fs.writeFileSync('queue.json', JSON.stringify([queue]));
        
    }
};


