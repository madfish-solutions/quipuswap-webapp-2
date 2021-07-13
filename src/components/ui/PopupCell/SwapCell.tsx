import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import React from 'react';

import s from './PopupCell.module.sass';

type SwapCellProps = {
  transaction?: any,
};
export const SwapCell: React.FC<SwapCellProps> = ({
  transaction,
}) => {
  const { t } = useTranslation(['common']);
  return (
    <div
      className={s.swapCell}
    >
      <caption>{new Date(transaction?.date).toISOString()}</caption>
      <div className={s.swapFrom}>
        <span className={cx(s.label1, s.swapLabel)}>{t('common:Swap')}</span>
        <span className={s.label1}>{transaction?.fromValue}</span>
        <span className={s.swapLink}>{transaction?.fromCurrency}</span>
      </div>
      <div className={s.swapTo}>
        <span className={cx(s.label1, s.swapLabel)}>{t('common:to')}</span>
        <span className={s.label1}>{transaction?.toValue}</span>
        <span className={s.swapLink}>{transaction?.toCurrency}</span>
      </div>
    </div>
  );
};
