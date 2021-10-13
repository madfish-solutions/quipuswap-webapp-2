import React, { useContext, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import cx from 'classnames';

import { TransactionType } from '@utils/types';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { TransactionTable } from '@components/tables/TransactionTable';
import { FarmTable } from '@components/tables/FarmTable';
import { TokenTable } from '@components/tables/TokenTable';
import { InvestTable } from '@components/tables/InvestTable';
import { PortfolioData } from './content';
import { PortfolioCard } from './PortfolioCard';

import s from './Portfolio.module.sass';

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

const tokens = [
  {
    token: TEZOS_TOKEN,
    symbol: TEZOS_TOKEN.metadata.symbol,
  },
  {
    token: STABLE_TOKEN,
    symbol: STABLE_TOKEN.metadata.symbol,
  },
  {
    token: TEZOS_TOKEN,
    symbol: TEZOS_TOKEN.metadata.symbol,
  },
  {
    token: STABLE_TOKEN,
    symbol: STABLE_TOKEN.metadata.symbol,
  },
  {
    token: TEZOS_TOKEN,
    symbol: TEZOS_TOKEN.metadata.symbol,
  },
];

const invests = [
  {
    token1: TEZOS_TOKEN,
    token2: STABLE_TOKEN,
  },
  {
    token1: TEZOS_TOKEN,
    token2: STABLE_TOKEN,
  },
  {
    token1: TEZOS_TOKEN,
    token2: STABLE_TOKEN,
  },
  {
    token1: TEZOS_TOKEN,
    token2: STABLE_TOKEN,
  },
  {
    token1: TEZOS_TOKEN,
    token2: STABLE_TOKEN,
  },
];

const farms = [
  {
    remaining: Date.now(),
    tokenPair: {
      token1: TEZOS_TOKEN,
      token2: STABLE_TOKEN,
    },
    totalValueLocked: '888',
    apy: '888',
    daily: '888',
    balance: '888',
    deposit: '888',
    earned: '888',
    multiplier: '888',
    tokenContract: '#',
    farmContract: '#',
    projectLink: '#',
    analyticsLink: '#',
  },
  {
    remaining: Date.now(),
    tokenPair: {
      token1: TEZOS_TOKEN,
      token2: STABLE_TOKEN,
    },
    totalValueLocked: '888',
    apy: '888',
    daily: '888',
    balance: '888',
    deposit: '888',
    earned: '888',
    multiplier: '888',
    tokenContract: '#',
    farmContract: '#',
    projectLink: '#',
    analyticsLink: '#',
  },
  {
    remaining: Date.now(),
    tokenPair: {
      token1: TEZOS_TOKEN,
      token2: STABLE_TOKEN,
    },
    totalValueLocked: '888',
    apy: '888',
    daily: '888',
    balance: '888',
    deposit: '888',
    earned: '888',
    multiplier: '888',
    tokenContract: '#',
    farmContract: '#',
    projectLink: '#',
    analyticsLink: '#',
  },
  {
    remaining: Date.now(),
    tokenPair: {
      token1: TEZOS_TOKEN,
      token2: STABLE_TOKEN,
    },
    totalValueLocked: '888',
    apy: '888',
    daily: '888',
    balance: '888',
    deposit: '888',
    earned: '888',
    multiplier: '888',
    tokenContract: '#',
    farmContract: '#',
    projectLink: '#',
    analyticsLink: '#',
  },
  {
    remaining: Date.now(),
    tokenPair: {
      token1: TEZOS_TOKEN,
      token2: STABLE_TOKEN,
    },
    totalValueLocked: '888',
    apy: '888',
    daily: '888',
    balance: '888',
    deposit: '888',
    earned: '888',
    multiplier: '888',
    tokenContract: '#',
    farmContract: '#',
    projectLink: '#',
    analyticsLink: '#',
  },
];

const transactions: TransactionType[] = [
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

export const Portfolio: React.FC<{}> = () => {
  const [tabsState, setTabsState] = useState(TabsContent[0].id);
  const [mobTabsState, setMobTabsState] = useState(MobTabsContent[0].id);
  const { colorThemeMode } = useContext(ColorThemeContext);

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
        {tokens.length > 0 && (
          <>
            <h2 className={s.h1}>Your Tokens</h2>
            <TokenTable
              data={tokens}
              loading={false}
            />
          </>
        )}
        {invests.length > 0 && (
          <>
            <h2 className={s.h1}>Pools Invested</h2>
            <InvestTable
              data={invests}
              loading={false}
            />
          </>
        )}
        {farms.length > 0 && (
          <>
            <h2 className={s.h1}>Joined Farms</h2>
            <FarmTable
              data={farms}
              loading={false}
            />
          </>
        )}
        {transactions.length > 0 && (
          <>
            <h2 className={s.h1}>Transactions History</h2>
            <TransactionTable
              data={transactions}
              loading={false}
            />
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
        {currentTab.id === 'tokens' && (<TokenTable data={tokens} loading={false} />)}
        {currentTab.id === 'pools' && (<InvestTable data={invests} loading={false} />)}
        {currentTab.id === 'farms' && (<FarmTable data={farms} loading={false} />)}
        {currentTab.id === 'transactions' && (<TransactionTable data={transactions} loading={false} />)}
      </div>
    </>
  );
};
