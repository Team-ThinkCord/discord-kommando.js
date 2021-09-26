var version = require('discord.js').version.split('');
if (version.includes('(')) {
  version = version.join('').split('(').pop().split('');
}
version = parseInt(version[0] + version[1]);

if (version != 12 | 13) throw new Error(`Unsupported version v${version}\nnpm i discord.js@12.5.3 \nnpm i discord.js@latest`);

module.exports = {
    setupKommando: require('./setup/setupKommando'),
    Command: require('./setup/Command'),
    Requirement: require('./setup/Requirement'),
    Button: require('./Button'),
    ButtonHandler: require('./handlers/ButtonHandler'),
    CommandHandler: require('./handlers/CommandHandler'),
    createPrivateButton: require('./creators/privateButtonCreator')
}