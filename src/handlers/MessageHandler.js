const MessageHandler = function(msg) {
    const config = JSON.parse(require('fs').readFileSync("kommando_config.json"));
    const plugins = Object.values(config.plugins);
    plugins.forEach(plugin => {
        if (!plugin instanceof Boolean) {
            try {
            if (plugin.perms.find(perm => perm === "msg")) require(`../../../../node_modules/${plugin}`).emit("messageCreate", msg);
            } catch(err) {
            console.error(err);
            msg.channel.send(config.messages.ERROR);
            require('./ErrorHandler.js')(err, msg.client);
            }
        }
    });
}

module.exports = MessageHandler;