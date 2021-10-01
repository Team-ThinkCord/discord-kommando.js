const fs = require('fs');
const Requirement = require('./Requirement.js');
const Command = require('./Command.js');
const Button = require('./Button.js');
const SelectMenu = require('./SelectMenu.js');
var version = require('../../../../node_modules/discord.js').version.split('');
if (version.includes('(')) {
  version = version.join('').split('(').pop().split('');
}
version = parseInt(version[0] + version[1]);

if (version != 12 && version != 13) throw new Error(`Unsupported version v${version}\nnpm i discord.js@12.5.3 \nnpm i discord.js@latest`);

const Configure = function(dir, prefix, options) {
    var [ commands, requirements, messages, directory, slash_commands, buttons, selectmenus ] = [ [], [], {}, dir, [], [], [] ];
    fs.readdirSync(dir).filter(f => f.endsWith(".js")).forEach(file => {
        var command = require(`../../../../${dir}/${file}`);
        if (!command instanceof Command) throw new TypeError("Command is not exported or not command object");
        commands.push({
            name: command.name,
            description: command.description,
            aliases: command.aliases,
            require: command.require,
            file
        });
        if (!options.disableMessages) console.log(options.messages.COMMAND_LOAD_MESSAGE ?? "Loaded command %s from %s", command.name, file);
    });
    
    if (fs.existsSync(`${dir}/requirements`)) {
        fs.readdirSync(`${dir}/requirements`).filter(f => f.endsWith(".js")).forEach(file => {
            var requirement = require(`../../../../${dir}/requirements/${file}`);
            if (!requirement instanceof Requirement) throw new TypeError("Requirement is not exported or not requirement object.");
            requirements.push({
                name: requirement.name,
                file
            });
            if (!options.disableMessages) console.log(options.messages.REQUIREMENT_LOAD_MESSAGE ?? "Loaded requirement %s from %s", requirement.name, file);
        });
    }
    
    if (fs.existsSync(`${dir}/selectmenus`)) {
        fs.readdirSync(`${dir}/selectmenus`).filter(f => f.endsWith(".js")).forEach(file => {
            var menu = require(`../../../../${dir}/selectmenus/${file}`);
            if (!menu instanceof SelectMenu) throw new TypeError("SelectMenu is not exported or not slash command object.");
            selectmenus.push({
                id: menu.id,
                file
            });
            if (!options.disableMessages) console.log(options.messages.SELECTMENU_LOAD_MESSAGE ?? "Loaded selectmenu %s from %s", menu.id, file);
        });
    }
    
    /**
    if (fs.existsSync(`${dir}/slash_commands`) && version == 13) {
        fs.readdirSync(`${dir}/slash_commands`).filter(f => f.endsWith(".js")).forEach(file => {
            var slcommand = require(`../../../../${dir}/slash_commands/${file}`);
            if (!slcommand instanceof SlashCommand) throw new TypeError("Button is not exported or not button object.");
            slash_commands.push({
                name: slcommand.name,
                file
            });
            if (!options.disableMessages) console.log(options.messages.SLASH_COMMAND_LOAD_MESSAGE ?? "Loaded slash command %s from %s", slcommand.name, file);
        });
    }
     */
    
    if (fs.existsSync(`${dir}/buttons`)) {
        fs.readdirSync(`${dir}/buttons`).filter(f => f.endsWith(".js")).forEach(file => {
            var btn = require(`../../../../${dir}/buttons/${file}`);
            if (!btn instanceof Button) throw new TypeError("Button is not exported or not slash command object.");
            buttons.push({
                id: btn.id,
                file
            });
            if (!options.disableMessages) console.log(options.messages.BUTTON_LOAD_MESSAGE ?? "Loaded button %s from %s", btn.id, file);
        });
    }
    
    messages = {
        ERROR: options.messages.ERROR ?? "An error occurred",
        COMMAND_LOAD_MESSAGE: options.messages.COMMAND_LOAD_MESSAGE ?? "Loaded command %s from %s",
        SLASH_COMMAND_LOAD_MESSAGE: options.messages.SLASH_COMMAND_LOAD_MESSAGE ?? "Loaded slash command %s from %s",
        REQUIREMENT_LOAD_MESSAGE: options.messages.REQUIREMRNT_LOAD_MESSAGE ?? "Loaded requirement %s from %s",
        BUTTON_LOAD_MESSAGE: options.messages.BUTTON_LOAD_MESSAGE ?? "Loaded button %s from %s",
        SELECTMENU_LOAD_MESSAGE: options.messages.SELECTMENU_LOAD_MESSAGE ?? "Loaded selectmenu %s from %s",
        PRIVATEBUTTON_CLICK: options.messages.PRIVATEBUTTON_CLICK
    }
    
    return {
        note: "※ Do not remove this file ※",
        prefix,
        directory,
        commands,
        slash_commands,
        buttons,
        selectmenus,
        requirements,
        messages
    }
}

module.exports = Configure;
