# discord-kommando.js
an Automatic command handler for discord.js

## Manual
This module is the easiest to use

But if you don't know how to use it properly, you can run into trouble

### Directories
Command: (commanddir)

Requirement: (commanddir)/requirements

Button: (commanddir)/buttons

Slash Command: (commanddir)/slash_commands

SelectMenu: (commanddir)/selectmenus

### kommando
#### setupKommando(dir, prefix[, options])
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

#### CommandHandler(message)
```js
kommando.CommandHandler(message);
```

message: Message object

#### ButtonHandler(button)
```js
kommando.ButtonHandler(button);
```

button: Button object([Discord.MessageButton](https://discord.js.org/#/docs/main/stable/class/MessageButton) or [disbut.MessageButton](https://github.com/discord-buttons/discord-buttons/blob/main/src/v12/Classes/MessageButton.js))

#### createPrivateButton(userid, id, label, style[, emoji, disabled, url])
```js
kommando.createPrivateButton(userid, id, label, style[, emoji, disabled, url]);
```

userid: The user identifier

id: Button identifier

label: Text to visible

style: Button style

emoji: Button emoji

returns: [Discord.MessageButton](https://discord.js.org/#/docs/main/stable/class/MessageButton) or [disbut.MessageButton](https://github.com/discord-buttons/discord-buttons/blob/main/src/v12/Classes/MessageButton.js)

### Command(options)
```js
new kommando.Command(options);
```

```js
options:
    name: "Your command name",
    description: "Your command description"[,
    aliases: [ "Aliases" ],
    require: [ "Requirements"]
    ]
```

#### Methods
##### handle(callback)
```js
Command.handle(callback);
```

callback: Function<message, arguments>

##### call(message, arguments)
```js
Command.call(message, arguments);
```

message: Message object

arguments: Args by spaces

### Requirement(name)
```js
new kommando.Requirement(name);
```

name: Requirement name

#### Methods
##### handle(logic, callback)
```js
Requirement.handle(logic, callback);
```

logic: Function<message, arguments>: boolean

callback: Function<message, arguments>

##### call(message, arguments)
```js
Requirement.call(message, arguments);
```

message: Message object

arguments: Args by spaces

returns: ?boolean

### Button(id)
```js
new kommando.Button(id);
```

id: Button id

#### methods
##### handle(callback)
```js
Button.handle(callback);
```

callback: Function<button>

##### call(button)
```js
Button.call(button);
```

button: Button object