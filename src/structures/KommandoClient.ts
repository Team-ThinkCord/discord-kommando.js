import { Client, Intents, Message, CommandInteraction, Collection, ClientOptions } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Command } from '.';

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
    
    constructor(options: IKommandoOptions, opts: ClientOptions = { intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS ]}) {
        super(opts);
        
        if (!has(options, 'directory')) throw new TypeError('Please provide the directory.');
        
        this.kommando = mergeDefault(KommandoOptions, options) as typeof KommandoOptions;
        this.commands = new Collection();
    }
    
    commandHandler(itr: CommandInteraction): void {
        
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