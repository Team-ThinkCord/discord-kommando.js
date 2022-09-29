import { InteractionButtonOptions } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { ButtonData } from "./Button";

export class Util {
    static isInteractionButtonOptions(o: ButtonData): o is Omit<InteractionButtonOptions, 'customId'> & { id: string, requires: string[] } {
        return o.style != MessageButtonStyles.LINK && o.style != 'LINK';
    }
}