const setupKommando = require('./setup/setupKommando');
const Command = require('./setup/Command');
const CommandHandler = require('./handlers/CommandHandler');
const Requirement = require('./setup/Requirement.js');

module.exports = {
    setupKommando,
    Command,
    CommandHandler
}