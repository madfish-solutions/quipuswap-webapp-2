const path = require('path');
const withReactSvg = require('next-react-svg');

const { i18n } = require('./next-i18next.config');

module.exports = withReactSvg({
  include: path.resolve(__dirname, 'public/svg'),
  webpack(config, options) {
    return config
  },
  images: {
    domains: ['img.templewallet.com'],
  },
  i18n,
  async redirects() {
    return [
      {
        source: '/swap',
        destination: `/swap/${process.env.DEFAULT_SWAP_URI}`,
        permanent: true,
      },
      {
        source: '/liquidity',
        destination: `/liquidity/add/${process.env.DEFAULT_SWAP_URI}`,
        permanent: true,
      },
      {
        source: '/liquidity/:slug',
        destination: `/liquidity/add/:slug`,
        permanent: true,
      },
      {
        source: '/invest/add-liquidity/:slug',
        destination: `/liquidity/add/TEZ-:slug`,
        permanent: true,
      },
      {
        source: '/invest/add-token/:slug',
        destination: `/liquidity/add/TEZ-:slug`,
        permanent: true,
      },
      {
        source: '/liquidity/add',
        destination: `/liquidity/add/${process.env.DEFAULT_SWAP_URI}`,
        permanent: true,
      },
      {
        source: '/liquidity/remove',
        destination: `/liquidity/remove/${process.env.DEFAULT_SWAP_URI}`,
        permanent: true,
      },
      {
        source: '/invest/remove-liquidity/:slug',
        destination: `/liquidity/remove/TEZ-:slug`,
        permanent: true,
      },
    ]
  },
});