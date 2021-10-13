const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    localePath: path.resolve('./public/static/locales'),
    keySeparator: '>',
    nsSeparator: '|', 
  },
}