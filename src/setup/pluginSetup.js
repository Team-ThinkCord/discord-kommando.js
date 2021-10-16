const pluginSetup = function(plugins, config) {
    const fs = require('fs');
    var plugins_return = {
        check: true
    }
    var config_return = {}
    if (!plugins.length) return true;
    if (!fs.existsSync("node_modules")) return false;
    plugins.forEach((pl) => {
        var plugin = pl.toLowerCase();
        if (!fs.existsSync(`node_modules/${plugin}`)) console.log(config.messages.PLUGIN_LOAD_ERR, pl);
        else {
            plugins_return[plugin] = require('../../../../node_modules/' + plugin);
            plugins_return[plugin].name = plugin;
            config_return[plugin] = plugins_return[plugin].defaultConfig;
            console.log(config.messages.PLUGIN_LOAD_MESSAGE, plugin, plugins_return[plugin].perms.join(", ") ?? "none");
        }
    });
    return [ plugins_return, config_return ];
};

module.exports = pluginSetup;