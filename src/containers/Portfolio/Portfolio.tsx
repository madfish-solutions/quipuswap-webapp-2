import React, { useContext, useState } from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useTokens } from '@utils/dapp';
import { Tabs } from '@components/ui/Tabs';
import { Card, CardContent } from '@components/ui/Card';
import { PortfolioTable } from '@components/portfolio/PortfolioTable';

import s from '@styles/CommonContainer.module.sass';

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
  const { data: tokens } = useTokens();

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
      <PortfolioTable header="Your Tokens" outerHeader data={tokens} />
      <PortfolioTable header="Pools Invested" outerHeader data={[]} />
      <PortfolioTable header="Joined Farms" outerHeader data={[]} />
      <PortfolioTable header="Transactions History" outerHeader data={[]} />
    </>
  );
};
