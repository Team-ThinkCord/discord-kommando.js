const fs = require('fs');
const Discord = require('discord.js');

const setupKommando = function(dir, prefix, options) {
    if (!options.disableMessages) console.log("Setting Kommando...");
    var directory = dir;
    if (dir.endsWith("/")) directory = dir.substring(0, dir.length - 1);
    if (!fs.existsSync(dir)) throw ReferenceError(`Directory ${dir} was not found`);
    var [ commands, requirements ] = [ [], [] ];
    fs.readdirSync(dir).filter(f => f.endsWith(".js")).forEach(file => {
        var command = require(`../../../../${dir}/${file}`);
        commands.push({
            name: command.name,
            description: command.description,
            aliases: command.aliases,
            require: command.require,
            file
        });
        if (!options.disableMessages) console.log(`Loaded command ${command.name} in ${dir}/${file}`)
    });
    
    if (fs.existsSync(`${dir}/requirements`)) {
        fs.readdirSync(`${dir}/requirements`).filter(f => f.endsWith(".js")).forEach(file => {
            var requirement = require(`../../../../${dir}/requirements/${file}`);
            requirements.push({
                name: requirement.name,
                file
            });
        });
    }
    var kommandoconfig = {
        prefix,
        directory,
        commands,
        requirements,
        note: "※ Do not remove this file ※"
    }
    fs.writeFileSync(`kommando_config.json`, JSON.stringify(kommandoconfig, null, 2));
}

module.exports = setupKommando;