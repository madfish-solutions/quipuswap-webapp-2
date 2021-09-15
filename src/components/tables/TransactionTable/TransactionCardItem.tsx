import React, { useContext } from 'react';
import cx from 'classnames';
import { TransactionType } from '@utils/types';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '../Card.module.sass';

type TransactionCardItemProps = {
  transaction: TransactionType
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TransactionCardItem: React.FC<TransactionCardItemProps> = ({
  transaction,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  return (
    <div className={cx(modeClass[colorThemeMode], s.card)}>
      <Button
        icon={
          <ExternalLink id={transaction.id} />
        }
        theme="clean"
        className={cx(s.cardCellItem, s.maxWidth, s.cardCellText, s.tokenLogoBlock)}
      >
        <div className={s.links}>
          {transaction.action}
          <Button className={s.currency} theme="underlined">
            {getWhitelistedTokenSymbol(transaction.from)}
          </Button>
          to
          <Button className={s.currency} theme="underlined">
            {getWhitelistedTokenSymbol(transaction.to)}
          </Button>
        </div>
      </Button>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div>Total Value</div>
        <CurrencyAmount amount="888888888888888.00" currency="$" />
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div>Token A Amount</div>
        <CurrencyAmount amount="888888888888888.00" currency={getWhitelistedTokenSymbol(transaction.from)} />
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div>Token B Amount</div>
        <CurrencyAmount amount="888888888888888.00" currency={getWhitelistedTokenSymbol(transaction.to)} />
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div>Time</div>
        <div className={s.time}>5/25/2021 3:00:51 PM</div>
      </div>
    </div>
  );
};
