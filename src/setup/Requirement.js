const Discord = require('discord.js');

class Requirement {
    // @param name {string} Name of requirement
    constructor(name) {
        if (typeof name != "string") throw new TypeError("Name is string. not " + typeof name + ".");
        this.name = name;
    }
    
    /**
     * @param logic {function} function(msg, args): boolean
     * @param callback {function} if (!logic) callback(msg, args)
     * @return {Requirement}
     */
    handle(logic, callback) {
        this.logic = logic;
        this.callback = callback;
        return this;
    }
    
    /**
     * @param msg {Discord.Message} msg object
     * @param args {string[]} args
     * @return {boolean}
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