class SelectMenu {
    // @param {string} id SelectMenu ID
    constructor(id) {
        if (typeof id != "string") throw new TypeError("ID is string. not " + typeof id + ".");
        this.id = id;
    }
    
    /**
     * @param callback {function} SelectMenu handler function<menu>
     * @return {SelectMenu} 
     */
    handle(callback) {
        this.callback = callback;
        return this;
    }
    
    /**
     * @param menu {object} A selectmenu object
     * @return {SelectMenu}
     */
    call(menu) {
        this.callback(menu);
        return this;
    }
}

module.exports = SelectMenu;