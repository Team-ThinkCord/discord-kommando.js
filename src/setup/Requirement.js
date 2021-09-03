class Requirement {
    constructor(name) {
        if (typeof name != "string") throw new TypeError("Name is string. not " + typeof name + ".");
        this.name = name;
    }
    
    handle(logic, callback) {
        this.logic = logic;
        this.callback = callback;
    }
    
    call(msg, args) {
        if (!this.logic(msg, args)) {
            this.callback(msg, args);
            return false;
        }
        return true;
    }
}

module.exports = Requirement;

/*
 * 머리를 써보자..
 * 머리머리머리머리
 * 민머리 대머리 맨들맨들 빡빡이
*/