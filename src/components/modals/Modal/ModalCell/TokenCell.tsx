import { FC, useContext } from 'react';

import { Bage } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { TokensLogos } from '@components/common/TokensLogos';
import { Standard } from '@graphql';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { isTokenTypeFa12 } from '@utils/helpers/token-type';

import s from './ModalCell.module.sass';

interface TokenCellProps {
  tokenIcon: string | null;
  tokenName: string;
  tokenSymbol: string;
  tokenType?: Standard;
  tabIndex?: number;
  onClick?: () => void;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const TokenCell: FC<TokenCellProps> = ({
  onClick,
  tabIndex,
  children,
  tokenIcon,
  tokenName,
  tokenType,
  tokenSymbol
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(modeClass[colorThemeMode], s.listItem, s.splitRow);

  const getTokenTypeTitle = (type: Standard) => (isTokenTypeFa12(type) ? 'FA 1.2' : 'FA 2.0');

  return (
    <div
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyUp={e => {
        if (e.key === 'Enter' && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={compoundClassName}
    >
      <div className={s.splitRow}>
        <TokensLogos firstTokenIcon={tokenIcon} firstTokenSymbol={tokenSymbol} />
        <div className={cx(s.mleft8, s.tokenBody)}>
          <div className={s.joinRow}>
            <h6>{tokenSymbol}</h6>
            {tokenType && <Bage className={s.bage} text={getTokenTypeTitle(tokenType)} />}
          </div>

          <span className={cx(s.caption)}>{tokenName}</span>
        </div>
      </div>
      {children}
    </div>
  );
};
