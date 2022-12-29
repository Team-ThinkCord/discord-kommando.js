import { Awaitable, Interaction } from "discord.js-14";

/**
 * A requirement for a command to be executed.
 */
export class Requirement {
    /**
     * The name of the requirement.
     */
    public name: string;

    /**
     * The handler of the requirement.
     */
    public handler: (itr: Interaction) => Awaitable<Promise<boolean> | boolean>;

    /**
     * Called when return is false.
     */
    public whenelse: (itr: Interaction) => Awaitable<Promise<any | void> | any | void>;

    /**
     * Creates a new requirement.
     * @param name The name of the requirement.
     * @param target The target to handle the requirement.
     */
    constructor(name: string) {
        this.name = name;
        this.handler = async (): Promise<boolean> => true;
        this.whenelse = async () => {};
    }

    /**
     * Sets the handler of the requirement.
     * @param handler The handler of the requirement.
     * @param whenelse Called when return is false.
     * @returns The requirement.
     */
    handle(handler: (itr: Interaction) => Awaitable<Promise<boolean> | boolean>, whenelse: (itr: Interaction) => Awaitable<Promise<any | void> | void>) {
        this.handler = handler;
        this.whenelse = whenelse;

        return this;
    }

    /**
     * Checks if the requirement is met.
     * @param itr The interaction to check.
     * @returns Whether the requirement is met.
     */
    async call(itr: Interaction) {
        let andjsrk = await this.handler(itr);
        if (!andjsrk) await this.whenelse(itr);

        return andjsrk;
    }
}