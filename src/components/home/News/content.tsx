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

type NewsDataList = News[];

export const NewsData: NewsDataList = [
  {
    id: 0,
    img: '/images/news1.png'
  },
  {
    id: 1,
    img: '/images/news2.png',
    url: 'https://story.madfish.solutions/quipuswap-governance-token-airdrop-announcement/',
    external: true
  },
  {
    id: 2,
    img: '/images/news3.png',
    url: 'https://story.madfish.solutions/quipuswap-tokenomics-guide-quipu-learn-everything-about-our-governance-token/',
    external: true
  },
  {
    id: 3,
    img: '/images/news4.png',
    url: 'https://story.madfish.solutions/least-authority-has-successfully-conducted-the-quipuswap-security-audit/',
    external: true
  }
];
