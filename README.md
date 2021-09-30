# discord-kommando.js
an Automatic command handler for discord.js

## Manual
[] = optional

This module is the easiest to use

But if you don't know how to use it properly, you can run into trouble

### Directories
Command: (commanddir)

Requirement: (commanddir)/requirements

Button: (commanddir)/buttons

Slash Command: (commanddir)/slash_commands

SelectMenu: (commanddir)/selectmenus

### kommando
#### setupKommando
```js
kommando.setupKommando(dir, prefix[, options]);
```

dir: Your command directory

prefix: Your bot prefix

options: Kommando options

```js
options = {
    disableMessages: false,
    messages: {
        COMMAND_LOAD_MESSAGE: "Loaded command %s from %s",
        REQUIREMENT_LOAD_MESSAGE: "Loaded requirement %s from %s",
        SLASH_COMMAND_LOAD_MESSAGE: "Loaded slash command %s from %s",
        BUTTON_LOAD_MESSAGE: "Loaded button %s from %s",
        SELECTMENU_LOAD_MESSAGE: "Loaded selectmenu %s from %s",
        PRIVATEBUTTON_CLICK: false
    }
}
```

#### CommandHandler
```js
kommando.CommandHandler(message);
```

message: Message object

#### ButtonHandler
```js
kommando.ButtonHandler(button);
```

button: Button object([Discord.MessageButton](https://discord.js.org/#/docs/main/stable/class/MessageButton) or [disbut.MessageButton](https://github.com/discord-buttons/discord-buttons/blob/main/src/v12/Classes/MessageButton.js))

#### createPrivateButton
```js
kommando.createPrivateButton(userid, id, label, style[, emoji, disabled, url]);
```

userid: The user identifier

id: Button identifier

label: Text to visible

style: Button style

emoji: Button emoji

returns: [Discord.MessageButton](https://discord.js.org/#/docs/main/stable/class/MessageButton) or [disbut.MessageButton](https://github.com/discord-buttons/discord-buttons/blob/main/src/v12/Classes/MessageButton.js)

### Command
```js
new kommando.Command(options);
```

options: 

```js
{
    name: "name",
    description: "description"[,
    aliases: [ "aliase" ],
    require: [ "YEAH" ]
    ]
}
```

#### Methods
##### handle
```js
Command.handle(callback);
```

callback: Function<message, arguments>

##### call
```js
Command.call(message, arguments);
```

message: Message object

arguments: Args by spaces

### Requirement
```js
new kommando.Requirement(name);
```

name: Requirement name

#### Methods
##### handle
```js
Requirement.handle(logic, callback);
```

logic: Function<message, arguments>: boolean

callback: Function<message, arguments>

##### call
```js
Requirement.call(message, arguments);
```

message: Message object

arguments: Args by spaces

returns: ?boolean

### Button
```js
new kommando.Button(id);
```

id: Button id

#### Methods
##### handle
```js
Button.handle(callback);
```

callback: Function<button>

##### call(button)
```js
Button.call(button);
```

button: Button object