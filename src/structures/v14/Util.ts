import { ButtonStyle, InteractionButtonComponentData } from "discord.js-14";
import fs from "fs/promises";
import { Autocomplete } from "./Autocomplete";
import { Button, ButtonData } from "./Button";
import { Command } from "./Command";
import { ContextMenu } from "./ContextMenu";
import { KommandoClient } from "./KommandoClient";
import { Modal } from "./Modal";
import { SelectMenu } from "./SelectMenu";

interface CachedJSON {
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

    static arraysEqual(a: Array<unknown>, b: Array<unknown>): boolean {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
      
        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.
        // Please note that calling sort on an array will modify that array.
        // you might want to clone your array first.
      
        for (var i = 0; i < a.length; ++i) {
            if (Array.isArray(a[i]) && !this.arraysEqual(a[i] as Array<unknown>, b[i] as Array<unknown>)) return false;
            else if (a[i] !== b[i]) return false;
        }

        return true;
      }
}