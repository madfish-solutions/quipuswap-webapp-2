import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import { WhitelistedToken } from '@utils/types';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Bage } from '@components/ui/Bage';

import s from './ModalCell.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const LoadingTokenCell: React.FC<{}> = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    modeClass[colorThemeMode],
    s.loading,
    s.listItem,
    s.splitRow,
  );

  return (
    <div
      className={compoundClassName}
    >
      <div className={s.joinRow}>
        <TokensLogos
          token1={{} as WhitelistedToken}
          className={s.loadingLogos}
        />
        <div className={s.mleft8}>
          <div className={s.joinRow}>
            <span className={s.loadingName} />
            <Bage
              className={s.loadingBage}
              text={'   '}
              loading
            />
          </div>
          <div className={s.loadingSymbol} />
        </div>
      </div>
    </div>
  );
};
