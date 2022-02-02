import React, { useContext } from 'react';

import cx from 'classnames';

import { ExternalLink } from '@components/svg/ExternalLink';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './ModalCell.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface SwapCellProps {
  // eslint-disable-next-line
  transaction?: any;
}

export const SwapCell: React.FC<SwapCellProps> = ({ transaction }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], s.listItem, s.splitRow, s.centerRow)}>
      <div>
        <div className={s.caption}>{new Date(transaction?.date).toISOString()}</div>
        <div className={cx(s.joinRow, s.centerRow, s.swapFrom)}>
          <div className={cx(s.label1, s.swapLabel)}>Swap</div>
          <div className={cx(s.centerLabel, s.label1)}>{transaction?.fromValue}</div>
          <div className={s.swapLink}>{transaction?.fromCurrency}</div>
        </div>
        <div className={cx(s.joinRow, s.centerRow, s.swapTo)}>
          <div className={cx(s.label1, s.swapLabel)}>to</div>
          <div className={cx(s.centerLabel, s.label1)}>{transaction?.toValue}</div>
          <div className={s.swapLink}>{transaction?.toCurrency}</div>
        </div>
      </div>
      <ExternalLink className={s.clickable} />
    </div>
  );
};
