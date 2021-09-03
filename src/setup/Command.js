class Command {
    constructor(options) {
        if (!options.name || !options.description) throw new TypeError("Required value is not defined");
        [ this.name, this.description, this.aliases, this.require ] = [ options.name, options.description, options.aliases ?? [], options.require ?? [] ];
    }
    
    handle(callback) {
        this.callback = callback;
    }
    
    call(msg, args) {
        this.callback(msg, args);
    }
}

module.exports = Command;