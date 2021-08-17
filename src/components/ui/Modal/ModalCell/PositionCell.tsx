import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import Token from '@icons/Token.svg';

import s from './ModalCell.module.sass';

type PositionCellProps = {
  token1?: any,
  token2?: any,
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PositionCell: React.FC<PositionCellProps> = ({
  token1,
  token2,
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(
    modeClass[colorThemeMode],
    s.listItem,
    s.clickable,
    s.hover,
  );

  return (
    <div className={compoundClassName}>
      <div className={s.positionBlockCell}>
        <div className={s.tokenGroup}>
          <Token className={s.tokenItem} />
          <Token className={s.tokenItem} />
        </div>
        <div className={s.mleft8}>
          <h6>
            {token1?.name}
            /
            {token2?.name}
          </h6>

        </div>
      </div>
      <div className={cx(s.joinRow, s.centerRow)}>
        <div>
          <div className={s.caption}>
            {t('common:LP in Votes')}
            :
          </div>
          <span className={s.label1}>{token1?.vote}</span>
        </div>
        <div className={s.mleft24}>
          <div className={s.caption}>
            {t('common:LP in Veto')}
            :
          </div>
          <span className={s.label1}>{token1?.veto}</span>
        </div>
        <div className={s.mleft24}>
          <div className={s.caption}>
            {t('common:Total Balance')}
            :
          </div>
          <span className={s.label1}>{token1?.balance}</span>
        </div>
      </div>
    </div>
  );
};
