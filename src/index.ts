
/* IMPORT */

import * as _ from 'lodash';
import * as Listr from 'listr';
import Config from './config';
import Commands from './commands';
import Prompt from './prompt';
import fetchRepositories from './repositories';
import Utils from './utils';

/* AUTOGIT */

async function autogit ( commandName?, repositories? ) {

  if ( !repositories ) {

    repositories = Config.pick ? await Prompt.repositories () : await fetchRepositories ();

  }

  const commands = await Commands.get ( commandName, repositories ),
        chunks = _.chunk ( commands, Config.parallel );

  for ( let chunk of chunks ) {

    const listr = Utils.listr.patch ( new Listr ( chunk, { concurrent: Infinity, exitOnError: true } ) ); // Beware of https://github.com/SamVerschueren/listr/issues/47

    try {

      await listr.run ();

    } catch ( err ) {

      if ( Config.exitOnError ) break;

    }

  }

}

/* EXPORT */

export default autogit;
