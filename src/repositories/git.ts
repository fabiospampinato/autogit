
/* IMPORT */

import fetchRepositoriesFolders from './folders';

/* FETCH REPOSITORIES GIT */

function fetchRepositoriesGit ( roots: string[], depth: number, include: string[], exclude: string[] ) {

  return fetchRepositoriesFolders ( roots, depth, include, exclude, ['.git'] );

}

/* EXPORT */

export default fetchRepositoriesGit;
