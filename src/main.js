var version = require('discord.js').version.split('');
if (version.includes('(')) {
  version = version.join('').split('(').pop().split('');
}
version = parseInt(version[0] + version[1]);

if (version != 12) throw new Error("BADV13BADV13BADV13BADV13BADV13 \nnpm i discord.js@12.5.3");

const setupKommando = require('./setup/setupKommando');
const Command = require('./setup/Command');
const CommandHandler = require('./handlers/CommandHandler');
const Requirement = require('./setup/Requirement.js');

module.exports = {
    setupKommando,
    Command,
    CommandHandler,
    Requirement
}