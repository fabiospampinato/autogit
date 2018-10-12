
/* IMPORT */

import Config from './config';
import Command from './command';
import Prompt from './prompt';
import fetchRepositories from './repositories';

/* AUTOGIT */

async function autogit ( commandName?, repositories? ) {

  if ( !repositories ) {

    repositories = Config.pick ? await Prompt.repositories () : await fetchRepositories ();

  }

  for ( let repository of repositories ) {

    const command = await Command.get ( commandName, repository );

    try {

      await command.run ();

    } catch ( err ) {

      if ( Config.exitOnError ) break;

    }

  }

}

/* EXPORT */

export = Object.assign ( autogit, { default: autogit } );
