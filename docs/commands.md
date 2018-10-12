
# Commands

Commands are a powerful way to encapsulate and share complex functionalities in an easily importable package.

## Usage

Commands can be executed like this:

```sh
autogit <command-name>
```

## Definition

Commands are defined via the [configuration](/configuration.md).

There are multiple ways to write commands:

#### Array of Plugins

Learn about plugins [here](/plugins.md).

This is the simplest way of defining commands:

```js
const pluginFoo = require ( 'autogit-plugin-foo' );
const pluginBar = require ( 'autogit-plugin-bar' );

module.exports = { // Configuration
  commands: {
    'my-command': [,
      'rm -rf node_modules',
      pluginFoo,
      pluginBar ({ myOption: 123 })
    ]
  }
};
```

#### Object

This way you can define commands that accept [`options`](https://github.com/mattallty/Caporal.js#optionsynopsis-description-validator-defaultvalue-required---command), [`arguments`](https://github.com/mattallty/Caporal.js#argumentsynopsis-description-validator-defaultvalue---command) and have a `description`.

You can also use [Listr](https://github.com/SamVerschueren/listr)'s methods, like [`skip`](https://github.com/SamVerschueren/listr#skipping-tasks) and [`enabled`](https://github.com/SamVerschueren/listr#enabling-tasks).

```js
const shell = require ( './shell' );

module.exports = { // Configuration
  commands: {
    shell: {
      description: 'Execute a plain shell command', // This description will be displayed next to the command name when appropriate
      enabled: ( repoPath, ctx, task ) => true, // If it returns false this command will be disabled for the current repository
      skip: ( repoPath, ctx, task ) => false, // If it returns false this command will be skipped for the current repository
      args: [ // Array of accepted arguments
        ['<command>', 'Shell command to execute'] // Array of arguments to pass to Caporal's `argument` method
      ],
      options: [ // Array of accepted options
        ['--foo', 'Foo option'] // Array of arguments to pass to Caporal's `option` method
      ],
      plugins: [ // Array of plugins to execute
        shell
      ]
    }
  }
};
```

#### Object Factory

If you want your command to be able to accept options you should wrap it in a function that can accept options:

```js
function myCommand ( options = {} ) {
  return {
    description: 'Just a command',
    plugins: [
      // ...
    ]
  }
}
```

## Included Commands

- [shell](https://github.com/fabiospampinato/autogit-command-shell) - A command for executing a plain shell command.
- [status](https://github.com/fabiospampinato/autogit-command-status) - A command for showing the status of repositories.

## Community Commands

You can find most of the commands made by the community in the [awesome-autogit](https://github.com/fabiospampinato/awesome-autogit) repository.
