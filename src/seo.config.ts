export const SITE_NAME = 'QuipuSwap';
const SITE_IMAGE = 'quipuswap.png';
export const SITE_TITLE = `${SITE_NAME} - Tezos DEX with on-chain governance for baking rewards`;
export const SITE_DESCRIPTION =
  'Decentralized exchange for the Tezos based tokens. Create liquidity pairs, swap tokens, participate in farming activities. The DEX is open source and audited.';

export const DEFAULT_SEO = {
  TITLE: SITE_TITLE,
  DESCRIPTION: SITE_DESCRIPTION,
  SITE_NAME,
  WEBSITE_URL: 'https://quipuswap.com/', // Slash in the end is necessary
  IMAGE: SITE_IMAGE,
  OG: {
    TYPE: 'website',
    SITE_NAME: SITE_TITLE
  },
  TWITTER: {
    HANDLE: '@madfishofficial',
    SITE: '@QuipuSwap',
    CARD_TYPE: 'summary_large_image'
  }
};
