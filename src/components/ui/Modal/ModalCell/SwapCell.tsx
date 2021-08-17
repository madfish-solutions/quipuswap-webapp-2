import { useTranslation } from 'next-i18next';
import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from './ModalCell.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type SwapCellProps = {
  transaction?: any,
};

export const SwapCell: React.FC<SwapCellProps> = ({
  transaction,
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(
    modeClass[colorThemeMode],
    s.listItem,
    s.splitRow,
    s.centerRow,
    s.clickable,
    s.hover,
  );

  return (
    <div className={compoundClassName}>
      <div>
        <div className={s.caption}>{new Date(transaction?.date).toISOString()}</div>
        <div className={cx(s.joinRow, s.centerRow, s.swapFrom)}>
          <div className={cx(s.label1, s.swapLabel)}>{t('common:Swap')}</div>
          <div className={cx(s.centerLabel, s.label1)}>{transaction?.fromValue}</div>
          <div className={s.swapLink}>{transaction?.fromCurrency}</div>
        </div>
        <div className={cx(s.joinRow, s.centerRow, s.swapTo)}>
          <div className={cx(s.label1, s.swapLabel)}>{t('common:to')}</div>
          <div className={cx(s.centerLabel, s.label1)}>{transaction?.toValue}</div>
          <div className={s.swapLink}>{transaction?.toCurrency}</div>
        </div>
      </div>
      <ExternalLink className={s.clickable} />
    </div>
  );
};
