import { Awaitable, CommandInteraction } from "discord.js";

export class Requirement {
    public name: string;
    public handler: Awaitable<(command: CommandInteraction) => boolean>;
    public whenelse: Awaitable<(command: CommandInteraction) => void>;

    constructor(name: string) {
        this.name = name;
    }

    handle(handler: Awaitable<(command: CommandInteraction) => boolean>, whenelse: Awaitable<(command: CommandInteraction) => void>) {
        this.handler = handler;
        this.whenelse = whenelse;
    }

    async call(command: CommandInteraction) {
        // @ts-ignore
        if (!(await this.handler(command))) await this.whenelse(command);

        return;
    }
}