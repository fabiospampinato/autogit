# Configuration

Your configuration file must be located in `~/.autogit/config.js`.

It could look like this:

```js
const githubSync = require ( 'autogit-command-github-sync' );
const readmeAutocommit = require ( 'autogit-command-readme-autocommit' );
const gitignore = require ( 'autogit-plugin-gitignore' );
const push = require ( 'autogit-plugin-push' );

module.exports = {
  dry: true, // Enable dry mode by default, where plugins only simulate doing the work
  exitOnError: true, // Exit at the first error thrown
  pick: true, // Always manually pick repositories
  verbose: false, // Disable verbose output by default
  commands: { // Your custom commands
    'github-sync': githubSync ({ token: 'MY_GITHUB_TOKEN' }),
    'readme-autocommit': readmeAutocommit (),
    'ignore-dist': [
      'rm -rf dist',
      gitignore ({ add: ['dist'] }),
      'git add -A',
      'git commit -m "Ignoring the dist folder"',
      push ( 'origin' )
    ]
  },
  repositories: { // Settings related to how autogit searches for your repositories
    depth: 2, // Search depth
    roots: [ // Root paths to start the search from
      process.cwd (),
      '~/Projects'
    ],
    include: [ // Only include repositories matching these globs
      '**/*'
    ],
    exclude: [ // Exclude repositories matching these globs
      '**/.*',
      '**/_output',
      '**/bower_components',
      '**/build',
      '**/dist',
      '**/node_modules',
      '**/out',
      '**/output',
      '**/static',
      '**/target',
      '**/third_party',
      '**/vendor'
    ]
  }
};
```

Some of these settings can be overridden at runtime, see `autogit --help` to learn more.

Learn more about [commands](/commands.md) and [plugins](/plugins.md).
