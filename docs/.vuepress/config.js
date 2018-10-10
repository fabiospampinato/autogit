module.exports = {
  title: 'Autogit',
  base: '/autogit/',
  description: 'Define commands, using plugins, to execute across all your repositories.',
  themeConfig: {
    repo: 'fabiospampinato/autogit',
    docsRepo: 'fabiospampinato/autogit',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Help us improve this page!',
    lastUpdated: true,
    serviceWorker: {
      updatePopup: true
    },
    displayAllHeaders: true,
    head: [
      // ['link', { rel: 'icon', href: '/logo.png' }]
    ],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Configuration', link: '/configuration' },
      { text: 'Commands', link: '/commands' },
      { text: 'Plugins', link: '/plugins' }
    ],
    sidebar: [
      ['/', 'Home'],
      '/configuration',
      '/commands',
      '/plugins'
    ]
  }
}
