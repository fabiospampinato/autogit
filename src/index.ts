
/* IMPORT */

import Command from './command';
import fetchRepositories from './repositories';

/* AUTOGIT */

async function autogit ( commandName?, repositories? ) {

  if ( !repositories ) repositories = await fetchRepositories ();

  for ( let repository of repositories ) {

    const command = await Command.get ( commandName, repository );

    try {

      await command.run ();

    } catch ( err ) {

      break;

    }

  }

}

/* EXPORT */

export = Object.assign ( autogit, { default: autogit } );
