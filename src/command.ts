
/* IMPORT */

import * as _ from 'lodash';
import chalk from 'chalk';
import * as Listr from 'listr';
import compose from 'listr-compose';
import * as path from 'path';
import * as simpleGit from 'simple-git/promise';
import * as tildify from 'tildify';
import Config from './config';
import Plugin from './plugin';
import Utils from './utils';

/* COMMAND */

const Command = {

  async get ( name, repository ) {

    const command = Config.commands[name];

    if ( !command ) return Utils.throw ( `There's no command named "${chalk.bold ( name )}"` );

    let plugins = _.isArray ( command ) ? command : command.plugins;

    if ( !_.isArray ( plugins ) ) return Utils.throw ( `The "${chalk.bold ( name )}" command doesn't define any plugins` );

    plugins = plugins.map ( plugin => Plugin.parse ( plugin, repository ) );

    const title = await Command.getTitle ( repository ),
          enabled = command.enabled || _.constant ( true ),
          skip = command.skip || _.constant ( false );

    return Utils.listr.patch ( new Listr ([{
      title,
      enabled,
      skip,
      task: () => Utils.listr.patch ( compose ( ...plugins ) )
    }]));

  },

  async getTitle ( repository ) {

    const git = simpleGit ( repository ),
          status = await git.status (),
          name = path.basename ( repository ),
          branch = ( await git.branchLocal () ).current,
          isDirty = !!status.not_added.length || !!status.conflicted.length || !!status.created.length || !!status.deleted.length || !!status.modified.length || !!status.renamed.length,
          dirty = isDirty ? '*': '',
          ahead = status.ahead ? ` ${status.ahead}↑` : '',
          behind = status.behind ? ` ${status.behind}↓` : '',
          repositoryPath = false ? ` ${tildify ( repository )}` : '', // Disabled
          title = `${chalk.cyan ( name )} ${chalk.magenta ( branch )}${chalk.yellow ( dirty )}${chalk.yellow ( ahead )}${chalk.yellow ( behind )}${chalk.gray ( repositoryPath ) }`;

    return title;

  }

};

/* EXPORT */

export default Command;
