import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { WhitelistedBaker } from '@utils/types';
// import { TokensLogos } from '@components/ui/TokensLogos';
import Token from '@icons/Token.svg';

import s from './ModalCell.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type BakerCellProps = {
  baker?: WhitelistedBaker,
  loading?: boolean
};
export const BakerCell: React.FC<BakerCellProps> = ({
  baker,
  loading = false,
}) => {
  const { t } = useTranslation(['baker']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(
    modeClass[colorThemeMode],
    loading && s.loading,
    s.listItem,
  );

  const loadingLogoClassName = cx(s.bakerFlexCell, loading ? s.loadingLogos : '');
  // const loadingNameClassName = loading ? s.loadingName : '';
  // const loadginSymbolClassName = loading ? s.loadingSymbol : '';
  // const loadingBageClassName = loading ? s.loadingBage : '';

  return (
    <div className={compoundClassName}>
      {/* ANOTHER VARIANT */}
      {/* <TokensLogos
        className={loadingLogoClassName}
      /> */}
      <div className={loadingLogoClassName}>
        <Token />
        <h6 className={s.h6}>{baker?.name ?? baker?.contractAddress}</h6>
      </div>
      <div className={s.bakerFlexCell}>
        <div>
          <div className={s.caption}>
            {t('baker:Votes')}
            :
          </div>
          <div className={s.label1}>{baker?.votes}</div>
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
            TEZ
          </span>
        </div>
      </div>
    </div>
  );
};
