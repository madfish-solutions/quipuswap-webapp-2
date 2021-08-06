import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { transformTezToKTez } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { WhitelistedBaker } from '@utils/types';

import { BakerLogos } from '@components/ui/BakerLogos';
import s from './ModalCell.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type BakerCellProps = {
  baker: WhitelistedBaker,
  tabIndex?: number,
  onClick?: () => void,
};
export const BakerCell: React.FC<BakerCellProps> = ({
  baker,
  onClick,
  tabIndex,
}) => {
  const { t } = useTranslation(['baker']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(
    modeClass[colorThemeMode],
    s.listItem,
  );

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyUp={(e) => {
        if (e.key === 'Enter' && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={compoundClassName}
    >
      <div className={s.bakerFlexCell}>
        <BakerLogos baker={baker} />
        <h6 className={s.h6}>{baker?.name ?? baker?.address}</h6>
      </div>
      <div className={s.bakerFlexCell}>
        <div className={s.bakerBlock}>
          <div className={s.caption}>
            {t('baker:Fee')}
            :
          </div>
          <div className={s.label1}>
            {baker.fee}
            {' '}
            %
          </div>
        </div>
        <div className={s.bakerBlock}>
          <div className={s.caption}>
            {t('baker:Space')}
            :
          </div>
          <div>
            <span className={s.label1}>
              {transformTezToKTez(baker.freeSpace.toString() ?? '')}
              K
            </span>
            {' '}
            <span className={s.bodyTextLink1}>
              TEZ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
