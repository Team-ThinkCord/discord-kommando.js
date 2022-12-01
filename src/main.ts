import { version as rawVersion } from "discord.js";

const djsVer = rawVersion.split(".")[0];

import * as v13Structures from './structures/v13';
import * as v14Structures from './structures/v14';

/** @deprecated please use discord-kommando.js/v{discord.js ver} */
export const KommandoClient = djsVer == '13' ? v13Structures.KommandoClient : v14Structures.KommandoClient;
/** @deprecated please use discord-kommando.js/v{discord.js ver} */
export const Command = djsVer == '13' ? v13Structures.Command : v14Structures.Command;
/** @deprecated please use discord-kommando.js/v{discord.js ver} */
export const Requirement = djsVer == '13' ? v13Structures.Requirement : v14Structures.Requirement;
/** @deprecated please use discord-kommando.js/v{discord.js ver} */
export const Button = djsVer == '13' ? v13Structures.Button : v14Structures.Button;
/** @deprecated please use discord-kommando.js/v{discord.js ver} */
export const SelectMenu = djsVer == '13' ? v13Structures.SelectMenu : v14Structures.SelectMenu;
/** @deprecated please use discord-kommando.js/v{discord.js ver} */
export const Modal = djsVer == '13' ? v13Structures.Modal : v14Structures.Modal;
/** @deprecated please use discord-kommando.js/v{discord.js ver} */
export const Autocomplete = djsVer == '13' ? v13Structures.Autocomplete : v14Structures.Autocomplete;
/** @deprecated please use discord-kommando.js/v{discord.js ver} */
export const ContextMenu = djsVer == '13' ? v13Structures.ContextMenu : v14Structures.ContextMenu;
/** @deprecated please use discord-kommando.js/v{discord.js ver} */
export const Util = djsVer == '13' ? v13Structures.Util : v14Structures.Util;

/** @deprecated please use discord-kommando.js/v{discord.js ver} */
export default KommandoClient; // automatic (not recommended)