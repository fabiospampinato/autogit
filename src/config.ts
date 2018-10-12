
/* IMPORT */

import * as _ from 'lodash';
import merge from 'conf-merge';
import * as minimist from 'minimist';
import * as os from 'os';
import * as path from 'path';
import * as untildify from 'untildify';
import shell from 'autogit-command-shell';
import status from 'autogit-command-status';

const argv = minimist ( process.argv.slice ( 2 ) );

/* CONFIG */

const Config = {

  normalize ( config ) {

    const normalizeGlob = glob => /^(\*|\/)/.test ( glob ) ? glob : `**/${glob}`;

    config.verbose = config.verbose || config.dry;
    config.repositories.roots = _.castArray ( config.repositories.roots ).map ( untildify );
    config.repositories.include = _.castArray ( config.repositories.include ).map ( normalizeGlob );
    config.repositories.exclude = _.castArray ( config.repositories.exclude ).map ( normalizeGlob );

    if ( config.repositories.include.length > 1 ) config.repositories.include = config.repositories.include.slice ( 1 );

    return config;

  },

  init () {

    const config = Config.normalize ( Config.get.all () );

    _.extend ( Config, config );

  },

  get: {

    all () {

      return merge ( Config.get.defaults (), Config.get.local (), Config.get.dynamic () );

    },

    defaults () {

      return {
        dry: false,
        exitOnError: false,
        parallel: 1,
        pick: false,
        verbose: true,
        commands: {
          status,
          shell
        } as any, //TSC
        repositories: {
          depth: 2,
          roots: [
            process.cwd ()
          ],
          include: [
            '**/*'
          ],
          exclude: [
            '**/.*',
            '**/_output',
            '**/bower_components',
            '**/build',
            '**/dist',
            '**/node_modules',
            '**/out',
            '**/output',
            '**/static',
            '**/target',
            '**/third_party',
            '**/vendor'
          ]
        }
      };

    },

    local () {

      const localConfigPath = path.join ( os.homedir (), '.autogit', 'config.js' );

      try {

        return require ( localConfigPath );

      } catch ( e ) {}

    },

    dynamic () {

      const {dry, v, verbose, include, exclude, parallel, pick} = argv;

      return {
        dry,
        parallel: _.isNumber ( parallel ) ? parallel : 1,
        pick,
        verbose: [verbose, v].find ( _.isBoolean ),
        repositories: {
          include: _.isString ( include ) ? _.castArray ( include ) : include,
          exclude: _.isString ( exclude ) ? _.castArray ( exclude ) : exclude
        }
      };

    }

  }

};

Config.init ();

/* EXPORT */

type Config = typeof Config & ReturnType<typeof Config.get.defaults>;

export default Config as Config;
