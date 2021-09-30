const { createPrivateMenu, createPrivateMenuOption } = require('./creators/privateMenuCreator');
var version = require('../../../node_modules/discord.js').version.split('');
if (version.includes('(')) {
  version = version.join('').split('(').pop().split('');
}
version = parseInt(version[0] + version[1]);

if (version != 12 && version != 13) throw new Error(`Unsupported version v${version}\nnpm i discord.js@12.5.3 \nnpm i discord.js@latest`);

module.exports = {
    setupKommando: require('./setup/setupKommando'),
    Command: require('./setup/Command'),
    Requirement: require('./setup/Requirement'),
    Button: require('./setup/Button'),
    SelectMenu: require('./setup/SelectMenu'),
    ButtonHandler: require('./handlers/ButtonHandler'),
    SelectMenuHandler: require('./handlers/SelectMenuHandler'),
    CommandHandler: require('./handlers/CommandHandler'),
    createPrivateButton: require('./creators/privateButtonCreator'),
    createPrivateMenu,
    createPrivateMenuOption
}