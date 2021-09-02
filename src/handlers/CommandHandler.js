const fs = require('fs');

class HandleCommand {
    constructor(message) {
        if (!fs.existsSync("kommando_config.json")) throw new ReferenceError("No config file found. Are you setted-up discord-kommando.js?");
        const config = JSON.parse(fs.readFileSync("kommando_config.json"));
        if (!message.content.startsWith(config.prefix)) return;
        var args = message.content.replace(config.prefix, "").split(" ");
        var command = args.shift();
        if (config.commands.indexOf(command) == -1) return;
        import kommando from `${config.directory}/${config.command[config.commands.indexOf(command)]}`;
        kommando.call(message, args);
    }
}