import React, { useContext } from 'react';
import Token from '@icons/Token.svg';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import cx from 'classnames';

import { useTranslation } from 'next-i18next';
import s from './Modal.module.sass';

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
  return (
    <div className={cx(modeClass[colorThemeMode], s.listItem)}>
      <div className={s.positionBlockCell}>
        <div className={s.tokenGroup}>
          <Token />
          <Token />
        </div>
        <div className={s.blockRow}>
          <h6>
            {token1?.name}
            /
            {token2?.name}
          </h6>

        </div>
      </div>
      <div className={s.positionFlexCell}>
        <div>
          <div className={s.caption}>
            {t('common:LP in Votes')}
            :
          </div>
          <span className={s.label1}>{token1?.vote}</span>
        </div>
        <div>
          <div className={s.caption}>
            {t('common:LP in Veto')}
            :
          </div>
          <span className={s.label1}>{token1?.veto}</span>
        </div>
        <div>
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
