const fs = require('fs');
const RequirementHandler = require('./requirementHandler.js');
const MessageHandler = require('./MessageHandler.js');

const HandleCommand = async function(message) {
    if (!fs.existsSync("kommando_config.json")) throw new ReferenceError("No config file found. Are you sure you have set up discord-kommando?");
    if (message.author.bot) return;
    MessageHandler(message);
    const config = JSON.parse(fs.readFileSync("kommando_config.json"));
    if (!message.content.startsWith(config.prefix)) return;
    var args = message.content.replace(config.prefix, "").split(" ");
    var command = args.shift();
    var hasKommando = false;
    var index = 0;
    var i = 0;
    config.commands.forEach(kmdo => {
        if (kmdo.name === command) {
            hasKommando = true;
            index = i;
        } else if (kmdo.aliases) {
            if (kmdo.aliases.indexOf(command) != -1) {
                hasKommando = true;
                index = i;
            }
        }
        i++;
    });
    if (!hasKommando) return;
    var kommando = require(`../../../../${config.directory}/${config.commands[index].file}`);
    if (!RequirementHandler(kommando, message, args)) return;
    try {
        kommando.call(message, args);
    } catch(err) {
        console.error(err);
        message.channel.send(config.messages.ERROR);
        require('./ErrorHandler.js')(err, message.client);
    }
}

module.exports = HandleCommand;