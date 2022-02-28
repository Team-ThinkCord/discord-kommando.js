const fs = require('fs');
const RequirementHandler = require('./requirementHandler.js');
const MessageHandler = require('./MessageHandler.js');

// @param {object} message Discord Message object (or extended)
const HandleCommand = async function(message) {
    if (!fs.existsSync("kommando_config.json")) throw new ReferenceError("No config file found. Are you sure you have set up discord-kommando?");
    if (message.author.bot) return;
    MessageHandler(message);
    const config = JSON.parse(fs.readFileSync("kommando_config.json"));
    if (!message.content.startsWith(config.prefix)) return;
    let args = message.content.replace(config.prefix, "").split(" ");
    let command = args.shift();
    var kommando = config.commands.find(kmdo => kmdo.name === command || (kmdo.aliases && kmdo.aliases.find(al => al == command)));
    if (!kommando) return;
    else kommando = require(`../../../../${config.directory}/${kommando.file}`);
    if (!RequirementHandler(kommando, message, args)) return;
    try {
        kommando.call(message, args);
    } catch(err) {
        console.error(err);
        if (!config.disableMessages) message.channel.send(config.messages.ERROR);
        require('./ErrorHandler.js')(err, message.client);
    }
}

module.exports = HandleCommand;