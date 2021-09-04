const fs = require('fs');

const HandleRequirement = function(kommando, msg, args) {
    const config = JSON.parse(fs.readFileSync("kommando_config.json"));
    if (!kommando.require) return true;
    if (!kommando.require instanceof Array) return false;
    var [ i, index, req ] = [ 0, 0, [] ];
    kommando.require.forEach(requ => {
        config.requirements.forEach(r => {
            var requment = require(`../../../../${config.directory}/requirements/${r.file}`);
            if (requment.name === requ) req.push(requment.call(msg, args));
        });
    });
    if (req.indexOf(false) == -1) return true;
    else return false;
}

module.exports = HandleRequirement;