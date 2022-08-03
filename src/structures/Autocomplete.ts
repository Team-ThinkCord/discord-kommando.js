import { AutocompleteInteraction } from "discord.js";
import { KommandoClient, Requirement } from ".";

export interface AutocompleteData {
    /**
     * The autocomplete option name.
     */
    name: string;

    /**
     * The command name.
     */
    commandName?: string;

    /**
     * The requirements for the autocomplete handler.
     */
    requires?: string[];
}

export class Autocomplete {
    /**
     * The name of the autocomplete option.
     */
    public name: string;

    /**
     * The name of the target command.
     */
    public commandName?: string;

    /**
     * The handler of the autocompelete option.
     */
    public callback: (interaction: AutocompleteInteraction) => void;

    /**
     * The requirement names before load.
     */
    private rawRequires: string[];

    /**
     * The requirements for the autocomplete handler.
     */
    public requires: Array<Requirement | undefined> = [];

    /**
     * Creates a new autocomplete option handler.
     * @param data The autocomplete data.
     */
    public constructor(data: AutocompleteData) {
        this.name = data.name;
        this.commandName = data.commandName;
        this.rawRequires = data.requires ?? [];
        this.callback = () => {}
    }

    /**
     * Register the button to the client.
     * @param client The client to register the button to.
     */
    public register(client: KommandoClient) {
        this.requires.push(...this.rawRequires.map(name => client.requirements.get(name)));

        return this;
    }

    /**
     * Set the callback to call when the option is focused.
     * @param handler The callback to call when the option is focused.
     */
    public handle(handler: (interaction: AutocompleteInteraction) => void) {
        this.callback = handler;
    }

    /**
     * Call the callback.
     * @param itr The interaction to call the callback with.
     */
    async call(itr: AutocompleteInteraction) {
        if (this.commandName && itr.commandName != this.commandName) return;

        if (this.requires.length) {
            let results: Array<boolean> = [];

            for (const requirement of this.requires) {
                results.push(await requirement!!.call(itr));
                if (results.includes(false)) continue;
            }

            if (results.includes(false)) return;
        }

        this.callback(itr);
        
        return this;
    }
}