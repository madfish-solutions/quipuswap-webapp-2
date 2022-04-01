import { FC } from 'react';

import { FallbackLogo } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { TokenLogo } from '@components/common/TokenLogo';
import { getTokensPairName, getTokenSymbol, isExist, isNull } from '@utils/helpers';
import { Token } from '@utils/types';

import styles from './tokens-logos-with-symbols.module.scss';

interface PropsAbstraction {
  tokenA: Token;
  tokenB?: Token;
  className?: string;
  imageClassName?: string;
  loading?: boolean;
}

interface FixedProps extends PropsAbstraction {
  layout?: 'fixed';
  width?: number;
}

interface FillProps extends PropsAbstraction {
  layout: 'fill';
}

type Props = FixedProps | FillProps;

export const TokensLogosAndSymbols: FC<Props> = props => {
  const { tokenA, tokenB, className, imageClassName, loading } = props;

  const isTokenPair = isExist(tokenB);

  const compoundClassName = cx(styles.root, { [styles.pairs]: isTokenPair }, className);

  const layoutBasedProps =
    props.layout === 'fill' ? { layout: 'fill' as const } : { layout: 'fixed' as const, size: props.width };

  const firstTokenIcon = tokenA.metadata.thumbnailUri;
  const firstTokenSymbol = getTokenSymbol(tokenA);

  const secondTokenIcon = isTokenPair ? tokenB.metadata.thumbnailUri : undefined;
  const secondTokenSymbol = isTokenPair ? getTokenSymbol(tokenB) : undefined;

  const symbols = isTokenPair ? getTokensPairName(tokenA, tokenB) : firstTokenSymbol;

  return (
    <div className={styles.container}>
      <div className={compoundClassName}>
        <div className={cx(styles.imageWrapper, imageClassName)}>
          {isExist(firstTokenIcon) && !loading ? (
            <TokenLogo src={firstTokenIcon} tokenSymbol={firstTokenSymbol} {...layoutBasedProps} />
          ) : (
            <FallbackLogo className={cx(styles.image)} />
          )}
        </div>

        {isExist(secondTokenIcon) && !loading && (
          <div className={cx(styles.imageWrapper, styles.secondImage, imageClassName)}>
            <TokenLogo src={secondTokenIcon} tokenSymbol={secondTokenSymbol} {...layoutBasedProps} />
          </div>
        )}

        {(isNull(secondTokenIcon) || (secondTokenIcon && loading)) && (
          <div className={cx(styles.secondImage, imageClassName)}>
            <FallbackLogo className={cx(styles.image)} />
          </div>
        )}
      </div>
      <h4 className={styles.symbols}>{symbols}</h4>
    </div>
  );
};
