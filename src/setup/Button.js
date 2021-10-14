class Button {
    // @param id {string} ID of button
    constructor(id) {
        if (typeof id != "string") throw new TypeError("ID is string. not " + typeof id + ".");
        this.id = id;
    }
    
    /**
     * @param callback {function} Button handler function<btn>
     * @return {Button} 
     */
    handle(callback) {
        this.callback = callback;
        return this;
    }
    
    // @param btn {object} A button object
    call(btn) {
        this.callback(btn);
        return this;
    }
}

module.exports = Button;