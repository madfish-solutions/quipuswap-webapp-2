import MajorUpdate from '@images/major-update.png';
import QuipuAirdrop from '@images/quipu-airdrop.png';
import SecurityAudit from '@images/quipuswap-security-audit.png';
import TokenToToken from '@images/token-to-token-security-audit.png';
import TokenomicsGuide from '@images/tokenomics-guide.png';
interface NewsWithoutLink {
  id: string;
  img: string;
}

interface NewsWithLink {
  id: string;
  img: string;
  url: string;
  external?: boolean;
  testId?: string;
}

export type News = NewsWithoutLink | NewsWithLink;

export const isNewsWithLink = (news: News): news is NewsWithLink => 'url' in news;

export const NewsData: News[] = [
  {
    id: 'token-to-token-security-audit',
    img: TokenToToken,
    url: 'https://story.madfish.solutions/runtime-verification-published-quipuswaps-token-to-token-contract-audit/',
    external: true,
    testId: 'hTokenToToken'
  },
  {
    id: 'major-update',
    img: MajorUpdate,
    url: 'https://story.madfish.solutions/quipuswap-update-token-to-token-swaps-improved-routing-interfaces-and-more/',
    external: true,
    testId: 'hMajorUpdate'
  },
  {
    id: 'quipu-airdrop',
    img: QuipuAirdrop,
    url: 'https://story.madfish.solutions/quipuswap-governance-token-airdrop-announcement/',
    external: true,
    testId: 'hQuipuAirdrop'
  },
  {
    id: 'tokenomics-guide',
    img: TokenomicsGuide,
    url: 'https://story.madfish.solutions/quipuswap-tokenomics-guide-quipu-learn-everything-about-our-governance-token/',
    external: true,
    testId: 'hTokenomicsGuide'
  },
  {
    id: 'quipuswap-security-audit',
    img: SecurityAudit,
    url: 'https://story.madfish.solutions/least-authority-has-successfully-conducted-the-quipuswap-security-audit/',
    external: true,
    testId: 'hSecurityAudit'
  }
];
