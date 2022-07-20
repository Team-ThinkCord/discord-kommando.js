import { ModalOptions, Modal as DJSModal, ModalSubmitInteraction } from "discord.js";
import { KommandoClient, Requirement } from ".";

export interface ModalData extends Omit<ModalOptions, "customId"> {
    id: string;
    requires?: string[];
}

export class Modal {
    /**
     * The identifier of the modal.
     */
    public id: string;

    public requires: Array<Requirement | undefined>;

    /**
     * The raw requirements before load.
     */
    private rawRequires: string[];

    /**
     * The builded modal.
     */
    private modal: DJSModal;

    /**
     * The callback to call when the modal is submitted.
     */
    private callback: (modal: ModalSubmitInteraction) => void;

    /**
     * Create a new modal handler.
     */
    public constructor(data: ModalData) {
        this.id = data.id;
        this.requires = [];
        this.rawRequires = data.requires ?? [];
        this.modal = new DJSModal({ ...data, customId: data.id });
        this.callback = () => {};
    }

    /**
     * Register the modal to the client.
     * @param client The client to register the modal to.
     */
    public register(client: KommandoClient) {
        this.requires.push(...this.rawRequires.map(rawReq => client.requirements.get(rawReq)));

        return this;
    }

    /**
     * Get the modal.
     */
    public getModal(): DJSModal {
        return this.modal;
    }

    /**
     * Set the callback to call when the modal is submitted.
     * @param callback The callback to call.
     */
    public handle(callback: (modal: ModalSubmitInteraction) => void) {
        this.callback = callback;

        return this;
    }

    /**
     * Call the callback.
     * @param modal The modal that was submitted.
     */
    async call(modal: ModalSubmitInteraction) {
        if (this.requires.length) {
            let results: Array<boolean> = [];

            for (const requirement of this.requires) {
                results.push(await requirement!!.call(modal));
            }

            if (results.includes(false)) return;
        }

        this.callback(modal);
        
        return this;
    }
}