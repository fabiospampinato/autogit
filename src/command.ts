
/* IMPORT */

import * as _ from 'lodash';
import chalk from 'chalk';
import * as Listr from 'listr';
import compose from 'listr-compose';
import * as path from 'path';
import * as simpleGit from 'simple-git/promise';
import * as stripAnsi from 'strip-ansi';
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

    return Utils.listr.patch ( new Listr ([{
      title: await Command.getTitle ( repository ),
      enabled: await Command.getEnabled ( repository, command ),
      skip: await Command.getSkip ( repository, command ),
      task: () => Utils.listr.patch ( compose ( ...plugins ) )
    }]));

  },

  async getEnabled ( repository, command ) {

    if ( !command.enabled ) return _.constant ( true );

    return async function enabled ( ctx, task ) {
      const enabled = command.enabled ( repository, ctx, task );
      if ( enabled !== true ) {
        task.title = chalk.dim ( stripAnsi ( task.title ) );
      }
      return enabled;
    };

  },

  async getSkip ( repository, command ) {

    if ( !command.skip ) return _.constant ( false );

    return function skip ( ctx, task ) {
      return command.skip ( repository, ctx, task );
    };

  },

  async getTitle ( repository ) {

    const git = simpleGit ( repository ),
          status = await git.status (),
          name = path.basename ( repository ),
          localBranch = ( await git.branchLocal () ).current,
          branch = localBranch ? ` ${localBranch}` : '',
          isDirty = !!status.not_added.length || !!status.conflicted.length || !!status.created.length || !!status.deleted.length || !!status.modified.length || !!status.renamed.length,
          dirty = isDirty ? '*': '',
          ahead = status.ahead ? ` ${status.ahead}↑` : '',
          behind = status.behind ? ` ${status.behind}↓` : '',
          repositoryPath = false ? ` ${tildify ( repository )}` : '', // Disabled
          title = `${chalk.cyan ( name )}${chalk.magenta ( branch )}${chalk.yellow ( dirty )}${chalk.yellow ( ahead )}${chalk.yellow ( behind )}${chalk.gray ( repositoryPath ) }`;

    return title;

  }

};

/* EXPORT */

export default Command;
