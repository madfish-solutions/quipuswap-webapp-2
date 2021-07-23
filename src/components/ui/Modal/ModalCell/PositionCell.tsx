import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos, TokenType } from '@components/ui/TokensLogos';
import { WhitelistedTokenPair } from '@utils/types';

import s from './ModalCell.module.sass';

type PositionCellProps = {
  tokenPair: WhitelistedTokenPair
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PositionCell: React.FC<PositionCellProps> = ({
  tokenPair,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { token1, token2 } = tokenPair;
  const { name: name1, thumbnailUri: icon1 } = token1.metadata;
  const { name: name2, thumbnailUri: icon2 } = token2.metadata;

  return (
    <div className={cx(modeClass[colorThemeMode], s.listItem)}>
      <div className={s.positionBlockCell}>
        <TokensLogos
          token1={{ name: name1, icon: icon1 } as TokenType}
          token2={{ name: name2, icon: icon2 } as TokenType}
        />
        <div className={s.mleft8}>
          <h6>
            {name1}
            /
            {name2}
          </h6>

        </div>
      </div>
      {/* <div className={cx(s.joinRow, s.centerRow)}>
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
      </div> */}
    </div>
  );
};
