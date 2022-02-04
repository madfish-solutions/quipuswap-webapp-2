interface NewsWithoutLink {
  id: number;
  img: string;
}

interface NewsWithLink {
  id: number;
  img: string;
  url: string;
  external?: boolean;
}

export type News = NewsWithoutLink | NewsWithLink;

export const isNewsWithLink = (news: News): news is NewsWithLink => 'url' in news;

export const NewsData: News[] = [
  {
    id: 0,
    img: '/images/major-update.png'
  },
  {
    id: 1,
    img: '/images/open-source-dex.png'
  },
  {
    id: 2,
    img: '/images/quipu-airdrop.png',
    url: 'https://story.madfish.solutions/quipuswap-governance-token-airdrop-announcement/',
    external: true
  },
  {
    id: 3,
    img: '/images/tokenomics-guide.png',
    url: 'https://story.madfish.solutions/quipuswap-tokenomics-guide-quipu-learn-everything-about-our-governance-token/',
    external: true
  },
  {
    id: 4,
    img: '/images/security-audit.png',
    url: 'https://story.madfish.solutions/least-authority-has-successfully-conducted-the-quipuswap-security-audit/',
    external: true
  }
];
