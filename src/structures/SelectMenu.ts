import { MessageSelectMenu, MessageSelectMenuOptions, SelectMenuInteraction } from "discord.js";
import { KommandoClient, Requirement } from ".";

export interface MenuData extends Omit<MessageSelectMenuOptions, 'customId'> {
    id: string;
    requires?: string[];
}

export class SelectMenu {
    /**
     * The identifier of the menu..
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
     * The builded menu.
     */
    private menu: MessageSelectMenu;

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
        this.menu = new MessageSelectMenu(data);
        this.callback = () => {};
        this.menu = new MessageSelectMenu({ ...data, customId: data.id });
    }

    /**
     * Register the button to the client.
     * @param client The client to register the button to.
     */
     public register(client: KommandoClient): SelectMenu {
        this.requires.push(...this.rawRequires.map(rawReq => client.requirements.get(rawReq)));

        return this;
    }

    /**
     * Get the button.
     */
    public getMenu(): MessageSelectMenu {
        return this.menu;
    }

    /**
     * Set the callback to call when the button is pressed.
     * @param callback The callback to call when the button is pressed.
     */
    public handle(callback: (button: SelectMenuInteraction) => void): SelectMenu {
        this.callback = callback;

        return this;
    }

    /**
     * Call the callback.
     * @param button The button that was pressed.
     */
    async call(menu: SelectMenuInteraction) {
        if (this.requires.length) {
            let results: Array<boolean> = [];

            for (const requirement of this.requires) {
                results.push(await requirement!!.call(menu));
                if (results.includes(false)) continue;
            }

            if (results.includes(false)) return;
        }

        this.callback(menu);
        
        return this;
    }
}