
/* IMPORT */

import Command from './command';

/* COMMANDS */

const Commands = {

  get ( commandName, repositories ) {

    return Promise.all ( repositories.map ( repository => {

      return Command.get ( commandName, repository );

    }));

  }

};

/* EXPORT */

export default Commands;
