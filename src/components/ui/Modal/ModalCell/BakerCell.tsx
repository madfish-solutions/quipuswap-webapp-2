import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import Token from '@icons/Token.svg';

import s from './ModalCell.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type BakerCellProps = {
  baker?: any,
};
export const BakerCell: React.FC<BakerCellProps> = ({
  baker,
}) => {
  const { t } = useTranslation(['baker']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  return (
    <div className={cx(modeClass[colorThemeMode], s.listItem)}>
      <div className={s.bakerFlexCell}>
        <Token />
        <h6 className={s.h6}>{baker.token}</h6>
      </div>
      <div className={s.bakerFlexCell}>
        <div>
          <div className={s.caption}>
            {t('baker:Votes')}
            :
          </div>
          <div className={s.label1}>{baker.votes}</div>
        </div>
      </div>
      <div className={s.bakerFlexCell}>
        <div className={s.bakerBlock}>
          <div className={s.caption}>
            {t('baker:Fee')}
            :
          </div>
          <div className={s.label1}>
            {baker?.fee}
            {' '}
            %
          </div>
        </div>
        <div className={s.bakerBlock}>
          <div className={s.caption}>
            {t('baker:Space')}
            :
          </div>
          <span className={s.label1}>{baker?.space}</span>
          {' '}
          <span className={s.bodyTextLink1}>
            {baker?.currency}
          </span>
        </div>
      </div>
    </div>
  );
};
