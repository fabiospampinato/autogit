
/* IMPORT */

import * as _ from 'lodash';
import ask from 'inquirer-helpers';
import chalk from 'chalk';
import * as path from 'path';
import * as tildify from 'tildify';
import Config from './config';
import fetchRepositories from './repositories';
import Utils from './utils';
import autogit from '.';

/* WIZARD */

async function wizard () {

  /* COMMAND */

  const commands = Object.keys ( Config.commands ).sort ();

  if ( !commands.length ) return Utils.throw ( 'No commands defined' );

  const list = commands.map ( command => ({
    value: command,
    name: `${command} ${chalk.gray ( Config.commands[command].description || '' )}`,
    short: command
  }));

  const listSorted = _.sortBy ( list, choice => choice.name.toLowerCase () );

  const command = await ask.list ( 'What command?', listSorted );

  /* REPOSITORIES */

  let repositories = await fetchRepositories ();

  if ( !repositories.length ) return Utils.throw ( 'No repositories found' );

  const allRepositories = await ask.yesNo ( 'Use all repositories?' );

  if ( !allRepositories ) {

    const list = repositories.map ( repository => ({
      value: repository,
      name: `${path.basename ( repository )} ${chalk.gray ( tildify ( repository ) )}`,
      short: path.basename ( repository )
    }));

    const listSorted = _.sortBy ( list, choice => choice.name.toLowerCase () );

    repositories = await ask.checkbox ( 'What repositories?', listSorted );

  }

  /* AUTOGIT */

  autogit ( command, repositories );

}

/* EXPORT */

export default wizard;
