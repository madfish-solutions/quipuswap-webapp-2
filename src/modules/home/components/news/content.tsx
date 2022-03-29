interface NewsWithoutLink {
  id: string;
  img: string;
}

interface NewsWithLink {
  id: string;
  img: string;
  url: string;
  external?: boolean;
}

export type News = NewsWithoutLink | NewsWithLink;

export const isNewsWithLink = (news: News): news is NewsWithLink => 'url' in news;

export const NewsData: News[] = [
  {
    id: 'token-to-token-security-audit',
    img: '/images/token-to-token-security-audit.png',
    url: 'https://story.madfish.solutions/runtime-verification-published-quipuswaps-token-to-token-contract-audit/',
    external: true
  },
  {
    id: 'major-update',
    img: '/images/major-update.png',
    url: 'https://story.madfish.solutions/quipuswap-update-token-to-token-swaps-improved-routing-interfaces-and-more/',
    external: true
  },
  {
    id: 'quipu-airdrop',
    img: '/images/quipu-airdrop.png',
    url: 'https://story.madfish.solutions/quipuswap-governance-token-airdrop-announcement/',
    external: true
  },
  {
    id: 'tokenomics-guide',
    img: '/images/tokenomics-guide.png',
    url: 'https://story.madfish.solutions/quipuswap-tokenomics-guide-quipu-learn-everything-about-our-governance-token/',
    external: true
  },
  {
    id: 'quipuswap-security-audit',
    img: '/images/quipuswap-security-audit.png',
    url: 'https://story.madfish.solutions/least-authority-has-successfully-conducted-the-quipuswap-security-audit/',
    external: true
  }
];
