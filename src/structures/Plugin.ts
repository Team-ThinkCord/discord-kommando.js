import { Command, KommandoClient } from ".";
import { ClientEvents, Collection } from "discord.js";

export interface PluginConfig {
    /**
     * The name of the plugin.
     */
    name: string;

    /**
     * The description of the plugin.
     */
    description: string;

    /**
     * The author of the plugin.
     */
    authors: string[];

    /**
     * The version of the plugin.
     */
    version: string;
}

/**
 * A plugin to be loaded into the Kommando client.
 */
export class Plugin {
    /**
     * The name of the plugin.
     */
    public name: string;

    /**
     * The description of the plugin.
     */
    public description: string;

    /**
     * The author of the plugin.
     */
    public authors: string[];

    /**
     * The version of the plugin.
     */
    public version: string;

    /**
     * The commands will load into the plugin.
     */
    public commands: Collection<string, Command>;

    /**
     * The events will load into the plugin.
     */
    public listeners: {
        [key in keyof ClientEvents]?: (...args: any[]) => void[]
    };

    /**
     * Creates an instance of Plugin.
     * @param {PluginConfig} config The config of the plugin.
     * @memberof Plugin
     */
    public constructor(config: PluginConfig) {
        this.name = config.name;
        this.description = config.description;
        this.authors = config.authors;
        this.version = config.version;
        this.commands = new Collection<string, Command>();
        this.listeners = {};
    }

    /**
     * Registers a command.
     * @param {Command} command The command to register.
     * @memberof Plugin
     */
    public addCommand(command: Command): void {
        this.commands.set(command.name, command);
    }

    /**
     * Adds a listener to the plugin.
     * @param event The event to listen to.
     * @param listener The listener to add.
     */
    public on(event: keyof ClientEvents, listener: (...args: any[]) => void): void {
        // @ts-ignore
        this.listeners[event].push(listener);
    }

    /**
     * Emits an event.
     * @param event The event to emit.
     * @param args The arguments to pass to the event.
     */
    public emit(event: keyof ClientEvents, ...args: any[]): void {
        // @ts-ignore
        this.listeners[event].forEach(l => l(...args));
    }

    /**
     * Loads the plugin into the Kommando client.
     * @param {KommandoClient} client The Kommando client to load the plugin into.
     * @memberof Plugin
     */
    public register(client: KommandoClient) {
        for (const command of this.commands.values()) {
            if (!client.commands.get(command.name)) client.commands.set(command.name, command.register(client));
        }

        for (let event in this.listeners) {
            // @ts-ignore
            for (let listener of this.listeners[event]) {
                client.on(event, listener);
            }
        }

        console.log(`Registered ${this.name} v${this.version} by ${this.authors.join(", ")}`);

        return this;
    }
}