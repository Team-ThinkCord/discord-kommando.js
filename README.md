# discord-kommando.js
An automatic interaction handler for discord.js

## Supported discord.js versions
| Version | Status    |
|---------|-----------|
| v13     | Removed   |
| v14     | Supported |

## Tutorial
<details><summary>JavaScript</summary>
<p>
Just.. Copy it!

```js
// CommonJS
const { KommandoClient } = require('discord-kommando.js/v14');

// ESM
import { KommandoClient } from 'discord-kommando.js/v14';

const client = new KommandoClient({ directory: "src/kommando" });

client.login('your-token-goes-here');
```

</p>
</details>

<details><summary>TypeScript</summary>
<p>
You need to change tsconfig.json before using it.

```json
{
    "compilerOptions": {
        "moduleResolution": "NodeNext"
    }
}
```

And copy it to your main file...

```ts
import { KommandoClient } from 'discord-kommando.js/v14';

const client = new KommandoClient({ directory: "dist/kommando" });

client.login('your-token-goes-here');
```
</p>
</details>

### Adding commands
Copy and add this code into (directory in your client constructor)/commands folder

```js
// Import the 'Command' class

const command = new Command({
    name: "first_command",
    description: "description (required)",
    options: [
        { name: "first_option", description: "description (required)", type: "string" }
    ]
});

command.handle(async itr => {
    // Do something
});

// Export it.
module.exports = command;

// Or ESM, Typescript?
export default command;
```

## Documentation
[Documentation link][docs]

[docs]: https://discord-kommando.js.org