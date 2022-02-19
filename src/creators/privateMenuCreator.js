/**
 * @param userid {string} User identifier
 * @param id {string} Menu identifier
 * @return {Discord.MessageSelectMenu | disbut.MessageMenu}
 */
const createPrivateMenu = function(userid, id) {
    var version = require('../../../../node_modules/discord.js').version.split('');
    if (version.includes('(')) {
        version = version.join('').split('(').pop().split('');
    }
    version = parseInt(version[0] + version[1]);
    if (version != 12 && version != 13) throw new Error(`Unsupported version v${version}\nnpm i discord.js@12.5.3 \nnpm i discord.js@latest`);
    const config = JSON.parse(require('fs').readFileSync("kommando_config.json"));
    
    switch (version) {
        case 12:
            const disbut = require('discord-buttons');
            return new disbut.MessageMenu().setID(`${userid}_${id}__KOMMANDO_PRIVATE`);
            break;
        case 13:
            const Discord = require('../../../../node_modules/discord.js');
            return new Discord.MessageSelectMenu().setCustomId(`${userid}_${id}__KOMMANDO_PRIVATE`);
            break;
    }
}

/**
 * @param userid {string} User identifier
 * @param value {string} Value of option
 * @return {object}
 */
const createPrivateMenuOption = function(userid, value) {
    return {
        value: `${userid}_${id}__KOMMANDO_PRIVATE`
    }
}

module.exports = {
    createPrivateMenu,
    createPrivateMenuOption
}