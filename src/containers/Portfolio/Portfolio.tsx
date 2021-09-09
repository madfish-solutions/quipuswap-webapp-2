import React, { useContext, useState } from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { TransactionType, WhitelistedFarm, WhitelistedTokenPair } from '@utils/types';
import { useTokens } from '@utils/dapp';
import { Tabs } from '@components/ui/Tabs';
import { Card, CardContent } from '@components/ui/Card';
import {
  FarmTable, PoolTable, TokenTable, TransactionTable,
} from '@components/portfolio/PortfolioTable';

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

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Portfolio: React.FC<{}> = () => {
  const [tabsState, setTabsState] = useState(TabsContent[0].id);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { data: tokens } = useTokens();

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
        <Card>
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
      {tokens.length > 0 && (<TokenTable header="Your Tokens" outerHeader data={tokens} />)}
      {pools.length > 0 && (
        <PoolTable
          header="Pools Invested"
          outerHeader
          data={pools as WhitelistedTokenPair[]}
        />
      )}
      {farms.length > 0 && (<FarmTable header="Joined Farms" outerHeader data={farms as WhitelistedFarm[]} />)}
      {transactions.length > 0 && (<TransactionTable header="Transactions History" outerHeader data={transactions} />)}
    </>
  );
};

export const PortfolioTokens: React.FC<{}> = () => {
  const { data: tokens } = useTokens();
  return (
    <TokenTable header="Your Tokens" data={tokens} />
  );
};

export const PortfolioPools: React.FC<{}> = () => {
  const { data: tokens } = useTokens();
  const pools = tokens.map((x) => (x.contractAddress === TEZOS_TOKEN.contractAddress
    ? { token1: x, token2: STABLE_TOKEN }
    : { token1: x, token2: TEZOS_TOKEN }));
  return (
    <PoolTable
      header="Pools Invested"
      data={pools as WhitelistedTokenPair[]}
    />
  );
};

export const PortfolioFarms: React.FC<{}> = () => {
  const { data: tokens } = useTokens();
  const farms = tokens.map((x) => (x.contractAddress === TEZOS_TOKEN.contractAddress
    ? { tokenPair: { token1: x, token2: STABLE_TOKEN } }
    : { tokenPair: { token1: x, token2: TEZOS_TOKEN } }));
  return (
    <FarmTable header="Joined Farms" data={farms as WhitelistedFarm[]} />
  );
};

export const PortfolioTransactions: React.FC<{}> = () => {
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
    <TransactionTable header="Transactions History" data={transactions} />
  );
};
