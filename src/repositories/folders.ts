
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import {color} from 'specialist';
import * as walker from 'walker';
import Utils from '../utils';

/* FETCH REPOSITORIES FOLDERS */

async function fetchRepositoriesFolders ( roots: string[], depth: number, include: string[], exclude: string[], matchFolders: string[] ) {

  /* CHECKS */

  if ( !roots.length ) return [];

  for ( let root of roots ) {

    if ( Utils.folder.exists ( root ) ) continue;

    Utils.throw ( `Directory "${color.bold ( root )}" doesn't exist` );

    return [];

  }

  /* VARIABLES */

  const repositories: string[] = [];

  /* WALK ROOTS */

  await Promise.all ( roots.map ( root => {

    const maxDepth = Utils.path.getDepth ( root ) + depth;

    return new Promise ( resolve => {

      walker ( root )
        .filterDir ( dir => {

          const isExcluded = !Utils.path.isIncluded ( dir, ['**/*'], exclude ) || Utils.path.getDepth ( dir ) > maxDepth;

          if ( isExcluded ) return false;

          const isIncluded = Utils.path.isIncluded ( dir, include, exclude );

          if ( !isIncluded ) return true;

          const isRepository = !!matchFolders.find ( match => Utils.folder.exists ( path.join ( dir, match ) ) );

          if ( !isRepository ) return true;

          repositories.push ( dir );

          return false;

        })
        .on ( 'error', _.noop )
        .on ( 'end', resolve );

    });

  }));

  return repositories;

}

/* EXPORT */

export default fetchRepositoriesFolders;
