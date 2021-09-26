var Discord = require('../../../../node_modules/discord.js');

/**
 * @param userid {string} A Discord.JS Message
 * @param id {string} CustomID of button
 * @param label {string} Visible text of button
 * @param style {string} Style of button
 * @param [emoji] {string} Emoji of button
 * @param [disabled = false] {boolean} Disable button
 * @param [url] {string} URL of button
 * @return {disbut.MessageButton | Discord.MessageButton}
 */
const createPrivateButton = function(userid, id, label, style, emoji, disabled = false, url) {
    var Discord = require('../../../../node_modules/discord.js');
    
    var version = Discord.version.split('');
    if (version.includes('(')) {
        version = version.join('').split('(').pop().split('');
    }
    version = parseInt(version[0] + version[1]);
    
    if (version != 12 && version != 13) throw new Error(`Unsupported version v${version}\nnpm i discord.js@12.5.3 \nnpm i discord.js@latest`);
    switch (version) {
        case 12:
            var disbut = require('discord-buttons');
            var btn = new disbut.MessageButton()
                .setID(userid + "_" + id + "__KOMMANDO_PRIVATE")
                .setLabel(label)
                .setStyle(style)
                .setDisabled(disabled);
            btn.style === "url" && btn.setURL(url);
            emoji && btn.setEmoji(emoji);
            return btn;
            break;
        case 13:
            var btn = new Discord.MessageButton()
                .setCustomId(userid + "_" + id + "__KOMMANDO_PRIVATE")
                .setLabel(label)
                .setStyle(style)
                .setDisabled(disabled);
            btn.style === "LINK" && btn.setURL(url);
            emoji && btn.setEmoji(emoji);
            return btn;
            break;
    }
}

module.exports = createPrivateButton;