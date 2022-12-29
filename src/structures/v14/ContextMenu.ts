import { ContextMenuCommandBuilder, ContextMenuCommandInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js-14";
import { KommandoClient, Requirement } from ".";

export interface ContextMenuData {
    /**
     * The name of the context menu.
     */
    name: string;

    /**
     * The type of the context menu.
     */
    type: 'USER' | 'MESSAGE';

    /**
     * The requirements for the context menu.
     */
    requires?: string[];
}

export class ContextMenu {
    public name: string;

    public type: 'USER' | 'MESSAGE';

    public requires: Array<Requirement | undefined> = [];

    public toJSON: typeof ContextMenuCommandBuilder.prototype.toJSON;

    private callback: { USER: (itr: UserContextMenuCommandInteraction) => void, MESSAGE: (itr: MessageContextMenuCommandInteraction) => void };

    private data: ContextMenuCommandBuilder;

    private rawRequires: string[];

    public constructor(data: ContextMenuData) {
        this.name = data.name;
        this.type = data.type;
        this.callback = { USER: () => {}, MESSAGE: () => {} }
        this.data = new ContextMenuCommandBuilder()
            .setName(data.name)
            .setType(data.type == 'USER' ? 2 : 3);
        this.rawRequires = data.requires ?? [];

        this.toJSON = this.data.toJSON.bind(this.data);
    }

    public register(client: KommandoClient) {
        this.requires = this.rawRequires.map(requirement => client.requirements.get(requirement));

        this.requires.forEach((requirement, i) => { // Checks requirement is defined
            if (!requirement) throw new ReferenceError(`Requirement ${this.rawRequires[i]} not found in command ${this.name}`);
        });

        return this;
    }

    public handle(callback: (interaction: ContextMenuCommandInteraction) => void) {
        this.callback.USER = callback;

        return this;
    }

    async call(interaction: ContextMenuCommandInteraction) {
        if (!interaction.isMessageContextMenuCommand() && !interaction.isUserContextMenuCommand()) return this;

        if (this.requires.length) {
            let results: Array<boolean> = [];

            for (const requirement of this.requires) {
                if (results.includes(false)) break;
                results.push(await requirement!!.call(interaction));
            }

            if (results.includes(false)) return this;
        }

        if (interaction.isMessageContextMenuCommand()) this.callback.MESSAGE(interaction);
        else if (interaction.isUserContextMenuCommand()) this.callback.USER(interaction);
        
        return this;
    }
}