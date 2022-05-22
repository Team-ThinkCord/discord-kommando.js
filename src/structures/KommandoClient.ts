import { Client, Intents, CommandInteraction, Collection, ClientOptions } from 'discord.js';
import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Command, Requirement } from '.';

let has = <T extends {}>(o: T, k: string) => Object.prototype.hasOwnProperty.call(o, k);

const KommandoOptions = {
    directory: '',
    messages: {
        ERROR: 'An error occurred.'
    },
    disableMessages: false,
    noAutoHandle: false
}

export interface IKommandoOptions {
    /* plugins?: string[], */
    directory: string,
    messages?: {
        ERROR?: string
    },
    disableMessages?: boolean,
    noAutoHandle?: boolean
}

export class KommandoClient extends Client {
    public kommando: typeof KommandoOptions;
    public commands: Collection<string, Command>;
    public requirements: Collection<string, Requirement>;
    public restManager: REST;
    
    constructor(options: IKommandoOptions, opts: ClientOptions = { intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS ]}) {
        super(mergeDefault({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS ]}, opts));
        
        if (!has(options, 'directory')) throw new TypeError('Please provide the directory.');
        
        this.kommando = mergeDefault(KommandoOptions, options) as typeof KommandoOptions;
        this.commands = new Collection();
        this.requirements = new Collection();
        this.restManager = new REST();

        let commandFiles = fs.readdirSync(this.kommando.directory);
        for (let file of commandFiles) {
            let command: Command = require(`../../../../${this.kommando.directory}/${file}`);
            this.commands.set(command.name, command.register(this));
        }

        if (fs.existsSync(`${this.kommando.directory}/requirements`)) {
            let requirementFiles = fs.readdirSync(`${this.kommando.directory}/requirements`);
            for (let file of commandFiles) {
                let requirement: Requirement = require(`../../../../${this.kommando.directory}/requirements/${file}`);
                this.requirements.set(requirement.name, requirement);
            }
        }

        this.once("ready", this.registerCommands);
    }

    async registerCommands() {
        let commands = this.commands.map(c => c.toJSON());
        
        this.restManager.put(
            Routes.applicationCommands(this.user!!.id),
            { body: commands }
        );
    }
    
    commandHandler(itr: CommandInteraction): void {
        
    }

    async login(token: string): Promise<string> {
        super.login(token);

        this.restManager.setToken(token);

        return token;
    }
}

function mergeDefault<T extends {}>(def: T, given: T): typeof def {
    if (!given) return def;
    
    for (const key in def) {
        if (!has(given, key) || given[key] === undefined) {
            given[key] = def[key];
        } else if (given[key] === Object(given[key])) {
            given[key] = mergeDefault(def[key], given[key]);
        }
    }
    
    return given;
}