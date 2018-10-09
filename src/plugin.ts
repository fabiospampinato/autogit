
/* IMPORT */

import * as _ from 'lodash';
import chalk from 'chalk';
import * as execa from 'execa';
import * as Listr from 'listr';
import Config from './config';
import Utils from './utils';

/* PLUGIN */

const Plugin = {

  parse ( plugin: Listr | Function | string, repository: string ) {

    if ( plugin instanceof Listr ) return Utils.listr.patch ( plugin );

    if ( _.isFunction ( plugin ) ) return Plugin.parseFunction ( plugin, repository );

    if ( _.isString ( plugin ) ) return Plugin.parseString ( plugin, repository );

    Utils.throw ( `Unsupported plugin type "${chalk.bold ( typeof plugin )}"` );

  },

  parseFunction ( plugin: Function, repository: string ) {

    const title = plugin['title'] || plugin.name;

    return Utils.listr.patch ( new Listr ([{
      title,
      task: ( ctx, task ) => plugin ( Config, repository, ctx, task )
    }]));

  },

  parseString ( plugin: string, repository: string ) {

    return Utils.listr.patch ( new Listr ([{
      title: `shell ${chalk.gray ( plugin )}`,
      skip: () => Config.dry,
      task: async ( ctx, task ) => {
        const {stdout} = await execa.shell ( `${plugin} && exit 0`, { cwd: repository } );
        task.output = stdout;
      }
    }]));

  }

};

/* EXPORT */

export default Plugin;
