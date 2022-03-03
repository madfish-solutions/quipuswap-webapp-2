import { FC, useContext, KeyboardEvent } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { TokensLogos } from '@components/common/TokensLogos';
import { Bage } from '@components/ui/bage';
import { Standard } from '@graphql';
import { isTokenTypeFa12 } from '@utils/helpers/token-type';

import s from './ModalCell.module.sass';

interface TokenCellProps {
  tokenIcon: string | null;
  tokenName: string;
  tokenSymbol: string;
  tokenType?: Standard;
  isTezosToken?: boolean;
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
  tokenSymbol,
  isTezosToken
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(modeClass[colorThemeMode], s.listItem, s.splitRow);

  const getTokenTypeTitle = (type: Standard) => (isTokenTypeFa12(type) ? t('common|FA 1.2') : t('common|FA 2.0'));

  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && onClick) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div tabIndex={tabIndex} onClick={onClick} onKeyUp={handleKeyUp} className={compoundClassName}>
      <div className={s.splitRow}>
        <TokensLogos firstTokenIcon={tokenIcon} firstTokenSymbol={tokenSymbol} />
        <div className={cx(s.mleft8, s.tokenBody)}>
          <div className={s.joinRow}>
            <h6>{tokenSymbol}</h6>
            {tokenType && !isTezosToken && <Bage className={s.bage} text={getTokenTypeTitle(tokenType)} />}
          </div>

          <span className={cx(s.caption)}>{tokenName}</span>
        </div>
      </div>
      {children}
    </div>
  );
};
