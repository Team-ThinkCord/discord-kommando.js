import { AutocompleteInteraction, Awaitable, CommandInteraction, Interaction, MessageButton, MessageSelectMenu, ModalSubmitInteraction } from "discord.js";

/**
 * The requirement target.
 */
export enum RequirementTarget {
    ANY,
    COMMAND,
    BUTTON,
    SELECTMENU,
    MODAL,
    AUTOCOMPLETE,
    CONTEXTMENU
}

/**
 * A requirement for a command to be executed.
 */
export class Requirement {
    /**
     * The name of the requirement.
     */
    public name: string;

    /**
     * The target to handle the requirement.
     */
    public target: RequirementTarget;

    /**
     * The handler of the requirement.
     */
    public handler: Awaitable<(itr: Interaction) => Promise<boolean> | boolean>;

    /**
     * Called when return is false.
     */
    public whenelse: Awaitable<(itr: Interaction) => Promise<any | void> | any | void>;

    /**
     * Creates a new requirement.
     * @param name The name of the requirement.
     * @param target The target to handle the requirement.
     */
    constructor(name: string, target?: RequirementTarget) {
        this.name = name;
        this.target = target ?? RequirementTarget.ANY;
        this.handler = async (): Promise<boolean> => true;
        this.whenelse = async () => {};
    }

    /**
     * Sets the handler of the requirement.
     * @param handler The handler of the requirement.
     * @param whenelse Called when return is false.
     * @returns The requirement.
     */
    handle(handler: Awaitable<(itr: Interaction) => Promise<boolean> | boolean>, whenelse: Awaitable<(itr: Interaction) => Promise<any | void> | void>) {
        this.handler = handler;
        this.whenelse = whenelse;

        return this;
    }

    /**
     * Checks if the requirement is met.
     * @param command The command to check.
     * @returns Whether the requirement is met.
     */
    async call(itr: Interaction) {
        switch (this.target) {
            case RequirementTarget.ANY: // @ts-ignore
                let andjsrk = await this.handler(itr); // @ts-ignore
                if (!andjsrk) await this.whenelse(itr);

                return andjsrk;
                break;

            case RequirementTarget.COMMAND:
                if (itr instanceof CommandInteraction) { // @ts-ignore
                    let andjsrk = await this.handler(itr); // @ts-ignore
                    if (!andjsrk) await this.whenelse(itr);

                    return andjsrk;
                }

                return false;
                break;

            case RequirementTarget.BUTTON:
                if (itr instanceof MessageButton) { // @ts-ignore
                    let andjsrk = await this.handler(itr); // @ts-ignore
                    if (!andjsrk) await this.whenelse(itr);

                    return andjsrk;
                }

                return false;
                break;
                
            case RequirementTarget.SELECTMENU:
                if (itr instanceof MessageSelectMenu) { // @ts-ignore
                    let andjsrk = await this.handler(itr); // @ts-ignore
                    if (!andjsrk) await this.whenelse(itr);
                    
                    return andjsrk;
                }

                return false;
                break;

            case RequirementTarget.MODAL:
                if (itr instanceof ModalSubmitInteraction) { // @ts-ignore
                    let andjsrk = await this.handler(itr); // @ts-ignore
                    if (!andjsrk) await this.whenelse(itr);

                    return andjsrk;
                }

                return false;
                break;

            case RequirementTarget.AUTOCOMPLETE:
                if (itr instanceof AutocompleteInteraction) { // @ts-ignore
                    let andjsrk = await this.handler(itr); // @ts-ignore
                    if (!andjsrk) await this.whenelse(itr);

                    return andjsrk;
                }

            default:
                return false;
                break;
        }
    }
}