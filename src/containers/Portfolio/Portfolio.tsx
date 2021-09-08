import React, { useContext, useState } from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
// import { useTokens } from '@utils/dapp';
import { Tabs } from '@components/ui/Tabs';
import { Card, CardContent } from '@components/ui/Card';
import {
  FarmTable, PoolTable, TokenTable, TransactionTable,
} from '@components/portfolio/PortfolioTable';

import s from '@styles/CommonContainer.module.sass';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { TransactionType } from '@utils/types';

const PieChart = dynamic(() => import('@components/charts/PieChart'), {
  ssr: false,
});

const TabsContent = [
  {
    id: 'tokens',
    label: 'Tokens',
  },
  {
    id: 'liquidity',
    label: 'Liquidity',
  },
  {
    id: 'farms',
    label: 'Farms',
  },
];

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Portfolio: React.FC<{}> = () => {
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const { colorThemeMode } = useContext(ColorThemeContext);
  // const { data: tokens } = useTokens();
  const tokens = [
    {
      network: 'mainnet',
      type: 'fa1.2',
      contractAddress: 'tez',
      metadata: {
        decimals: 6,
        name: 'Tezos',
        symbol: 'TEZ',
        thumbnailUri: 'https://ipfs.io/ipfs/Qmf3brydfr8c6CKGUUu73Dd7wfBw66Zbzof5E1BWGeU222',
      },
    },
    {
      network: 'mainnet',
      type: 'fa1.2',
      contractAddress: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
      metadata: {
        decimals: 18,
        symbol: 'KUSD',
        name: 'Kolibri',
        thumbnailUri: 'https://kolibri-data.s3.amazonaws.com/logo.png',
      },
    },
    {
      network: 'mainnet',
      type: 'fa1.2',
      contractAddress: 'KT1VYsVfmobT7rsMVivvZ4J8i3bPiqz12NaH',
      metadata: {
        decimals: 6,
        symbol: 'wXTZ',
        name: 'Wrapped Tezos',
        thumbnailUri: 'https://raw.githubusercontent.com/StakerDAO/wrapped-xtz/dev/assets/wXTZ-token-FullColor.png',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT1REEb5VxWRjcHm5GzDMwErMmNFftsE5Gpf',
      fa2TokenId: 0,
      metadata: {
        decimals: 6,
        symbol: 'USDS',
        name: 'Stably USD',
        thumbnailUri: 'https://quipuswap.com/tokens/stably.png',
      },
    },
    {
      network: 'mainnet',
      type: 'fa1.2',
      contractAddress: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
      metadata: {
        decimals: 8,
        symbol: 'tzBTC',
        name: 'tzBTC',
        thumbnailUri: 'https://tzbtc.io/wp-content/uploads/2020/03/tzbtc_logo_single.svg',
      },
    },
    {
      network: 'mainnet',
      type: 'fa1.2',
      contractAddress: 'KT1AEfeckNbdEYwaMKkytBwPJPycz7jdSGea',
      metadata: {
        decimals: 18,
        symbol: 'STKR',
        name: 'Staker Governance Token',
        thumbnailUri: 'https://github.com/StakerDAO/resources/raw/main/stkr.png',
      },
    },
    {
      network: 'mainnet',
      type: 'fa1.2',
      contractAddress: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
      metadata: {
        decimals: 6,
        symbol: 'USDtz',
        name: 'USDtez',
        thumbnailUri: 'https://quipuswap.com/tokens/usdtz.png',
      },
    },
    {
      network: 'mainnet',
      type: 'fa1.2',
      contractAddress: 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8',
      metadata: {
        decimals: 18,
        symbol: 'ETHtz',
        name: 'ETHtez',
        thumbnailUri: 'https://quipuswap.com/tokens/ethtz.png',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW',
      fa2TokenId: 0,
      metadata: {
        name: 'hic et nunc DAO',
        symbol: 'hDAO',
        decimals: 6,
        thumbnailUri: 'ipfs://QmPfBrZiRsC39S2VvNbhuxH9HnNcSx8aef9uBCG51J5c4e',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd',
      fa2TokenId: 0,
      metadata: {
        name: 'Wrap Governance Token',
        symbol: 'WRAP',
        decimals: 8,
        thumbnailUri: 'ipfs://Qma2o69VRZe8aPsuCUN1VRUE5k67vw2mFDXb35uDkqn17o',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng',
      fa2TokenId: 0,
      metadata: {
        name: 'CRUNCH',
        symbol: 'CRUNCH',
        decimals: 8,
        thumbnailUri: 'ipfs://bafybeienhhbxz53n3gtg7stjou2zs3lmhupahwovv2kxwh5uass3bc5xzq',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 0,
      metadata: {
        symbol: 'wAAVE',
        name: 'Wrapped AAVE',
        decimals: 18,
        thumbnailUri: 'ipfs://QmVUVanUUjHmgkjnUC6TVzG7pPz6iy7C8tnAoXNNpofYPg',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 1,
      metadata: {
        symbol: 'wBUSD',
        name: 'Wrapped BUSD',
        decimals: 18,
        thumbnailUri: 'ipfs://QmRB63vb8ThpmxHKF4An3XD8unHyCUuLYm5bZNhXwU4gAZ',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 2,
      metadata: {
        symbol: 'wCEL',
        name: 'Wrapped CEL',
        decimals: 4,
        thumbnailUri: 'ipfs://QmfNuyU3V6XeS9PgVXMDq4h5ux1VciUXtApP2ZGC4VSGLd',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 3,
      metadata: {
        symbol: 'wCOMP',
        name: 'Wrapped COMP',
        decimals: 18,
        thumbnailUri: 'ipfs://QmYy2jUUE69W5eE9uwh4x5LqUxHt3GVy8sjXHhpViqCspG',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 4,
      metadata: {
        symbol: 'wCRO',
        name: 'Wrapped CRO',
        decimals: 8,
        thumbnailUri: 'ipfs://QmUuhxgCm2EXwddpU8ofBBh9z1qzxf2BJRbxxR1ebYr8Hd',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 5,
      metadata: {
        symbol: 'wDAI',
        name: 'Wrapped DAI',
        decimals: 18,
        thumbnailUri: 'ipfs://QmVov6RtfRNzuQGvGKmhnABUsfCiDKvn31amg8DUxzowtM',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 6,
      metadata: {
        symbol: 'wFTT',
        name: 'Wrapped FTT',
        decimals: 18,
        thumbnailUri: 'ipfs://QmVBjgrJiUynv72MR6rRyUu1WLKX52bWGiKk7H2CaFDRNW',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 7,
      metadata: {
        symbol: 'wHT',
        name: 'Wrapped HT',
        decimals: 18,
        thumbnailUri: 'ipfs://Qmayt4JbYTkQinNUeVGLhp51LTRMD1273HRgo9p96SoQaM',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 8,
      metadata: {
        symbol: 'wHUSD',
        name: 'Wrapped HUSD',
        decimals: 8,
        thumbnailUri: 'ipfs://QmT9bozupnmWjmjnXp8KcZqDY9HYLLr5KgojfxqgoWRgCt',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 9,
      metadata: {
        symbol: 'wLEO',
        name: 'Wrapped LEO',
        decimals: 18,
        thumbnailUri: 'ipfs://QmPrmELnhSoheHCHx6XcjSera7f89NYmXabBnSRSCdDjBh',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 10,
      metadata: {
        symbol: 'wLINK',
        name: 'Wrapped LINK',
        decimals: 18,
        thumbnailUri: 'ipfs://QmeaRuB578Xgy8jxbTxqmQ9s5wyioAEP85V7qbJFnn2uT8',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 11,
      metadata: {
        symbol: 'wMATIC',
        name: 'Wrapped MATIC',
        decimals: 18,
        thumbnailUri: 'ipfs://QmchBnjRjpweznHes7bVKHwgzd8D6Q7Yzwf6KmA4KS6Dgi',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 12,
      metadata: {
        symbol: 'wMKR',
        name: 'Wrapped MKR',
        decimals: 18,
        thumbnailUri: 'ipfs://QmPTob6YP9waErN4gMXqHg6ZyazSFB9CEojot4BB2XPpZJ',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 13,
      metadata: {
        symbol: 'wOKB',
        name: 'Wrapped OKB',
        decimals: 18,
        thumbnailUri: 'ipfs://QmPpmuLw4i9qJLMmGjXrGxrcPBwTiNZgLGuh7kYXeyTdyA',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 14,
      metadata: {
        symbol: 'wPAX',
        name: 'Wrapped PAX',
        decimals: 18,
        thumbnailUri: 'ipfs://QmZD5QDAeAUyyLYKiMmxD4vfWpVeYHctcbTkPmo4NudDHt',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 15,
      metadata: {
        symbol: 'wSUSHI',
        name: 'Wrapped SUSHI',
        decimals: 18,
        thumbnailUri: 'ipfs://QmTpss9a4uL3op7x5Lte7CcTKUSUhZsM1Gr34BWNvZCfy4',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 16,
      metadata: {
        symbol: 'wUNI',
        name: 'Wrapped UNI',
        decimals: 18,
        thumbnailUri: 'ipfs://QmQBezdVvotCGnFHgQNKduLdxEJhfgruSEqtwnWY7mESb2',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 17,
      metadata: {
        symbol: 'wUSDC',
        name: 'Wrapped USDC',
        decimals: 6,
        thumbnailUri: 'ipfs://QmQfHU9mYLRDU4yh2ihm3zrvVFxDrLPiXNYtMovUQE2S2t',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 18,
      metadata: {
        symbol: 'wUSDT',
        name: 'Wrapped USDT',
        decimals: 6,
        thumbnailUri: 'ipfs://QmVbiHa37pe2U9FfXBYfvrLNpb38rbXwaN19HwZD2speFA',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 19,
      metadata: {
        symbol: 'wWBTC',
        name: 'Wrapped WBTC',
        decimals: 8,
        thumbnailUri: 'ipfs://Qmdj6n9T48LDWex8NkBMKUQJfZgardxZVdtRRibYQVzLCJ',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      fa2TokenId: 20,
      metadata: {
        symbol: 'wWETH',
        name: 'Wrapped WETH',
        decimals: 18,
        thumbnailUri: 'ipfs://Qmezz1ztvo5JFshHupBEdUzVppyMfJH6K4kPjQRSZp8cLq',
      },
    },
    {
      network: 'mainnet',
      type: 'fa1.2',
      contractAddress: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
      metadata: {
        symbol: 'PLENTY',
        name: 'Plenty DAO',
        decimals: 18,
        thumbnailUri: 'https://raw.githubusercontent.com/Plenty-DeFi/Plenty-Logo/main/PlentyTokenIcon.png',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      fa2TokenId: 0,
      contractAddress: 'KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT',
      metadata: {
        symbol: 'KALAM',
        name: 'Kalamint',
        decimals: 10,
        thumbnailUri: 'ipfs://Qme9FX9M7o2PZt9h6rvkUbfXoLpQr1HsuMQi6sL5Y75g3A',
      },
    },
    {
      network: 'mainnet',
      type: 'fa2',
      fa2TokenId: 0,
      contractAddress: 'KT1XPFjZqCULSnqfKaaYy8hJjeY63UNSGwXg',
      metadata: {
        symbol: 'crDAO',
        name: 'Crunchy DAO',
        decimals: 8,
        thumbnailUri: 'ipfs://bafybeigulbzm5x72qtmckxqvd3ksk6q3vlklxjgpnvvnbcofgdp6qwu43u',
      },
    },
    {
      network: 'mainnet',
      type: 'fa1.2',
      contractAddress: 'KT1TwzD6zV3WeJ39ukuqxcfK2fJCnhvrdN1X',
      metadata: {
        symbol: 'SMAK',
        name: 'Smartlink',
        decimals: 3,
        thumbnailUri: 'ipfs://QmU2C4jU154nwA71AKHeiEj79qe7ZQC4Mf7AeUj5ALXZfe',
      },
    },
  ];

  const pools = tokens.map((x) => (x.contractAddress === TEZOS_TOKEN.contractAddress
    ? { token1: x, token2: STABLE_TOKEN }
    : { token1: x, token2: TEZOS_TOKEN }));

  const farms = tokens.map((x) => (x.contractAddress === TEZOS_TOKEN.contractAddress
    ? { tokenPair: { token1: x, token2: STABLE_TOKEN } }
    : { tokenPair: { token1: x, token2: TEZOS_TOKEN } }));
  const transactions : TransactionType[] = [
    {
      from: TEZOS_TOKEN, to: STABLE_TOKEN, id: '0', action: 'swap',
    },
    {
      from: TEZOS_TOKEN, to: STABLE_TOKEN, id: '1', action: 'swap',
    },
    {
      from: TEZOS_TOKEN, to: STABLE_TOKEN, id: '2', action: 'swap',
    },
    {
      from: TEZOS_TOKEN, to: STABLE_TOKEN, id: '3', action: 'swap',
    },
    {
      from: TEZOS_TOKEN, to: STABLE_TOKEN, id: '4', action: 'swap',
    },
  ];

  return (
    <>
      <div className={s.portfolio}>
        <Card
          className={cx(s.portfolioCard, themeClass[colorThemeMode])}
        >
          <CardContent className={s.container}>
            <Tabs
              values={TabsContent}
              activeId={tabsState}
              setActiveId={(val) => setTabsState(val)}
              className={s.govTabs}
            />
            <PieChart
              alignCenter
              data={[
                { value: 2, color: '#1373E4', label: 'Token A' },
                { value: 4, color: '#2ED33E', label: 'Token B' },
                { value: 6, color: '#F9A605', label: 'Token C' },
                { value: 8, color: '#EA2424', label: 'Token D' },
                { value: 10, color: '#A1A4B1', label: 'Token E' },
              ]}
              legendPlacement="right"
              legend
              legendMarks
            />
          </CardContent>
        </Card>
        <Card
          className={cx(s.portfolioCard, themeClass[colorThemeMode])}
        >
          <CardContent className={s.container}>
            <Tabs
              values={TabsContent}
              activeId={tabsState}
              setActiveId={(val) => setTabsState(val)}
              className={s.govTabs}
            />
            <PieChart
              alignCenter
              data={[
                { value: 2, color: '#1373E4', label: 'Token A' },
                { value: 4, color: '#2ED33E', label: 'Token B' },
                { value: 6, color: '#F9A605', label: 'Token C' },
                { value: 8, color: '#EA2424', label: 'Token D' },
                { value: 10, color: '#A1A4B1', label: 'Token E' },
              ]}
              legendPlacement="right"
              legend
              legendMarks
            />
          </CardContent>
        </Card>
      </div>
      {tokens.length > 0 && (<TokenTable header="Your Tokens" outerHeader data={[]} />)}
      {pools.length > 0 && (
        <PoolTable
          header="Pools Invested"
          outerHeader
          data={[]}
        />
      )}
      {farms.length > 0 && (<FarmTable header="Joined Farms" outerHeader data={[]} />)}
      {transactions.length > 0 && (<TransactionTable header="Transactions History" outerHeader data={[]} />)}
    </>
  );
};
