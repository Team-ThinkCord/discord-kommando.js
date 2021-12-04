// @param btn {object} Button object
const ButtonHandler = async (btn) => {
    var version = require('../../../../node_modules/discord.js').version.split('');
    if (version.includes('(')) {
        version = version.join('').split('(').pop().split('');
    }
    version = parseInt(version[0] + version[1]);
    if (version != 12 && version != 13) throw new Error(`Unsupported version v${version}\nnpm i discord.js@12.5.3 \nnpm i discord.js@latest`);
    const config = JSON.parse(require('fs').readFileSync("kommando_config.konf"));
    switch (version) {
        case 12:
            var buttonid = btn.id;
            if (!btn.clicker.user) return;
            if (!btn.id) throw new Error("Button listener is not discord-buttons");
            if (btn.id.endsWith("__KOMMANDO_PRIVATE")) {
                if (!btn.id.startsWith(btn.clicker.user.id)) return config.messages.PRIVATEBUTTON_CLICK && await btn.reply.send(config.messages.PRIVATEBUTTON_CLICK, true);
                buttonid = buttonid.replace("__KOMMANDO_PRIVATE", "").replace(btn.clicker.user.id + "_", "");
            }
            
            var command = config.buttons.find(but => but.id === buttonid);
            if (!command) return;
            try {
                btn.id = buttonid;
                require(`../../../../${config.directory}/buttons/${command.file}`).call(btn);
            } catch(err) {
                console.error(err);
                btn.message.channel.send(config.messages.ERROR);
                require('./ErrorHandler.js')(err, btn.client);
            }
            break;
        case 13:
            if (!btn.isButton()) return;
            var buttonid = btn.customId;
            if (!btn.user) return;
            if (!btn.customId) throw new Error("Button listener is not djs v13 internal interaction handler");
            if (btn.customId.endsWith("__KOMMANDO_PRIVATE")) {
                if (!btn.customId.startsWith(btn.user.id)) return config.messages.PRIVATEBUTTON_CLICK && await btn.reply({ content: config.messages.PRIVATEBUTTON_CLICK, ephemeral: true });
                buttonid = buttonid.replace("__KOMMANDO_PRIVATE", "").replace(btn.user.id + "_", "");
            }
            
            var command = config.buttons.find(but => but.id === buttonid);
            if (!command) return;
            try {
                btn.customId = buttonid;
                require(`../../../../${config.directory}/buttons/${command.file}`).call(btn);
            } catch(err) {
                console.error(err);
                btn.message.channel.send(config.messages.ERROR);
                require('./ErrorHandler.js')(err, btn.client);
            }
            break;
    }
}

module.exports = ButtonHandler;