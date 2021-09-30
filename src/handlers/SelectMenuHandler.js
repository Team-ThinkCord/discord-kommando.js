const SelectMenuHandler = async (menu) => {
    var version = require('../../../../node_modules/discord.js').version.split('');
    if (version.includes('(')) {
        version = version.join('').split('(').pop().split('');
    }
    version = parseInt(version[0] + version[1]);
    if (version != 12 && version != 13) throw new Error(`Unsupported version v${version}\nnpm i discord.js@12.5.3 \nnpm i discord.js@latest`);
    const config = JSON.parse(require('fs').readFileSync("kommando_config.json"));
    switch (version) {
        case 12:
            var menuid = menu.id;
            if (!menu.clicker.user) return;
            if (menu.id.endsWith("__KOMMANDO_PRIVATE") || menu.values.find(value => value.endsWith("__KOMMANDO_PRIVATE"))) {
                if (!menu.id.startsWith(btn.clicker.user.id) || !menu.values.find(value => value.startsWith(menu.clicker.user.id))) return config.messages.PRIVATEBUTTON_CLICK && await menu.reply.send(config.messages.PRIVATEBUTTON_CLICK, true);
                menuid = menuid.replace("__KOMMANDO_PRIVATE", "").replace(menu.clicker.user.id + "_", "");
            }
            
            var command = config.selectmenus.find(me => me.id === menuid);
            if (!command) return;
            try {
                menu.id = menuid;
                i = 0;
                for (value of menu.values) {
                    menu.values[i] = value.replace("__KOMMANDO_PRIVATE", "").replace(menu.clicker.user.id + "_", "");
                }
                require(`../../../../${config.directory}/selectmenus/${command.file}`).call(menu);
            } catch(err) {
                console.error(err);
                menu.message.channel.send(config.messages.ERROR);
            }
            break;
        case 13:
            if (!menu.isSelectMenu()) return;
            var menuid = menu.customId;
            if (!menu.user) return;
            if (!menu.customId) throw new Error("SelectMenu listener is not djs v13 internal interaction handler");
            if (menu.customId.endsWith("__KOMMANDO_PRIVATE") || menu.values.find(value => value.endsWith("__KOMMANDO_PRIVATE"))) {
                if (!menu.customId.startsWith(menu.user.id) || !menu.values.find(value => value.startsWith(menu.user.id))) return config.messages.PRIVATEBUTTON_CLICK && await menu.reply.send(config.messages.PRIVATEBUTTON_CLICK, true);
                menuid = menuid.replace("__KOMMANDO_PRIVATE", "").replace(menu.user.id + "_", "");
            }
            
            var command = config.selectmenus.find(me => me.id === menuid);
            if (!command) return;
            try {
                menu.customId = menuid;
                i = 0;
                for (value of menu.values) {
                    menu.values[i] = value.replace("__KOMMANDO_PRIVATE", "").replace(menu.user.id + "_", "");
                }
                require(`../../../../${config.directory}/selectmenus/${command.file}`).call(menu);
            } catch(err) {
                console.error(err);
                menu.message.channel.send(config.messages.ERROR);
            }
            break;
    }
}

module.exports = SelectMenuHandler;