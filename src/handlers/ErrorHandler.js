const config = require('fs').readFileSync("kommando_config.json");

const ErrorHandler = function(err, client) {
    Object.values(config.plugins).forEach(pl => {
        var plugin = require(`../../../${pl}`);
        if (plugin.perms.find(perm => perm === "err")) plugin.emit("error", err, client);
    });
}

module.exports = ErrorHandler;