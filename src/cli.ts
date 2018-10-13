
/* IMPORT */

import * as _ from 'lodash';
import * as Caporal from 'caporal';
import chalk from 'chalk';
import * as readPkg from 'read-pkg-up';
import * as updateNotifier from 'update-notifier';
import Config from './config';
import wizard from './wizard';
import autogit from '.';

const caporal = Caporal as any;

/* CLI */

async function CLI () {

  /* APP */

  const {pkg} = await readPkg ({ cwd: __dirname });

  updateNotifier ({ pkg }).notify ();

  const app = caporal.version ( pkg.version );

  /* SET DEFAULT OPTIONS */

  function setDefaultOptions ( command ) {

    command.option ( '--include, -i <glob>', 'Only include repositories matching this glob', app.REPEATABLE, '**/*' )
           .option ( '--exclude, -e <glob>', 'Exclude repositories matching this glob', app.REPEATABLE, '**/.*, ...' )
           .option ( '--parallel, -p [number]', 'Maximum number of commands to run in parallel', app.INT, 1 )
           .option ( '--pick', 'Manually pick repositories', undefined, false )
           .option ( '--dry', 'Simulate the command', undefined, false )
           .option ( '--no-dry', 'Don\'t simulate the command', undefined, true )
           .option ( '--no-verbose', 'Disable verbose mode', undefined, false );

  }

  /* WIZARD */

  setDefaultOptions ( app );

  app.argument ( '[command]', 'Command to execute' );

  app.action ( ({ command }) => {

    if ( command ) return autogit ( command );

    return wizard ();

  });

  /* COMMANDS */

  _.sortBy ( Object.keys ( Config.commands ), command => command.toLowerCase () ).forEach ( name => {

    const {description, arguments: args, options} = Config.commands[name];

    const command = app.command ( name, description );

    setDefaultOptions ( command );

    if ( args ) {

      args.forEach ( arg => command.argument ( ..._.castArray ( arg ) ) );

    }

    if ( options ) {

      options.forEach ( option => command.option ( ..._.castArray ( option ) ) );

    }

    command.action ( () => autogit ( name ) );

  });

  /* HELP */

  const command = app['_defaultCommand'];
  const helpLines = [
    `autogit shell pwd`,
    `autogit shell 'pwd && sleep 1' ${chalk.green ( '--parallel' )} ${chalk.blue ( '5' )}`,
    `autogit my-command ${chalk.green ( '--dry' )}`,
    `autogit my-command ${chalk.green ( '--include' )} ${chalk.blue ( 'vscode-*' )} ${chalk.green ( '--no-verbose' )}`,
  ];

  command.help ( helpLines.join ( '\n' ), { name: 'USAGE - ADVANCED' } );

  /* PARSE */

  caporal.parse ( process.argv );

}

/* EXPORT */

export default CLI;
