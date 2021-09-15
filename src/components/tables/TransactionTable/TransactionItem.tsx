import React, { useContext } from 'react';
import cx from 'classnames';
import { TransactionType } from '@utils/types';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '../Table.module.sass';

type TransactionItemProps = {
  transaction: TransactionType
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  return (
    <tr>
      <td className={cx(s.tableRow, s.poolRow, s.tableHeader, modeClass[colorThemeMode])}>
        <div className={cx(s.links, s.cardCellItem, s.maxWidth, s.cardCellText)}>
          {transaction.action}
          <Button className={s.currency} theme="underlined">
            {getWhitelistedTokenSymbol(transaction.from)}
          </Button>
          to
          <Button className={s.currency} theme="underlined">
            {getWhitelistedTokenSymbol(transaction.to)}
          </Button>
        </div>
        <div className={s.cardCellItem}>
          <CurrencyAmount amount="888888888888888.00" />
        </div>
        <div className={s.cardCellItem}>
          <CurrencyAmount amount="888888888888888.00" currency={getWhitelistedTokenSymbol(transaction.from)} />
        </div>
        <div className={s.cardCellItem}>
          <CurrencyAmount amount="888888888888888.00" currency={getWhitelistedTokenSymbol(transaction.to)} />
        </div>
        <div className={cx(s.links, s.cardCellItem, s.blockItem)}>
          <Button
            theme="inverse"
            icon={<ExternalLink />}
            className={s.linkIcon}
          >
            5/25/2021 3:00:51 PM
          </Button>
        </div>
      </td>
    </tr>
  );
};
