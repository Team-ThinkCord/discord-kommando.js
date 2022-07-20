import { ButtonInteraction, InteractionButtonOptions, LinkButtonOptions, MessageButton } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { KommandoClient, Requirement } from ".";

export interface LinkButtonData extends LinkButtonOptions {
    id: string;
    requires?: string[];
}

export interface InteractionButtonData extends InteractionButtonOptions {
    id: string;
    requires?: string[];
}

export type ButtonData = LinkButtonData | InteractionButtonData;

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
    private button: MessageButton;

    /**
     * The callback to call when the button is pressed.
     */
    private callback: (button: ButtonInteraction) => void;

    /**
     * Create a new button handler.
     * @param data The data to create the button with.
     */
    public constructor(data: ButtonData) {
        this.id = data.id; // @ts-ignore
        this.customId = (data.style != "LINK" && data.style != MessageButtonStyles.LINK) ? data.customId : undefined;
        this.requires = [];
        this.rawRequires = data.requires ?? [];
        this.button = new MessageButton(data);
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
    public getButton(): MessageButton {
        return this.button;
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