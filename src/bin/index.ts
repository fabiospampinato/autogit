#!/usr/bin/env node

/* DEPRECATION NOTICE */

import chalk from 'chalk';
const deprecationLines = [
  `This package has been renamed from ${chalk.bold ( '@fabiospampinato/autogit' )} to ${chalk.bold ( 'autogit' )}`,
  `    1. Remove the old version: ${chalk.bold ( 'npm remove -g @fabiospampinato/autogit' )}`,
  `    2. Install the new version: ${chalk.bold ( 'npm install -g autogit' )}`
];
console.log ( chalk.red ( deprecationLines.join ( '\n' ) ) );
process.exit ( 0 );

/* IMPORT */

import CLI from '../cli';

/* CLI */

CLI ();
