const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'ru', 'es', 'pt'],
    localePath: path.resolve('./public/static/locales'),
    keySeparator: false,
  },
}