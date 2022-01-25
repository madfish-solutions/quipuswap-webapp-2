const path = require('path');
const withReactSvg = require('next-react-svg');

const { i18n } = require('./next-i18next.config');

module.exports = withReactSvg({
  include: path.resolve(__dirname, 'public/svg'),
  webpack(config, options) {
    return config;
  },
  images: {
    domains: ['img.templewallet.com']
  },
  i18n,
  async redirects() {
    return [
      {
        source: '/swap',
        destination: `/swap/${process.env.DEFAULT_TOKENS_SLUGS}`,
        permanent: true
      },
      {
        source: '/liquidity',
        destination: `/liquidity/add/${process.env.DEFAULT_TOKENS_SLUGS}`,
        permanent: true
      },
      {
        source: '/liquidity/add',
        destination: `/liquidity/add/${process.env.DEFAULT_TOKENS_SLUGS}`,
        permanent: true
      },
      {
        source: '/liquidity/remove',
        destination: `/liquidity/remove/${process.env.DEFAULT_TOKENS_SLUGS}`,
        permanent: true
      },
      {
        source: '/voting',
        destination: `/voting/vote/${process.env.DEFAULT_TOKENS_SLUGS}`,
        permanent: true
      },
      {
        source: '/voting/vote',
        destination: `/voting/vote/${process.env.DEFAULT_TOKENS_SLUGS}`,
        permanent: true
      },
      {
        source: '/voting/veto',
        destination: `/voting/veto/${process.env.DEFAULT_TOKENS_SLUGS}`,
        permanent: true
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate'
          }
        ]
      }
    ];
  },
  eslint: {
    ignoreDuringBuilds: true
  }
});
