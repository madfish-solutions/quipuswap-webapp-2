import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Button } from '@components/ui/Button';
import { Tabs } from '@components/ui/Tabs';
import { Refresh } from '@components/svg/Refresh';

import s from './PairChartInfo.module.sass';

const TimeFrameTabs = [
  {
    id: 'day',
    label: '1D',
  },
  {
    id: 'week',
    label: '1W',
  },
  {
    id: 'month',
    label: '1M',
  },
  {
    id: 'year',
    label: '1Y',
  },
];

export const PairChartInfo = () => {
  const [timeFrame, setTimeFrame] = useState(TimeFrameTabs[0].id);
  const { t } = useTranslation(['common']);
  return (
    <div className={s.headerContent}>
      <div className={s.tokensInfo}>
        <TokensLogos token1={STABLE_TOKEN} token2={STABLE_TOKEN} />
        { getWhitelistedTokenSymbol(TEZOS_TOKEN) }
        /
        { getWhitelistedTokenSymbol(STABLE_TOKEN) }
        <Button theme="quaternary">
          <Refresh />
        </Button>
      </div>
      <div className={s.timeFrames}>
        <Tabs
          values={TimeFrameTabs.map((tab) => ({ ...tab, label: t(tab.label) }))}
          activeId={timeFrame}
          setActiveId={(id) => setTimeFrame(id)}
          withUnderline={false}
        />
      </div>
    </div>
  );
};
