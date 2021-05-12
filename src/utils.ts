
/* IMPORT */

import * as fs from 'fs';
import * as micromatch from 'micromatch';
import * as path from 'path';
import * as pify from 'pify';
import {color} from 'specialist';
import * as listrRenderer from 'listr-update-renderer';
import Config from './config';

/* UTILS */

const Utils = {

  throw ( message ) {

    console.error ( color.red ( message ) );

    process.exit ( 1 );

  },

  path: {

    getDepth ( filePath: string ) {

      return filePath.split ( path.sep ).length;

    },

    getIncluded ( filePaths: string[], include: string[], exclude: string[] ) {

      return micromatch ( filePaths, include, { ignore: exclude } );

    },

    isIncluded ( filePath: string, include: string[], exclude: string[] ) {

      return !!Utils.path.getIncluded ( [filePath], include, exclude ).length;

    }

  },

  file: {

    async read ( filePath: string ) {

      try {

        return ( await pify ( fs.readFile )( filePath, { encoding: 'utf8' } ) ).toString ();

      } catch ( e ) {}

    },

    async stat ( filePath: string ) {

      try {

        return await pify ( fs.stat )( filePath );

      } catch ( e ) {}

    }

  },

  folder: {

    exists ( folderPath: string ) {

      try {

        fs.accessSync ( folderPath );

        return true;

      } catch ( e ) {

        return false;

      }

    }

  },

  listr: {

    patch ( listr ) {

      listr._options.collapse = !Config.verbose;
      listr._options.renderer = listrRenderer;
      listr._RendererClass = listrRenderer;

      return listr;

    }

  }

};

/* EXPORT */

export default Utils;
