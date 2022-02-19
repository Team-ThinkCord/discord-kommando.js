class Button {
    // @param {string} id Button identifier for handle
    constructor(id) {
        if (typeof id != "string") throw new TypeError("ID is string. not " + typeof id + ".");
        this.id = id;
    }
    
    /**
     * @param {function} callback Button handler function
     * @return {Button} 
     */
    handle(callback) {
        this.callback = callback;
        return this;
    }
    
    /**
     * @param {object} btn A button object
     * @return {Button}
     * @private
     */
    call(btn) {
        this.callback(btn);
        return this;
    }
}

module.exports = Button;