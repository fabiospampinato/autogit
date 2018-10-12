
/* IMPORT */

import Prompt from './prompt';
import autogit from '.';

/* WIZARD */

async function wizard () {

  const command = await Prompt.command (),
        repositories = await Prompt.repositories ();

  autogit ( command, repositories );

}

/* EXPORT */

export default wizard;
