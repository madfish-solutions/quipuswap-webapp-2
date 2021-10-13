import React, { useContext, useState, useMemo } from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import { useGetTokensPairsLazyQuery } from '@graphql';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { TransactionType, WhitelistedFarm } from '@utils/types';
import { useTokens } from '@utils/dapp';
import { Tabs } from '@components/ui/Tabs';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { PoolTable } from '@components/tables/PoolTable';
import { FarmTable } from '@components/tables/FarmTable';
import { TokenTable } from '@components/tables/TokenTable';
import { TransactionTable } from '@components/tables/TransactionTable';
import { Section } from '@components/home/Section';
import { transformNodeToWhitelistedToken } from '@utils/helpers/transformNodeToWhitelistedToken';
import { Token } from 'graphql';
import s from './Portfolio.module.sass';
import { PortfolioData } from './content';
import { PortfolioCard } from './PortfolioCard';

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

const MobTabsContent = [
  {
    id: 'tokens',
    label: 'Tokens',
  },
  {
    id: 'pools',
    label: 'Pools',
  },
  {
    id: 'farms',
    label: 'Farms',
  },
  {
    id: 'transactions',
    label: 'Transactions',
  },
];

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const whitelistedTokens = [
  {
    type: TEZOS_TOKEN.type,
    contractAddress: TEZOS_TOKEN.contractAddress,
    fa2TokenId: TEZOS_TOKEN.fa2TokenId,
    metadata: TEZOS_TOKEN.metadata,
  },
  {
    type: STABLE_TOKEN.type,
    contractAddress: STABLE_TOKEN.contractAddress,
    fa2TokenId: STABLE_TOKEN.fa2TokenId,
    metadata: STABLE_TOKEN.metadata,
  },
];

export const Portfolio: React.FC<{}> = () => {
  const [tabsState, setTabsState] = useState(TabsContent[0].id);
  const [mobTabsState, setMobTabsState] = useState(MobTabsContent[0].id);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { data: tokens } = useTokens();
  const [fetchPairsData, { loading, data, error }] = useGetTokensPairsLazyQuery();

  const pairData = useMemo(() => data?.pairs?.edges.map((x) => {
    const t1 = (x && x.node && x.node.token1) as Token;
    const t2 = (x && x.node && x.node.token2) as Token;
    return ({
      token1: transformNodeToWhitelistedToken(t1),
      token2: transformNodeToWhitelistedToken(t2),
      xtzUsdQuote: data?.overview.xtzUsdQuote,
      pair: {
        name: `${prepareTokenName(t1)} / ${prepareTokenName(t2)}`,
        token1: x?.node?.token1,
        token2: x?.node?.token2,
      },
      data: {
        tvl: x?.node?.liquidity,
        volume24h: x?.node?.volume24h,
      },
      buttons: {
        first: {
          label: t('home|Analytics'),
          href: `https://analytics.quipuswap.com/pairs/${x?.node?.id}`,
          external: true,
        },
        second: {
          label: t('home|Trade'),
          href: `/swap/${x?.node?.token1.id}-${x?.node?.token2.id}`,
        },
      },
    });
  }), [data, t]);

  const isNotLoaded = error || (!loading && !data) || data === undefined || !data.pairs;

  const pools = whitelistedTokens.map((x) => (x.contractAddress === TEZOS_TOKEN.contractAddress
    ? { token1: x, token2: STABLE_TOKEN }
    : { token1: x, token2: TEZOS_TOKEN }));

  const farms = whitelistedTokens.map((x) => (x.contractAddress === TEZOS_TOKEN.contractAddress
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

  const currentTab = useMemo(
    () => (MobTabsContent.find(({ id }) => id === mobTabsState)!),
    [mobTabsState],
  );

  return (
    <>
      <div className={s.portfolio}>
        <Card
          className={cx(s.portfolioCard, themeClass[colorThemeMode])}
        >
          <CardHeader
            header={{
              content: (<Tabs
                values={TabsContent}
                activeId={tabsState}
                setActiveId={(val) => setTabsState(val)}
                className={s.govTabs}
              />),
            }}
            className={s.header}
          />
          <CardContent className={s.container}>
            <PieChart
              className={s.chart}
              legendClassName={s.chartPad}
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
        <Card className={s.portfolioCard}>
          <CardContent className={s.content}>
            {
            PortfolioData.map(({
              id, volume, label, currency,
            }) => (
              <PortfolioCard
                key={id}
                className={cx(s.card, themeClass[colorThemeMode])}
                volume={volume}
                label={label}
                currency={currency}
              />
            ))
        }
          </CardContent>
        </Card>
      </div>
      <div className={s.notMobile}>
        {whitelistedTokens.length > 0 && (
          <>
            <h1 className={s.h1}>
              Your Tokens
            </h1>
            <TokenTable data={whitelistedTokens} />
          </>
        )}
        {pools.length > 0 && (
          <>
            <Section className={s.h1} header="Pools Invested">
              <PoolTable
                fetch={fetchPairsData}
                loading={!!isNotLoaded}
                totalCount={data?.pairs?.totalCount ?? 0}
                data={isNotLoaded ? [] : pairData as any}
              />
            </Section>
          </>
        )}
        {farms.length > 0 && (
          <>
            <h1 className={s.h1}>
              Joined Farms
            </h1>
            <FarmTable data={farms as WhitelistedFarm[]} />
          </>
        )}
        {transactions.length > 0 && (
          <>
            <h1 className={s.h1}>
              Transactions History
            </h1>
            <TransactionTable data={transactions} />
          </>
        )}
      </div>
      {/* MOBILE */}
      <div className={s.mobile}>
        <div className={cx(s.fullWidth, s.governTabs)}>
          <div className={cx(s.govCard)}>
            <Card
              className={cx(s.govCardInner)}
            >
              <CardContent className={s.tabContent}>
                <Tabs
                  values={MobTabsContent}
                  activeId={mobTabsState}
                  setActiveId={(val) => setMobTabsState(val)}
                  className={s.govTabs}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        {currentTab.id === 'tokens' && (<TokenTable data={tokens} />)}
        {currentTab.id === 'pools' && (<PoolTable data={farms as WhitelistedFarm[]} />)}
        {currentTab.id === 'farms' && (<FarmTable data={farms as WhitelistedFarm[]} />)}
        {currentTab.id === 'transactions' && (<TransactionTable data={transactions} />)}
      </div>
    </>
  );
};
