import React from 'react';
import cx from 'classnames';
import { WhitelistedFarm } from '@utils/types';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { STABLE_TOKEN } from '@utils/defaults';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { ArrowDown } from '@components/svg/ArrowDown';

import s from '../PortfolioCardTable.module.sass';

type FarmMobileItemProps = {
  farm: WhitelistedFarm
};

export const FarmMobileItem: React.FC<FarmMobileItemProps> = ({
  farm,
}) => (
  <div className={s.card}>
    <div className={cx(s.cardCellItem, s.cardCellText, s.tokenLogoBlock)}>
      <div className={s.links}>
        <TokensLogos
          token1={farm.tokenPair.token1}
          token2={farm.tokenPair.token2}
          className={s.tokenLogo}
        />
        {getWhitelistedTokenSymbol(farm.tokenPair.token1)}
        /
        {getWhitelistedTokenSymbol(farm.tokenPair.token2)}
        <ArrowDown className={s.arrow} />
        <TokensLogos
          token1={STABLE_TOKEN}
          className={s.tokenLogo}
        />
        {getWhitelistedTokenSymbol(STABLE_TOKEN)}
      </div>
    </div>
    <div className={cx(s.textItem, s.cardCellItem)}>
      <div>Your Share</div>
      <CurrencyAmount amount="888888888888888.00" currency="%" />
    </div>
    <div className={cx(s.textItem, s.cardCellItem)}>
      <div>Pending Rewards</div>
      <CurrencyAmount amount="888888888888888.00" currency={getWhitelistedTokenSymbol(STABLE_TOKEN)} />
    </div>
    <div className={cx(s.textItem, s.cardCellItem)}>
      <div>Total Value</div>
      <CurrencyAmount amount="888888888888888.00" currency="$" />
    </div>
    <div className={cx(s.links, s.cardCellItem, s.buttons)}>
      <Button
        theme="secondary"
        className={s.button}
      >
        Harvest
      </Button>
      <Button
        href="/stake"
        className={s.button}
      >
        Stake
      </Button>
    </div>
  </div>
);
