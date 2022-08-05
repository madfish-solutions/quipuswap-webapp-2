const path = require('path');

module.exports = {
  'stories': [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  'addons': [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app'
  ],
  'framework': '@storybook/react',
  'core': {
    'builder': '@storybook/builder-webpack5'
  },
  webpackFinal(config, { configType }) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '~': path.resolve(__dirname, '../src/'),
          '@blockchain': path.resolve(__dirname, '../src/blockchain'),
          '@config': path.resolve(__dirname, '../src/config/'),
          '@modules': path.resolve(__dirname, '../src/modules/'),
          '@providers': path.resolve(__dirname, '../src/providers/'),
          '@shared': path.resolve(__dirname, '../src/shared/'),
          '@styles': path.resolve(__dirname, '../src/styles/'),
          '@types': path.resolve(__dirname, '../src/types/'),
          '@images': path.resolve(__dirname, '../src/images/'),
          '@tests': path.resolve(__dirname, '../src/tests/'),
          '@translation': path.resolve(__dirname, '../src/translation'),
          '@libs': path.resolve(__dirname, '../src/libs'),
          '@app.router': path.resolve(__dirname, '../src/app-root-routes.enum'),
          '@layout': path.resolve(__dirname, '../src/layout'),
        },
      },
    };
  },
}
