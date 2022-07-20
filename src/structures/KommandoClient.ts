import { Client, Intents, Collection, ClientOptions, Interaction, Util } from 'discord.js';
import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Command, Plugin, Requirement, Button, SelectMenu, Modal } from '.';

let has = <T extends {}>(o: T, k: string) => Object.prototype.hasOwnProperty.call(o, k);

const KommandoOptions = {
    directory: '',
    messages: {
        ERROR: 'An error occurred.'
    },
    plugins: [] as string[],
    pluginConfigs: {} as { [pluginName: string]: any},
    test: {
        enable: false,
        guild: null as string | null,
    },
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
     * The test mod configurations.
     */
    test?: {
        /**
         * true for enable test mode.
         */
        enable: boolean,

        /**
         * The test guild id.
         */
        guild: null | string
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
     * The client buttons.
     */
    public buttons: Collection<string, Button>;

    /**
     * The client select menus.
     */
    public selectMenus: Collection<string, SelectMenu>;

    /**
     * The client modals.
     */
    public modals: Collection<string, Modal>;

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
        super(<ClientOptions>Util.mergeDefault({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS ]}, opts));
        
        if (!options || !has(options, 'directory')) throw new TypeError('Please provide the directory.');
        
        this.kommando = <typeof KommandoOptions>Util.mergeDefault(KommandoOptions, options);
        this.commands = new Collection();
        this.requirements = new Collection();
        this.buttons = new Collection();
        this.selectMenus = new Collection();
        this.modals = new Collection();

        this.plugins = [];

        this.kommando.plugins.forEach(plugin => {
            this.plugins.push((require(plugin.toLowerCase()) as Plugin).register(this));
        });

        this.restManager = new REST({ version: '9'});

        if (this.kommando.directory.endsWith('/')) this.kommando.directory = this.kommando.directory.slice(0, this.kommando.directory.length - 1);

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

        if (fs.existsSync(`${this.kommando.directory}/buttons`)) {
            let buttonFiiles = fs.readdirSync(`${this.kommando.directory}/buttons`).filter(file => file.endsWith('.js'));
            for (let file of buttonFiiles) {
                let button: Button = require(`../../../../${this.kommando.directory}/buttons/${file}`);

                this.buttons.set(button.id, button.register(this));
            }
        }

        this.once("ready", this.registerCommands);

        if (!this.kommando.noAutoHandle) {
            this.on("interactionCreate", this.automaticHandler);
        }
    }

    /**
     * Register the commands.
     */
    async registerCommands() {
        let commands: any[] = [];
        this.commands.map(c => commands.push(c.toJSON()));

        if (this.kommando.test.enable) {
            if (this.kommando.test.guild == null) throw new TypeError("[options.test.guild] Expected string. but got null instead.");

            await this.restManager.put(
                Routes.applicationGuildCommands(this.user!!.id, this.kommando.test.guild),
                { body: commands }
            );
        } else {
            await this.restManager.put(
                Routes.applicationCommands(this.user!!.id),
                { body: commands }
            );
        }

        return;
    }

    /**
     * Handle any interaction created.
     * 
     * @param itr The interaction.
     */
    async automaticHandler(itr: Interaction) {
        this.commandHandler(itr);
        this.buttonHandler(itr);
        this.selectMenuHandler(itr);
        this.modalHandler(itr);
    }

    /**
     * Handle the application command.
     *
     * @param itr The command.
     */
    public commandHandler(itr: Interaction) {
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
     * Handle the button.
     * 
     * @param itr The button.
     */
    public buttonHandler(itr: Interaction) {
        if (!itr.isButton()) return;

        try {
            let promise: Promise<undefined | Button> | undefined = this.buttons.find(btn => btn.customId == itr.customId)?.call(itr);

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
     * Handle the select menu.
     * 
     * @param itr The select menu.
     */
    public selectMenuHandler(itr: Interaction) {
        if (!itr.isSelectMenu()) return;

        try {
            let promise: Promise<undefined | SelectMenu> | undefined = this.selectMenus.find(menu => menu.id == itr.customId)?.call(itr);

            if (promise instanceof Promise) promise.catch(err => {
                console.error(err);
                this.kommando.disableMessages || itr.channel!!.send(this.kommando.messages.ERROR);
            });
        } catch (err) {
            console.error(err);
            this.kommando.disableMessages || itr.channel!!.send(this.kommando.messages.ERROR);
        }
    }

    public modalHandler(itr: Interaction) {
        if (!itr.isModalSubmit()) return;

        try {
            let promise: Promise<undefined | Modal> | undefined = this.modals.find(modal => modal.id == itr.customId)?.call(itr);

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