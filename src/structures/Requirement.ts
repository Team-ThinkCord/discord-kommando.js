import { Awaitable, CommandInteraction } from "discord.js";

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
    public handler: Awaitable<(command: CommandInteraction) => Promise<boolean>> | boolean;

    /**
     * Called when return is false.
     */
    public whenelse: Awaitable<(command: CommandInteraction) => Promise<void>>;

    /**
     * Creates a new requirement.
     * @param name The name of the requirement.
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
    handle(handler: Awaitable<(command: CommandInteraction) => Promise<boolean>>, whenelse: Awaitable<(command: CommandInteraction) => Promise<void>>) {
        this.handler = handler;
        this.whenelse = whenelse;

        return this;
    }

    /**
     * Checks if the requirement is met.
     * @param command The command to check.
     * @returns Whether the requirement is met.
     */
    async call(command: CommandInteraction) {
        // @ts-ignore
        let andjsrk = await this.handler(command); // @ts-ignore
        if (!andjsrk) await this.whenelse(command);

        return andjsrk;
    }
}