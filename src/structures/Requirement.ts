import { Awaitable, CommandInteraction } from "discord.js";

export class Requirement {
    public name: string;
    public handler: Awaitable<(command: CommandInteraction) => Promise<boolean>>;
    public whenelse: Awaitable<(command: CommandInteraction) => Promise<void>>;

    constructor(name: string) {
        this.name = name;
        this.handler = async (): Promise<boolean> => true;
        this.whenelse = async () => {};
    }
    
    handle(handler: Awaitable<(command: CommandInteraction) => Promise<boolean>>, whenelse: Awaitable<(command: CommandInteraction) => Promise<void>>) {
        this.handler = handler;
        this.whenelse = whenelse;

        return this;
    }

    async call(command: CommandInteraction) {
        // @ts-ignore
        let andjsrk = await this.handler(command); // @ts-ignore
        if (!andjsrk) await this.whenelse(command);

        return andjsrk;
    }
}