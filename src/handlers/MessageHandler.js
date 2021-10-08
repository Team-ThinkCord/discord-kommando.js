const MessageHandler = function(msg) {
    const config = JSON.parse(require('fs').readFileSync("kommando_config.json"));
    const plugins = config.plugins;
    plugins.forEach(plugin => {
        if (plugin.perms.find(perm => perm === "msg")) require(`../../../../node_modules/${plugin}`).emit("messageCreate", msg);
    });
}

module.exports = MessageHandler;