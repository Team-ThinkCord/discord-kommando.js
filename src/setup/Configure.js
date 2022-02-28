const fs = require('fs');
const Requirement = require('./Requirement.js');
const Command = require('./Command.js');
const Button = require('./Button.js');
const SelectMenu = require('./SelectMenu.js');
const pluginSetup = require('./pluginSetup.js');
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
var version = require('../../../../node_modules/discord.js').version.split('');
if (version.includes('(')) {
  version = version.join('').split('(').pop().split('');
}
version = parseInt(version[0] + version[1]);

if (version != 12 && version != 13) throw new Error(`Unsupported version v${version}\nnpm i discord.js@12.5.3 \nnpm i discord.js@latest`);

const Configure = function(dir, prefix, options) {
    var [ commands, requirements, messages, directory, slash_commands, buttons, selectmenus, plugins, pluginConfig ] = [ [], [], {}, dir, [], [], [], {} ];
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
            if (!menu instanceof SelectMenu) throw new TypeError("SelectMenu is not exported or not selectmenu object.");
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
            if (!slcommand instanceof SlashCommand) throw new TypeError("Button is not exported or not slash command object.");
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
            if (!btn instanceof Button) throw new TypeError("Button is not exported or not button object.");
            buttons.push({
                id: btn.id,
                file
            });
            if (!options.disableMessages) console.log(options.messages.BUTTON_LOAD_MESSAGE ?? "Loaded button %s from %s", btn.id, file);
        });
    }
    
    messages = {
        ERROR: "An error occurred",
        COMMAND_LOAD_MESSAGE: "Loaded command %s from %s",
        SLASH_COMMAND_LOAD_MESSAGE: "Loaded slash command %s from %s",
        REQUIREMENT_LOAD_MESSAGE: "Loaded requirement %s from %s",
        BUTTON_LOAD_MESSAGE: "Loaded button %s from %s",
        SELECTMENU_LOAD_MESSAGE: "Loaded selectmenu %s from %s",
        PLUGIN_LOAD_MESSAGE: "Loaded plugin %s (perms: %s)",
        PRIVATEBUTTON_CLICK: undefined,
        PRIVATEMENU_CLICK: undefined,
        PLUGIN_LOAD_ERR: "Unable to load plugin %s"
    }
    
    messages = mergeDefault(messages, options.messages);
    
    if (options.plugins) {
        pls = pluginSetup(options.plugins, { messages });
        if (!pls[0]) console.log("discord-kommando.js having any problem on loading plugins. Check your project folder!");
        else plugins = pls[0];
        if (plugins?.check) pluginConfig = pls[1];
        pluginConfig = mergeDefault(pluginConfig, options.pluginConfig ?? {});
        if (plugins?.check) delete plugins.check;
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
        messages,
        plugins,
        pluginConfig
    }
}

module.exports = Configure;

function mergeDefault(def, given) {
    if (!given) return def;
    for (const key in def) {
        if (!has(given, key) || given[key] === undefined) {
            given[key] = def[key];
        } else if (given[key] === Object(given[key])) {
            given[key] = mergeDefault(def[key], given[key]);
        }
    }
    return given;
}