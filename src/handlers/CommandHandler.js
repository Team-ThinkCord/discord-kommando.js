const fs = require('fs');

const HandleCommand = function(message) {
    if (!fs.existsSync("kommando_config.json")) throw new ReferenceError("No config file found. Are you setted-up discord-kommando.js?");
    const config = JSON.parse(fs.readFileSync("kommando_config.json"));
    if (!message.content.startsWith(config.prefix)) return;
    var args = message.content.replace(config.prefix, "").split(" ");
    var command = args.shift();
    var hasKommando = false;
    config.commands.forEach(kmdo => {
        if (kmdo.name === command) hasKommando = true;
    });
    if (!hasKommando) return;
    var kommando = require(`${config.directory}/${config.command[config.commands.indexOf(command)]}`);
    kommando.call(message, args);
}

module.exports = HandleCommand;