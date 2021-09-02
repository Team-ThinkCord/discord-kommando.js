import Discord from "discord.js"

class setupCmd {
    
    commands = new Discord.Collection()

    command: string = null;
    description: string = null;
    alises: string[] = null;
    isAdmincmd: boolean  = null;
    
    constructor(options) {
        this.command = options.name;
        this.description = options.description;
        this.alises = options.alises;
        this.isAdmincmd = options.isAdmincmd;
        
        this.commands.set(this.command , this.alises)
    }

    public static handle() {
        // 커맨드
    }

}