
/* IMPORT */

import Command from './command';
import fetchRepositories from './repositories';

/* AUTOGIT */

async function autogit ( commandName?, repositories? ) {

  if ( !repositories ) repositories = await fetchRepositories ();

  for ( let repository of repositories ) {

    const command = await Command.get ( commandName, repository );

    try {

      if ( command._tasks.every ( task => task._enabledFn && !task._enabledFn ( repository, {} ) ) ) continue; // Don't printing anything if disabled

      await command.run ();

    } catch ( err ) {

      break;

    }

  }

}

/* EXPORT */

export = Object.assign ( autogit, { default: autogit } );
