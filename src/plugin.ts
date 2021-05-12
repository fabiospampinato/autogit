
/* IMPORT */

import * as _ from 'lodash';
import * as execa from 'execa';
import * as Listr from 'listr';
import {color} from 'specialist';
import Config from './config';
import Utils from './utils';

/* PLUGIN */

const Plugin = {

  parse ( plugin: Listr | Function | string, repository: string ) {

    if ( plugin instanceof Listr ) return Utils.listr.patch ( plugin );

    if ( _.isFunction ( plugin ) ) return Plugin.parseFunction ( plugin, repository );

    if ( _.isString ( plugin ) ) return Plugin.parseString ( plugin, repository );

    Utils.throw ( `Unsupported plugin type "${color.bold ( typeof plugin )}"` );

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
      title: `shell ${color.gray ( plugin.replace ( /\n/g, '\\n' ) )}`,
      skip: () => Config.dry,
      task: async ( ctx, task ) => {

        const hasArguments = /\s/.test ( plugin );

        if ( hasArguments ) {

          task.output = ( await execa.shell ( `${plugin} && exit 0`, { cwd: repository } ) ).stdout;

        } else {

          task.output = ( await execa ( plugin, { cwd: repository } ) ).stdout;

        }

      }
    }]));

  }

};

/* EXPORT */

export default Plugin;
