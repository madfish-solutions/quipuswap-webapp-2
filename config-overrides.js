/* config-overrides.js */
const {
  useBabelRc,
  addBabelPlugin,
  override,
  addDecoratorsLegacy,
  disableEsLint,
  addBundleVisualizer,
  addWebpackAlias
} = require('customize-cra');

const path = require('path');

module.exports = override(
  config => ({
    ...config,
    output: {
      ...config.output,
      globalObject: 'this'
    }
  }),
  useBabelRc(),
  disableEsLint(),
  process.env.BUNDLE_VISUALIZE === 1 && addBundleVisualizer(),
  addDecoratorsLegacy(),
  addBabelPlugin(['@babel/plugin-transform-typescript', { allowNamespaces: true }]),
  addWebpackAlias({
    $Utils: path.resolve(__dirname, 'src/Utils'),
    '@app': path.resolve(__dirname, 'src'),

    '@app.config': path.resolve(__dirname, 'src/app.config'),
    '@app.i18n': path.resolve(__dirname, 'src/app.i18n'),
    '@seo.config': path.resolve(__dirname, 'src/seo.config'),
    '@graphql': path.resolve(__dirname, 'src/graphql'),

    // '@pages/home': path.resolve(__dirname, 'src/pages/home'),
    '@pages/*': path.resolve(__dirname, 'src/pages/*'),

    '@components/*': path.resolve(__dirname, 'src/components/*'),
    '@containers/*': path.resolve(__dirname, 'src/containers/*'),
    '@errors/*': path.resolve(__dirname, 'src/errors/*'),
    '@styles/*': path.resolve(__dirname, 'src/styles/*'),
    '@utils/*': path.resolve(__dirname, 'src/utils/*'),
    '@hooks/*': path.resolve(__dirname, 'src/hooks/*'),
    '@providers/*': path.resolve(__dirname, 'src/providers/*'),
    '@icons/*': path.resolve(__dirname, 'src/icons/*'),
    '@images/*': path.resolve(__dirname, 'src/images/*')
  })
);
