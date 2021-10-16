const ErrorHandler = function(err, client) {
    const config = JSON.parse(require('fs').readFileSync("kommando_config.json"));
    Object.values(config.plugins).forEach(pl => {
        var plugin = require(`../../../${pl.name}`);
        if (plugin.perms.find(perm => perm === "err")) plugin.emit("error", err, client);
    });
}

module.exports = ErrorHandler;