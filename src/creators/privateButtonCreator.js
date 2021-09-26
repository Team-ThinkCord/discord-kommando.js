var Discord = require('discord.js');
var disbut = require('discord-buttons');

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
function createPrivateButton(userid, id, label, style, emoji, disabled = false, url) {
    var Discord = require('discord.js');
    var disbut = require('discord-buttons');
    
    var version = require('discord.js').version.split('');
    if (version.includes('(')) {
        version = version.join('').split('(').pop().split('');
    }
    version = parseInt(version[0] + version[1]);

    if (version != 12 | 13) throw new Error(`Unsupported version v${version}\nnpm i discord.js@12.5.3 \nnpm i discord.js@latest`);
    switch (version) {
        case 12:
            const button = new disbut.MessageButton()
                .setID(userid + "_" + id + "__KOMMANDO_PRIVATE")
                .setLabel(label)
                .setStyle(style)
                .setDisabled(disabled);
            button.style === "url" && button.setURL(url);
            emoji && button.setEmoji(emoji);
            return button;
            break;
        case 13:
            const button = new Discord.MessageButton()
                .setCustomId(userid + "_" + id + "__KOMMANDO_PRIVATE")
                .setLabel(label)
                .setStyle(style)
                .setDisabled(disabled);
            button.style === "LINK" && button.setURL(url);
            emoji && button.setEmoji(emoji);
            return button;
            break;
    }
}

module.exports = createPrivateButton;