import { ButtonInteraction, ButtonBuilder, ButtonComponent, ButtonStyle, ButtonComponentData, ComponentBuilder } from "discord.js-14";
import { KommandoClient, Requirement, Util } from ".";

export type ButtonData = Omit<ButtonComponentData, 'customId'> & { id: string, requires?: string[] };

export class Button {
    /**
     * The identifier of the button to get from the client.
     */
    public id: string;

    /**
     * The identifier of button interaction.
     */
    public customId?: string;

    /**
     * The requirements of the button.
     */
    public requires: Array<Requirement | undefined>;

    /**
     * The raw requirements before load.
     */
    private rawRequires: string[];

    /**
     * The builded button.
     */
    private button: ButtonBuilder;

    /**
     * The callback to call when the button is pressed.
     */
    private callback: (button: ButtonInteraction) => void;

    /**
     * Create a new button handler.
     * @param data The data to create the button with.
     */
    public constructor(data: ButtonData) {
        this.id = data.id; 
        this.customId = (data.style != ButtonStyle.Link) ? data.id : undefined;
        this.requires = [];
        this.rawRequires = data.requires ?? [];
        this.button = new ButtonBuilder(Util.isInteractionButtonOptions(data) ? { customId: this.id, ...data } : { ...data, style: ButtonStyle.Link });
        this.callback = () => {};
    }

    /**
     * Register the button to the client.
     * @param client The client to register the button to.
     */
    public register(client: KommandoClient): Button {
        this.requires.push(...this.rawRequires.map(rawReq => client.requirements.get(rawReq)));

        return this;
    }

    /**
     * Get the button.
     */
    public getButton(): ButtonBuilder {
        return new ButtonBuilder({ ...this.button.toJSON() });
    }

    /**
     * Set the callback to call when the button is pressed.
     * @param callback The callback to call when the button is pressed.
     */
    public handle(callback: (button: ButtonInteraction) => void): Button {
        this.callback = callback;

        return this;
    }

    /**
     * Call the callback.
     * @param button The button that was pressed.
     */
    async call(button: ButtonInteraction) {
        if (this.requires.length) {
            let results: Array<boolean> = [];

            for (const requirement of this.requires) {
                results.push(await requirement!!.call(button));
                if (results.includes(false)) continue;
            }

            if (results.includes(false)) return;
        }

        this.callback(button);
        
        return this;
    }
}