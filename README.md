# discord-kommando.js
an Automatic command handler for discord.js

## WARNING
This module doesn't supports discord.js v13 or above

Please use discord.js v12 (npm i discord.js@12.5.3)

## Manual

This module is the easiest to use

But if you don't know how to use it properly, you can run into trouble

### 1. Set up kommando

To register commands, you need to **configure** kommando

Paste this code in your main file...

```js
const Discord = require('discord.js');
const kommando = require('djs-kommando.js');
// Module importing

const client = new Discord.Client();

kommando.setupKommando("your commands dir", "your prefix");

client.on('ready', () => {
    console.log(client.user.tag);
});

client.on('message', kommando.commandHandler);

client.login("your token");
```

### 2. Register commands
Make your commands folder!

and make your command file(The command file must have the extension 'js')

Next, write this code in your command file...

```js
const kommando = require('djs-kommando.js');

const command = new kommando.Command({
    name: "ping",
    description: "pingpong",
    aliases: [ "pingpong", "pong" ],
    require: [ "I will explain later" ]
});

command.handle((msg, args) => {
    msg.channel.send(":ping_pong: Pong!");
});

module.exports = command;
```

### 3. Start your bot
Now, you can start your bot!

Write "node your-main.js" in your console!