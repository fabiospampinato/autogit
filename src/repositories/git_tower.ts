
/* IMPORT */

import * as _ from 'lodash';
import * as os from 'os';
import * as path from 'path';
import * as plist from 'plist';
import Utils from '../utils';

/* VARIABLES */

const BOOKMARKS_PATHS = [
  `${os.homedir ()}/Library/Application\ Support/com.fournova.Tower2/bookmarks-v2.plist`,
  `${os.homedir ()}/Library/Application\ Support/com.fournova.Tower3/bookmarks-v2.plist`
];

/* FETCH REPOSITORIES GIT TOWER */

async function fetchRepositoriesGitTower ( include: string[], exclude: string[] ) {

  if ( !/darwin/.test ( process.platform ) ) return []; //TODO: Add Windows support

  async function getFile () {

    let mtime = new Date ( 0 ),
        content;

    for ( let filePath of BOOKMARKS_PATHS ) { // Selecting the most recently modified one

      const stat = await Utils.file.stat ( filePath );

      if ( !stat || stat.mtime.getTime () <= mtime.getTime () ) continue;

      mtime = stat.mtime;

      content = await Utils.file.read ( filePath );

    }

    return content;

  }

  const file = await getFile ();

  if ( !file ) return [];

  const bookmarks = plist.parse ( file ),
        repositories: string[] = [];

  function parseObj ( obj ) {

    if ( obj.type === 2 ) { // Repository

      const repository = _.trimEnd ( obj.fileURL.replace ( 'file://', '' ), '/' ),
            isIncluded = Utils.path.isIncluded ( repository, include, exclude );

      if ( isIncluded ) {

        const isRepository = Utils.folder.exists ( path.join ( repository, '.git' ) );

        if ( isRepository ) {

          repositories.push ( repository );

        }

      }

    }

    if ( obj.children ) {

      obj.children.forEach ( parseObj );

    }

  }

  parseObj ( bookmarks );

  return repositories;

}

/* EXPORT */

export default fetchRepositoriesGitTower;
