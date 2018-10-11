
/* CONFIG */

const config = {
  title: 'Autogit',
  base: '/autogit/',
  description: 'Define commands, using plugins, to execute across all your repositories.',
  themeConfig: {
    repo: 'fabiospampinato/autogit',
    docsRepo: 'fabiospampinato/autogit',
    docsDir: 'docs',
    serviceWorker: {
      updatePopup: true
    },
    displayAllHeaders: true,
    sidebar: [
      ['/', 'Autogit'],
      '/configuration',
      '/commands',
      '/plugins'
    ]
  }
};

/* EXPORT */

module.exports = config;
