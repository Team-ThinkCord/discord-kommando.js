# discord-kommando.js
an Automatic command handler for discord.js

## WARNING
This module doesn't supports discord.js v13 or above

Please use discord.js v12 (npm i discord.js@12.5.3)

## Manual
This module is the easiest to use

But if you don't know how to use it properly, you can run into trouble

### Before making commands...
The recommended way is to "create a new bot and use discord-kommando.js"

Install this(discord-kommando.js) module in your new bot

and Make your main file and commands folder

and Write this code in your main file...

```js
const kommando = require('discord-kommando.js');
const Discord = require('discord.js');

const client = new Discord.Client();

kommando.setupKommando("your commands folder", "your bot prefix");

client.on('ready', () => {
    console.log(`Bot ready! ${client.user.tag});
});

client.on('message', kommando.CommandHandler);

client.login("Client bot token");
```

### Basic usage
#### Make command
Make your command file in your commands folder

and Write this code in your command file...

```js
const kommando = require('discord-kommando.js');

const command = new kommando.Command({
    name: "your command name(do not include spaces)",
    description: "your command description",
    aliases: [ "your command aliases" ]
});

command.handle((msg, args) => {
    // your code
});

module.exports = command;
// IMPORTANT !!!
```

#### Make requirement
You can made requirements using callbacks!

ex: 

![example requirement work image](https://media.discordapp.net/attachments/873170250479329330/883986518249705502/Screenshot_20210905-170555_Discord-Beta.png)

Codes:

Requirement file...
```js
const kommando = require('discord-kommando.js');

const requirement = new kommando.Requirement("example");

requirement.handle((msg, args) => {
    return args[0] === "and" && args[1] === "best";
}, (msg, args) => {
    msg.reply("no u");
});

module.exports = requirement;
```

Command file...
```js
const kommando = require('discord-kommando.js');

const command = new kommando.Command({
    name: "easy",
    description: "discord-kommando.js is",
    aliases: [ "nice" ],
    require: [ "example" ]
});

command.handle((msg, args) => {
    msg.channel.send("module");
});

module.exports = command;
```