const pluginSetup = function(plugins, config) {
    const fs = require('fs');
    var return_var = {}
    if (!plugins.length) return true;
    if (!fs.existsSync("node_modules")) return false;
    plugins.forEach((pl) => {
        if (!fs.existsSync(`node_modules/${pl}`)) console.log(config.messages.PLUGIN_LOAD_ERR, pl);
        else {
            return_var[pl] = require('../../../../node_modules/' + pl);
            console.log(config.messages.PLUGIN_LOAD_MESSAGE, pl, return_var[pl].perms.join(", ") ?? "none");
        }
    });
    return return_var;
};

module.exports = pluginSetup;