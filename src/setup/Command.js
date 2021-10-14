class Command {
    /**
     * @param options {object} Options for command
     * @param options.name {string} Name of command
     * @param options.description {string} Description of command
     * @param [options.aliases] {...string} Aliases for command
     * @param [options.require] {...string} Requirements of command
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
    
    call(msg, args) {
        this.callback(msg, args);
        return this;
    }
}

module.exports = Command;