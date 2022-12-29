import { ButtonStyle, InteractionButtonComponentData } from "discord.js-14";
import fs from "fs/promises";
import { Autocomplete } from "./Autocomplete";
import { Button, ButtonData } from "./Button";
import { Command } from "./Command";
import { ContextMenu } from "./ContextMenu";
import { KommandoClient } from "./KommandoClient";
import { Modal } from "./Modal";
import { SelectMenu } from "./SelectMenu";

export interface CachedJSON {
    commands: unknown[],
    buttons: unknown[],
    selectmenus: unknown[],
    modals: unknown[],
    autocompletes: unknown[],
    contextmenus: unknown[]
}

export class Util {
    static isInteractionButtonOptions(o: ButtonData): o is Omit<InteractionButtonComponentData, 'customId'> & { id: string, requires: string[] } {
        return o.style != ButtonStyle.Link;
    }

    static clientToCachedJSON(client: KommandoClient): CachedJSON {
        let commands: Command[] = [];
        client.commands.each(cmd => commands.push(cmd));

        let buttons: Button[] = [];
        client.buttons.each(btn => buttons.push(btn));

        let selectmenus: SelectMenu[] = [];
        client.selectMenus.each(menu => selectmenus.push(menu));

        let modals: Modal[] = [];
        client.modals.each(mdl => modals.push(mdl));

        let autocompletes: Autocomplete[] = [];
        client.autocompletes.each(auc => autocompletes.push(auc));

        let contextmenus: ContextMenu[] = [];
        client.contextMenuCommands.each(cmd => contextmenus.push(cmd));

        return {
            commands,
            buttons,
            selectmenus,
            modals,
            autocompletes,
            contextmenus
        }
    }

    static async getCache(): Promise<CachedJSON> {
        return JSON.parse(((await fs.readFile("kommando_cache.json", 'utf-8').catch(() => {})) ?? "{}").toString());
    }

    static async cacheClient(client: KommandoClient) {
        console.log("Saving cache...");

        let cache = this.clientToCachedJSON(client);

        await fs.unlink("kommando_cache.json").catch(() => {});

        await fs.writeFile("kommando_cache.json", JSON.stringify(cache, null, 4));

        console.log("Cache saving successful!");

        return;
    }

    static arraysEqual(a_: Array<unknown>, b_: Array<unknown>): boolean {
        let a = JSON.stringify(a_);
        let b = JSON.stringify(b_);

        if (a != b) return false;

        return true;
      }
}