import { version as rawVersion } from "discord.js";

const djsVer = rawVersion.split(".")[0];

import * as v14Structures from './structures/v14';

export * from './structures/v14';

export default v14Structures.KommandoClient;