import { Client, IntentsBitField, Collection, ClientOptions, Interaction, mergeDefault, REST, CategoryChannel } from 'discord.js-14';
import { Util } from '.';
import fs from 'fs';
import { Routes } from 'discord-api-types/v10';
import { Command, Plugin, Requirement, Button, SelectMenu, Modal, Autocomplete, ContextMenu } from '.';

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
    noAutoHandle: false,
    disableCache: false,
    useOldCommandDirectory: false
}

export interface IKommandoOptions {
    /**
     * The directory to look for handlers
     *
     * % = directory
     *
     * %: The directory to look for commands in.
     *
     * %/commands: The new directory of commands
     *
     * %/requirements
     *
     * %/buttons
     *
     * %/selectmenus
     *
     * %/modals
     *
     * %/autocompletes
     *
     * %/contextmenus
     */
    directory: string;

    /**
     * The messages.
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
     * The test mode configurations.
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

    /**
     * Whether to disable caching. If you disable, your application will rate-limited
     */
    disableCache?: boolean;

    /**
     * @deprecated
     * Whether to use old directory of commands
     */
    useOldCommandDirectory?: boolean;
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
     * The client autocompeletes.
     */
    public autocompletes: Collection<string, Autocomplete>;

    /**
     * The client context menu commands.
     */
    public contextMenuCommands: Collection<string, ContextMenu>;

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
    constructor(options: IKommandoOptions, opts: ClientOptions = { intents: [ IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers ]}) {
        super(<ClientOptions>mergeDefault({ intents: [ IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers ]}, opts));
        
        if (!options || !has(options, 'directory')) throw new TypeError('Please provide the directory.');
        
        this.kommando = <typeof KommandoOptions>mergeDefault(KommandoOptions, options);
        this.commands = new Collection();
        this.requirements = new Collection();
        this.buttons = new Collection();
        this.selectMenus = new Collection();
        this.modals = new Collection();
        this.autocompletes = new Collection();
        this.contextMenuCommands = new Collection();

        this.plugins = [];

        this.kommando.plugins.forEach(plugin => {
            this.plugins.push((require(plugin.toLowerCase()) as Plugin).register(this));
        });

        this.restManager = new REST({ version: '10'});

        if (this.kommando.directory.endsWith('/')) this.kommando.directory = this.kommando.directory.slice(0, this.kommando.directory.length - 1);

        const commandsDirectory = this.kommando.useOldCommandDirectory ? `../../../../../${this.kommando.directory}/` : `../../../../../${this.kommando.directory}/commands/`;

        if (fs.existsSync(`${this.kommando.directory}/requirements`)) {
            let requirementFiles = fs.readdirSync(`${this.kommando.directory}/requirements`).filter(file => file.endsWith('.js'));
            for (let file of requirementFiles) {
                let requirement: Requirement | { default: Requirement } = require(`../../../../../${this.kommando.directory}/requirements/${file}`);

                if (requirement instanceof Requirement) 
                    this.requirements.set(requirement.name, requirement);
                else this.requirements.set(requirement.default.name, requirement.default);
            }
        }

        let commandFiles = fs.readdirSync(commandsDirectory.replaceAll('../', '')).filter(file => file.endsWith('.js'));
        for (let file of commandFiles) {
            let command: Command | { default: Command } = require(commandsDirectory + file);

            if (command instanceof Command)
                this.commands.set(command.name, command.register(this));
            else this.commands.set(command.default.name, command.default.register(this));
        }

        if (fs.existsSync(`${this.kommando.directory}/buttons`)) {
            let buttonFiiles = fs.readdirSync(`${this.kommando.directory}/buttons`).filter(file => file.endsWith('.js'));
            for (let file of buttonFiiles) {
                let button: Button | { default: Button } = require(`../../../../../${this.kommando.directory}/buttons/${file}`);

                if (button instanceof Button) 
                    this.buttons.set(button.id, button.register(this));
                else this.buttons.set(button.default.id, button.default.register(this));
            }
        }

        if (fs.existsSync(`${this.kommando.directory}/selectmenus`)) {
            let selectMenuFiles = fs.readdirSync(`${this.kommando.directory}/selectmenus`).filter(file => file.endsWith('.js'));
            for (let file of selectMenuFiles) {
                let selectMenu: SelectMenu | { default: SelectMenu} = require(`../../../../../${this.kommando.directory}/selectmenus/${file}`);

                if (selectMenu instanceof SelectMenu)
                    this.selectMenus.set(selectMenu.id, selectMenu.register(this));
                else this.selectMenus.set(selectMenu.default.id, selectMenu.default.register(this));
            }
        }

        if (fs.existsSync(`${this.kommando.directory}/modals`)) {
            let modalFiles = fs.readdirSync(`${this.kommando.directory}/modals`).filter(file => file.endsWith('.js'));
            for (let file of modalFiles) {
                let modal: Modal | { default: Modal } = require(`../../../../../${this.kommando.directory}/modals/${file}`);

                if (modal instanceof Modal)
                    this.modals.set(modal.id, modal.register(this));
                else this.modals.set(modal.default.id, modal.default.register(this));
            }
        }

        if (fs.existsSync(`${this.kommando.directory}/autocompletes`)) {
            let autocompleteFiles = fs.readdirSync(`${this.kommando.directory}/autocompletes`).filter(file => file.endsWith('.js'));
            for (let file of autocompleteFiles) {
                let autocomplete: Autocomplete | { default: Autocomplete } = require(`../../../../../${this.kommando.directory}/autocompletes/${file}`);

                if (autocomplete instanceof Autocomplete)
                    this.autocompletes.set(autocomplete.name, autocomplete.register(this));
                else this.autocompletes.set(autocomplete.default.name, autocomplete.default.register(this));
            }
        }

        if (fs.existsSync(`${this.kommando.directory}/contextmenus`)) {
            let contextMenuFiles = fs.readdirSync(`${this.kommando.directory}/contextmenus`).filter(file => file.endsWith('.js'));
            for (let file of contextMenuFiles) {
                let contextMenu: ContextMenu | { default: ContextMenu } = require(`../../../../../${this.kommando.directory}/contextmenus/${file}`);

                if (contextMenu instanceof ContextMenu) 
                    this.contextMenuCommands.set(contextMenu.name, contextMenu.register(this));
                else this.contextMenuCommands.set(contextMenu.default.name, contextMenu.default.register(this));
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
        let oldCache = await Util.getCache();
        let newCache = Util.clientToCachedJSON(this);

        if (!Util.arraysEqual(oldCache.commands, newCache.commands) || !Util.arraysEqual(oldCache.contextmenus, newCache.contextmenus)) {
            let commands: unknown[] = [];

            this.commands.forEach(c => commands.push(c.toJSON()));
            this.contextMenuCommands.forEach(c => commands.push(c.toJSON()));

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

            await Util.cacheClient(this);
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
        this.autocompleteHandler(itr);
        this.contextMenuHandler(itr);
    }

    /**
     * Handle the application command.
     *
     * @param itr The command.
     */
    public commandHandler(itr: Interaction) {
        if (!itr.isChatInputCommand()) return;

        if (!itr.channel?.isTextBased() || itr.channel instanceof CategoryChannel) return;

        try {
            let promise: Promise<undefined | Command> | undefined = this.commands.get(itr.commandName)?.call(itr);

            if (promise instanceof Promise) promise.catch(err => {
                if (!itr.channel?.isTextBased() || itr.channel instanceof CategoryChannel) return;

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

        if (!itr.channel?.isTextBased() || itr.channel instanceof CategoryChannel) return;

        try {
            
            let promise: Promise<undefined | Button> | undefined = this.buttons.find(btn => btn.customId == itr.customId)?.call(itr);

            if (promise instanceof Promise) promise.catch(err => {
                if (!itr.channel?.isTextBased() || itr.channel instanceof CategoryChannel) return;

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
        if (!itr.isStringSelectMenu()) return;

        if (!itr.channel?.isTextBased() || itr.channel instanceof CategoryChannel) return;

        try {
            let promise: Promise<undefined | SelectMenu> | undefined = this.selectMenus.find(menu => menu.id == itr.customId)?.call(itr);

            if (promise instanceof Promise) promise.catch(err => {
                if (!itr.channel?.isTextBased() || itr.channel instanceof CategoryChannel) return;

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

        if (!itr.channel?.isTextBased() || itr.channel instanceof CategoryChannel) return;

        try {
            let promise: Promise<undefined | Modal> | undefined = this.modals.find(modal => modal.id == itr.customId)?.call(itr);

            if (promise instanceof Promise) promise.catch(err => {
                if (!itr.channel?.isTextBased() || itr.channel instanceof CategoryChannel) return;

                console.error(err);
                this.kommando.disableMessages || itr.channel!!.send(this.kommando.messages.ERROR);
            });
        } catch (err) {
            console.error(err);
            this.kommando.disableMessages || itr.channel!!.send(this.kommando.messages.ERROR);
        }
    }

    public autocompleteHandler(itr: Interaction) {
        if (!itr.isAutocomplete()) return;

        if (!itr.channel?.isTextBased() || itr.channel instanceof CategoryChannel) return;

        try {
            this.autocompletes.map(autocomplete => autocomplete.call(itr).catch(err => {
                if (!itr.channel?.isTextBased() || itr.channel instanceof CategoryChannel) return;

                console.error(err);
                this.kommando.disableMessages || itr.channel!!.send(this.kommando.messages.ERROR);
            }));
        } catch (err) {
            console.error(err);
            this.kommando.disableMessages || itr.channel!!.send(this.kommando.messages.ERROR);
        }
    }

    public contextMenuHandler(itr: Interaction) {
        if (!itr.isContextMenuCommand()) return;

        if (!itr.channel?.isTextBased() || itr.channel instanceof CategoryChannel) return;

        try {
            let promise: Promise<undefined | ContextMenu> | undefined = this.contextMenuCommands.get(itr.commandName)?.call(itr);

            if (promise instanceof Promise) promise.catch(err => {
                if (!itr.channel?.isTextBased() || itr.channel instanceof CategoryChannel) return;
                
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