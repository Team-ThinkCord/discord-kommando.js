const fs = require('fs');
const Discord = require('discord.js');

const setupKommando = function(dir, prefix, options) {
    if (!options.disableMessages) console.log("Setting Kommando...");
    var directory = dir;
    if (dir.endsWith("/")) directory = dir.substring(0, dir.length - 1);
    if (!fs.existsSync(dir)) throw ReferenceError(`Directory ${dir} was not found`);
    var commands = [];
    fs.readdirSync(dir).forEach(file => {
        var command = require(`../../../../${dir}/${file}`);
        if (!command) throw new ReferenceError("No command class found. use \"export command\"");
        commands.push({
            name: command.name,
            description: command.description,
            aliases: command.aliases,
            require: command.require,
            file
        });
        if (!options.disableMessages) console.log(`Loaded command ${command.name} in ${dir}/${file}`)
    });
    var kommandoconfig = {
        prefix,
        directory,
        commands,
        note: "※ Do not remove this file ※"
    }
    fs.writeFileSync(`kommando_config.json`, JSON.stringify(kommandoconfig, null, 2));
}

module.exports = setupKommando;