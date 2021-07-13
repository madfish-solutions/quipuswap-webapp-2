import React from 'react';

import s from './PopupCell.module.sass';

type SwapCellProps = {
  transaction?: any,
};
export const SwapCell: React.FC<SwapCellProps> = ({
  transaction,
}) => (
  <div
    className={s.swapCell}
  >
    <caption>{new Date(transaction?.date).toISOString()}</caption>
    <div className={s.swapFrom}>
      <span className={s.label1}>Swap</span>
      <span className={s.label1}>{transaction?.fromValue}</span>
      <span className={s.bodyTextLink1}>{transaction?.fromCurrency}</span>
    </div>
    <div className={s.swapTo}>
      <span className={s.label1}>to</span>
      <span className={s.label1}>{transaction?.toValue}</span>
      <span className={s.bodyTextLink1}>{transaction?.toCurrency}</span>
    </div>
  </div>
);
