const SITE_NAME = 'QuipuSwap';
const IMAGE = 'quipuswap.png';
const TITLE = `${SITE_NAME} - Tezos DEX with on-chain governance for baking rewards`;
const DESCRIPTION =
  'Decentralized exchange for the Tezos based tokens. Create liquidity pairs, swap tokens, participate in farming activities. The DEX is open source and audited.';

export const DEFAULT_SEO = {
  TITLE,
  DESCRIPTION,
  SITE_NAME,
  WEBSITE_URL: 'https://quipuswap.com/', // Slash in the end is necessary
  IMAGE,
  OG: {
    TYPE: 'website',
    SITE_NAME: TITLE
  },
  TWITTER: {
    HANDLE: '@madfishofficial',
    SITE: '@QuipuSwap',
    CARD_TYPE: 'summary_large_image'
  }
};
