import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { WhitelistedToken } from '@utils/types';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Tabs } from '@components/ui/Tabs';
import { RefreshToggle } from '@components/common/RefreshToggle';

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
  toggle?: () => void
};

export const PairChartInfo: React.FC<PairChartType> = ({
  token1 = TEZOS_TOKEN,
  token2 = STABLE_TOKEN,
  hidePeriods = false,
  toggle,
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
        {toggle && (<RefreshToggle onClick={toggle} />)}
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
