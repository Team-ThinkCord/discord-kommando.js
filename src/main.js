const Discord = require('discord.js')
const fs = require('fs')
const client = Discord.client()

const commands = new Discord.Collection()

const setHandlerDir = require('./setupHandler/setHandlerDir.ts');


