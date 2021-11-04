import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Button, TokensLogos, Tabs } from '@madfish-solutions/quipu-ui-kit';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedToken } from '@utils/types';
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

type PairChartType = {
  token1?: WhitelistedToken
  token2?: WhitelistedToken
  hidePeriods?: boolean
};

export const PairChartInfo: React.FC<PairChartType> = ({
  token1 = TEZOS_TOKEN,
  token2 = STABLE_TOKEN,
  hidePeriods = false,
}) => {
  const [timeFrame, setTimeFrame] = useState(TimeFrameTabs[0].id);
  const { t } = useTranslation(['common']);
  return (
    <div className={s.headerContent}>
      <div className={s.tokensInfo}>
        <TokensLogos token1={token1} token2={token2} />
        { getWhitelistedTokenSymbol(token1) }
        /
        { getWhitelistedTokenSymbol(token2) }
        <Button theme="quaternary">
          <Refresh />
        </Button>
      </div>
      {!hidePeriods && (
      <div className={s.timeFrames}>
        <Tabs
          values={TimeFrameTabs.map((tab) => ({ ...tab, label: t(tab.label) }))}
          activeId={timeFrame}
          setActiveId={(id) => setTimeFrame(id)}
          withUnderline={false}
        />
      </div>
      )}
    </div>
  );
};
