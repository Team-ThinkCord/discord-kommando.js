const ErrorHandler = function(err, client) {
    const config = require('fs').readFileSync("kommando_config.json");
    Object.values(config.plugins).forEach(pl => {
        if (!pl instanceof Boolean) {
            var plugin = require(`../../../${pl}`);
            if (plugin.perms.find(perm => perm === "err")) plugin.emit("error", err, client);
        }
    });
}

module.exports = ErrorHandler;