const fs = require('fs');

const Configure = function(dir, prefix, options) {
    var [ commands, requirements, messages, directory ] = [ [], [], {}, dir ];
    fs.readdirSync(dir).filter(f => f.endsWith(".js")).forEach(file => {
        var command = require(`../../../../${dir}/${file}`);
        commands.push({
            name: command.name,
            description: command.description,
            aliases: command.aliases,
            require: command.require,
            file
        });
        if (!options.disableMessages) console.log(options.messages.LOAD_MESSAGE ?? "Loaded command %s in %s", command.name, file);
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
    
    messages = {
        ERROR: options.messages.ERROR ?? "An error occurred",
        LOAD_MESSAGE: options.messages.LOAD_MESSAGE ?? "Loaded command %s in %s"
    }
    
    return {
        note: "※ Do not remove this file ※",
        prefix,
        directory,
        commands,
        requirements,
        messages
    }
}

module.exports = Configure;