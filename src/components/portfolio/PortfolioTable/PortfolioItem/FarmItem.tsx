import React from 'react';
import cx from 'classnames';
import { WhitelistedFarm } from '@utils/types';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { STABLE_TOKEN } from '@utils/defaults';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { ArrowDown } from '@components/svg/ArrowDown';

import s from '../PortfolioTable.module.sass';

type FarmItemProps = {
  farm: WhitelistedFarm
};

export const FarmItem: React.FC<FarmItemProps> = ({
  farm,
}) => (
  <tr>
    <td className={cx(s.tableRow, s.farmRow, s.tableHeader)}>
      <div className={cx(s.links, s.cardCellItem, s.maxWidth, s.wideItem, s.cardCellText)}>
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
      <div className={s.cardCellItem}>
        <CurrencyAmount amount="888888888888888.00" />
      </div>
      <div className={s.cardCellItem}>
        <CurrencyAmount amount="888888888888888.00" currency="$" />
      </div>
      <div className={s.cardCellItem}>
        <CurrencyAmount amount="888888888888888.00" currency="$" />
      </div>
      <div className={cx(s.links, s.cardCellItem)}>
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
    </td>
  </tr>
);
