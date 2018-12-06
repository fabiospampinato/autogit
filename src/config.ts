
/* IMPORT */

import * as _ from 'lodash';
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
    const filterGloblAll = glob => glob !== '**/*';

    config.verbose = config.verbose || config.dry;
    config.repositories.roots = _.castArray ( config.repositories.roots ).map ( untildify );
    config.repositories.include = _.castArray ( config.repositories.include ).map ( normalizeGlob );
    config.repositories.exclude = _.castArray ( config.repositories.exclude ).map ( normalizeGlob );

    if ( config.repositories.include.length > 1 ) config.repositories.include = config.repositories.include.filter ( filterGloblAll );

    return config;

  },

  init () {

    const config = Config.normalize ( Config.get.all () );

    _.extend ( Config, config );

  },

  get: {

    all () {

      const castArray = x => _.castArray ( x || [] );

      const configs = [Config.get.defaults (), Config.get.local (), Config.get.dynamic ()];

      return _.mergeWith ( {}, ...configs, ( prev, next ) => {

        if ( !_.isArray ( prev ) && !_.isArray ( next ) ) return;

        return castArray ( prev ).concat ( castArray ( next ) );

      });

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

      const {dry, v, verbose, i, include, e, exclude, p, parallel, pick} = argv;

      return {
        dry,
        parallel: [parallel, p].find ( _.isNumber ),
        pick,
        verbose: [verbose, v].find ( _.isBoolean ),
        repositories: {
          include: [include, i].find ( x => _.isString ( x ) || _.isArray ( x ) ),
          exclude: [exclude, e].find ( x => _.isString ( x ) || _.isArray ( x ) )
        }
      };

    }

  }

};

Config.init ();

/* EXPORT */

type Config = typeof Config & ReturnType<typeof Config.get.defaults>;

export default Config as Config;
