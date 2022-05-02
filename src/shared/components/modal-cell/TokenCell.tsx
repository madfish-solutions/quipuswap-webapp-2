import { FC, useContext, KeyboardEvent } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Bage } from '@shared/elements';
import { isTokenTypeFa12 } from '@shared/helpers/tokens/token-type';
import { Standard } from '@shared/types';
import { useTranslation } from '@translation';

import { TokensLogosDeprecated } from '../tokens-logos-deprecated';
import styles from './ModalCell.module.scss';

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
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
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

  const compoundClassName = cx(modeClass[colorThemeMode], styles.listItem, styles.splitRow);

  const getTokenTypeTitle = (type: Standard) => (isTokenTypeFa12(type) ? t('common|FA 1.2') : t('common|FA 2.0'));

  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && onClick) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div tabIndex={tabIndex} onClick={onClick} onKeyUp={handleKeyUp} className={compoundClassName}>
      <div className={styles.splitRow}>
        <TokensLogosDeprecated firstTokenIcon={tokenIcon} firstTokenSymbol={tokenSymbol} />
        <div className={cx(styles.mleft8, styles.tokenBody)}>
          <div className={styles.joinRow} data-test-id={tokenSymbol}>
            <h6 data-test-id="tokenSymbol">{tokenSymbol}</h6>
            <span>
              {tokenType && !isTezosToken && <Bage className={styles.bage} text={getTokenTypeTitle(tokenType)} />}
            </span>
          </div>

          <span className={cx(styles.caption)}>{tokenName}</span>
        </div>
      </div>
      {children}
    </div>
  );
};
