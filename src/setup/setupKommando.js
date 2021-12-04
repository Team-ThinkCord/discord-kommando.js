const fs = require('fs');
const Discord = require('discord.js');
const Configure = require('./Configure.js');

/**
 * This function will set-up the kommando
 * @param {string} dir Directory of commands and requirements or etc...
 * @param {string} prefix Prefix for commands
 * @param {object} [options] Options for kommando
 * @param {boolean} [options.disableBotFilter] Disable bot filter\
 * @param {boolean} [options.disableCommandFilter] Disable command filter
 * @param {boolean} [options.disableMessages] Disable the messages
 * @param {object} [options.messages] Set messages for kommando
 * @param {string} [options.messages.ERROR] Set error message
 * @param {string} [options.messages.COMMAND_LOAD_MESSAGE] Load message of message commands
 * @param {string} [options.messages.SLASH_COMMAND_LOAD_MESSAGE] Load message of slash command
 * @param {string} [options.messages.REQUIREMENT_LOAD_MESSAGE] Load message of requirement
 * @param {string} [options.messages.BUTTON_LOAD_MESSAGE] Load message of button
 * @param {string} [options.messages.SELECTMENU_LOAD_MESSAGE] Load message of selectmenu
 * @param {string} [options.messages.PLUGIN_LOAD_MESSAGE] Load message of plugin
 * @param {string} [options.messages.PRIVATEBUTTON_CLICK] This message will sended on user clicked private button
 * @param {string} [options.messages.PLUGIN_LOAD_ERR] This message will sended on failed to load plugin
 * @param {string[]} [options.plugins] Array of plugins based on discord-kommando.js-plugins
 */
function setupKommando(dir, prefix, options = { messages: {}, plugins: []}) {
    if (!options.disableMessages) console.log("Setting Kommando...");
    if (dir.endsWith("/")) directory = dir.substring(0, dir.length - 1);
    if (!fs.existsSync(dir)) throw ReferenceError(`Directory ${dir} was not found`);
    fs.writeFileSync(`kommando_config.konf`, JSON.stringify(Configure(dir, prefix, options), null, 2), {
        encoding: 'utf8'
    });
}

module.exports = setupKommando;