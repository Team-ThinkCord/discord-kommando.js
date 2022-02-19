class Command {
    /**
     * @param {object} options Options for command
     * @param {string} options.name Name of command
     * @param {string} options.description Description of command
     * @param {string[]} [options.aliases] Aliases for command
     * @param {string[]} [options.require] Requirements of command
     */
    constructor(options) {
        if (!options.name || !options.description) throw new TypeError("A commamd must provide a name and description");
        [ this.name, this.description, this.aliases, this.require ] = [ options.name, options.description, options.aliases ?? [], options.require ?? [] ];
    }
    
    /**
     * @param callback {function} function(msg, args)
     * @return {Command}
     */
    handle(callback) {
        this.callback = callback;
        return this;
    }
    
    /**
     * @param msg {object} Message Object
     * @param args {string[]} Message arguments
     * @private
     */
    call(msg, args) {
        this.callback(msg, args);
        return this;
    }
}

module.exports = Command;