const fs = require('fs');
const Discord = require('discord.js');
const Configure = require('./Configure.js');

const setupKommando = function(dir, prefix, options) {
    if (!options.disableMessages) console.log("Setting Kommando...");
    if (dir.endsWith("/")) directory = dir.substring(0, dir.length - 1);
    if (!fs.existsSync(dir)) throw ReferenceError(`Directory ${dir} was not found`);
    fs.writeFileSync(`kommando_config.json`, JSON.stringify(Configure(dir, prefix, options), null, 2));
}

module.exports = setupKommando;