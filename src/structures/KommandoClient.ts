import { Client, Intents, Collection, ClientOptions, Interaction } from 'discord.js';
import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Command, Plugin, Requirement } from '.';

let has = <T extends {}>(o: T, k: string) => Object.prototype.hasOwnProperty.call(o, k);

const KommandoOptions = {
    directory: '',
    messages: {
        ERROR: 'An error occurred.'
    },
    plugins: [] as string[],
    pluginConfigs: {},
    disableMessages: false,
    noAutoHandle: false
}

export interface IKommandoOptions {
    /**
     * The directory to look for handlers in.
     *
     * % = directory
     * %: The directory to look for commands in.
     * %/requirements: The directory to look for requirements in.
     */
    directory: string;

    /**
     * The messages
     */
    messages?: {
        /**
         * The error message.
         */
        ERROR?: string
    };

    /**
     * The plugins to load.
     */
    plugins?: string[];

    /**
     * The plugin configurations.
     */
    pluginConfigs?: {
        /**
         * Config by plugin name.
         */
        [pluginName: string]: any
    };

    /**
     * Whether to disable the messages.
     */
    disableMessages?: boolean;

    /**
     * Whether to disable the auto-handling of commands.
     */
    noAutoHandle?: boolean;
}

export class KommandoClient extends Client {
    /**
     * The kommando options containing directory.
     */
    public kommando: typeof KommandoOptions;

    /**
     * The client commands.
     */
    public commands: Collection<string, Command>;

    /**
     * The client requirements.
     */
    public requirements: Collection<string, Requirement>;

    /**
     * The client plugins.
     */
    public plugins: Plugin[];

    /**
     * The client rest api manager.
     */
    public restManager: REST;

    /**
     * Create new kommando client instance.
     * @param options The kommando options.
     * @param opts The client options.
     */
    constructor(options: IKommandoOptions, opts: ClientOptions = { intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS ]}) {
        super(mergeDefault({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS ]}, opts));
        
        if (!options || !has(options, 'directory')) throw new TypeError('Please provide the directory.');
        
        this.kommando = mergeDefault(KommandoOptions, options);
        this.commands = new Collection();
        this.requirements = new Collection();

        this.plugins = [];

        this.kommando.plugins.forEach(plugin => {
            this.plugins.push((require(plugin.toLowerCase()) as Plugin).register(this));
        });

        this.restManager = new REST();

        if (fs.existsSync(`${this.kommando.directory}/requirements`)) {
            let requirementFiles = fs.readdirSync(`${this.kommando.directory}/requirements`).filter(file => file.endsWith('.js'));
            for (let file of requirementFiles) {
                let requirement: Requirement = require(`../../../../${this.kommando.directory}/requirements/${file}`);
                this.requirements.set(requirement.name, requirement);

                console.log(this.requirements)
            }
        }

        let commandFiles = fs.readdirSync(this.kommando.directory).filter(file => file.endsWith('.js'));
        for (let file of commandFiles) {
            let command: Command = require(`../../../../${this.kommando.directory}/${file}`);
            this.commands.set(command.name, command.register(this));
        }

        this.once("ready", this.registerCommands);

        if (!this.kommando.noAutoHandle) {
            this.on("interactionCreate", this.commandHandler);
        }
    }

    /**
     * Register the commands.
     */
    async registerCommands() {
        let commands: any[] = [];
        this.commands.map(c => commands.push(c.toJSON()));
        
        await this.restManager.put(
            Routes.applicationCommands(this.user!!.id),
            { body: commands }
        );
    }

    /**
     * Handle the application command.
     *
     * @param itr The command.
     */
    commandHandler(itr: Interaction): void {
        if (!itr.isCommand()) return;

        try {
            let promise: Promise<undefined | Command> | undefined = this.commands.get(itr.commandName)?.call(itr);

            if (promise instanceof Promise) promise.catch(err => {
                console.error(err);
                this.kommando.disableMessages || itr.channel!!.send(this.kommando.messages.ERROR);
            });
        } catch (err) {
            console.error(err);
            this.kommando.disableMessages || itr.channel!!.send(this.kommando.messages.ERROR);
        }
    }

    /**
     * Login to bot.
     *
     * @param token The token to login.
     */
    async login(token: string): Promise<string> {
        this.restManager.setToken(token);

        return await super.login(token);
    }
}

function mergeDefault<T extends {}>(def: T, given: { [key: string]: any }): typeof def {
    if (!given) return def;
    
    for (const key in def) {
        if (!has(given, key) || given[key] === undefined) {
            given[key] = def[key];
        } else if (given[key] === Object(given[key])) {
            given[key] = mergeDefault(def[key], given[key]);
        }
    }
    
    return given as typeof def;
}