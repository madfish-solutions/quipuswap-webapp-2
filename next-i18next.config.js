const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ru'],
    localePath: path.resolve('./public/static/locales'),
    keySeparator: false,
  },
}