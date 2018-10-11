
# Plugins

Plugins are a powerful way to encapsulate and share complex functionalities in an easily importable package.

## Definition

Plugins can be used to define commands, learn more about [commands](/commands.md) and the [configuration](/configuration.md).

There are multiple ways to write plugins:

#### String

These are plain shell commands, they won't look pretty though:

```js
'rm -rf node_modules'
```

#### Function

They will be called with:

- **config**: autogit's configuration object.
- **repoPath**: the absolute path of the target repository.
- **ctx**: [Listr](https://github.com/SamVerschueren/listr)'s [`ctx`](https://github.com/SamVerschueren/listr#context) object.
- **task**: [Listr](https://github.com/SamVerschueren/listr)'s [`task`](https://github.com/SamVerschueren/listr#task-object) object.

```ts
function myPlugin ( config, repoPath, ctx, task ) {
  // Plugin logic...
}
```

You can additionally define a `title` property, which will be used instead of the name of the function if available:

```ts
myPlugin.title = 'My Plugin';
```

#### Function => Listr

You can also return an instance of [Listr](https://github.com/SamVerschueren/listr) from your plugin function, this will allow you to define subtasks.

```ts
const Listr = require ( 'listr' );

function myPlugin ( config, repoPath, ctx, task ) {

  return new Listr ([
    {
      title: 'Noop',
      task: () => true
    },
    {
      title: 'Lottery',
      enabled: () => Math.random () > 0.5,
      task: () => true
    }
  ]);

}
```

#### Function Factory

If you want your plugin to be able to accept options you should wrap it in a function that can accept options:

```ts
function factory ( options = {} ) {

  return function myPlugin ( config, repoPath, ctx, task ) {
    // Some code...
  };

  /* --- OR --- */

  return function myPlugin ( config, repoPath, ctx, task ) {
    return new Listr ([
      // Some tasks...
    ]);
  };

}
```

## Notes

- **Respect `--dry`**: Unless you're writing your plugin as a string, where this is handled for you, you should always make sure you're respecting the `--dry` flag and only simulate doing the work when its setted. You can retrieve this value with `config.dry`.

## Community Plugins

You can find most of the plugins made by the community in the [awesome-autogit](https://github.com/fabiospampinato/awesome-autogit) repository.

Plugins should follow the [UNIX philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) and be minimalistic and easily composable into commands.
