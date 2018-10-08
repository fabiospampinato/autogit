
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import Config from '../config';
import fetchRepositoriesGit from './git';
import fetchRepositoriesGitTower from './git_tower';

/* FETCH REPOSITORIES */

async function fetchRepositories () {

  const {depth, roots, include, exclude} = Config.repositories;

  const groups = await Promise.all ([
    fetchRepositoriesGit ( roots, depth, include, exclude ),
    fetchRepositoriesGitTower ( include, exclude )
  ]);

  return _.sortBy ( _.uniq ( _.concat ( ...groups ) ), repository => path.basename ( repository ).toLowerCase () );

}

/* EXPORT */

export default fetchRepositories;
