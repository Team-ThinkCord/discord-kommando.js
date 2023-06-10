import { StringSelectMenuBuilder, StringSelectMenuComponentData, StringSelectMenuInteraction as SelectMenuInteraction } from "discord.js-14";
import { KommandoClient, Requirement } from ".";

export interface MenuData extends Omit<Omit<StringSelectMenuComponentData, 'customId'>, 'type'> {
    id: string;
    requires?: string[];
}

export class SelectMenu {
    /**
     * The identifier of the menu.
     */
    public id: string;

    /**
     * The raw requirements before load.
     */
    private rawRequires: string[];

    /**
     * The requirements of the menu.
     */
    public requires: Array<Requirement | undefined>;

    /**
     * The built menu.
     */
    private menu: StringSelectMenuBuilder;

    /**
     * The callback to call when the menu is selected.
     */
    private callback: (menu: SelectMenuInteraction) => void;

    /**
     * Create a new menu handler.
     * @param data The data to create the menu with.
     */
    public constructor(data: MenuData) {
        this.id = data.id;
        this.rawRequires = data.requires ?? [];
        this.requires = [];
        this.callback = () => {};
        this.menu = new StringSelectMenuBuilder({ ...data, customId: data.id });
    }

    /**
     * Register the menu to the client.
     * @param client The client to register the menu to.
     */
     public register(client: KommandoClient): SelectMenu {
        this.requires.push(...this.rawRequires.map(rawReq => client.requirements.get(rawReq)));

        return this;
    }

    /**
     * Get the menu.
     */
    public getMenu(): StringSelectMenuBuilder {
        return new StringSelectMenuBuilder(this.menu.toJSON());
    }

    /**
     * Set the callback to call when the menu is selected.
     * @param callback The callback to call when the menu is selected.
     */
    public handle(callback: (menu: SelectMenuInteraction) => void): SelectMenu {
        this.callback = callback;

        return this;
    }

    /**
     * Call the callback.
     * @param menu The menu that was selected.
     */
    async call(menu: SelectMenuInteraction) {
        if (this.requires.length) {
            let results: Array<boolean> = [];

            for (const requirement of this.requires) {
                if (results.includes(false)) break;
                results.push(await requirement!!.call(menu));
            }

            if (results.includes(false)) return;
        }

        this.callback(menu);
        
        return this;
    }
}