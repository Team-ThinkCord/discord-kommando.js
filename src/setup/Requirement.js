const Discord = require('discord.js');

class Requirement {
    // @param {string} name Name of requirement
    constructor(name) {
        if (typeof name != "string") throw new TypeError("Name is string. not " + typeof name + ".");
        this.name = name;
    }
    
    /**
     * @param {function} logic a function returns boolean
     * @param {function} callback called at logic return false
     * @return {Requirement}
     */
    handle(logic, callback) {
        this.logic = logic;
        this.callback = callback;
        return this;
    }
    
    /**
     * @param {Discord.Message} msg Discord message object (or extended)
     * @param {string[]} args Command arguments
     * @return {boolean}
     * @private
     */
    call(msg, args) {
        if (!this.logic(msg, args)) {
            this.callback(msg, args);
            return false;
        }
        return true;
    }
}

module.exports = Requirement;