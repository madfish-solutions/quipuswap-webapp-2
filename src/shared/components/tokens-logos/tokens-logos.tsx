import { FC } from 'react';

import cx from 'classnames';

import { isExist, isNull } from '@shared/helpers';
import { FallbackLogo } from '@shared/svg';
import { Nullable } from '@shared/types';

import { TokenLogo } from '../token-logo';
import s from './tokens-logos.module.scss';

interface TokensLogosPropsAbstraction {
  firstTokenIcon: Nullable<string>;
  firstTokenSymbol: string;
  secondTokenIcon?: Nullable<string>;
  secondTokenSymbol?: Nullable<string>;
  className?: string;
  imageClassName?: string;
  loading?: boolean;
}

interface FixedTokensLogosProps extends TokensLogosPropsAbstraction {
  layout?: 'fixed';
  width?: number;
}

interface FillTokensLogosProps extends TokensLogosPropsAbstraction {
  layout: 'fill';
}

export type TokensLogosProps = FixedTokensLogosProps | FillTokensLogosProps;

/**
 * @deprecated
 */
export const TokensLogosDeprecated: FC<TokensLogosProps> = props => {
  const { firstTokenIcon, firstTokenSymbol, secondTokenIcon, secondTokenSymbol, className, imageClassName, loading } =
    props;

  const compoundClassName = cx(s.root, { [s.pairs]: secondTokenIcon }, className);

  const layoutBasedProps =
    props.layout === 'fill' ? { layout: 'fill' as const } : { layout: 'fixed' as const, size: props.width };

  return (
    <div className={compoundClassName}>
      <div className={cx(s.imageWrapper, imageClassName)}>
        {isExist(firstTokenIcon) && !loading ? (
          <TokenLogo src={firstTokenIcon} tokenSymbol={firstTokenSymbol} {...layoutBasedProps} />
        ) : (
          <FallbackLogo className={cx(s.image)} />
        )}
      </div>

      {isExist(secondTokenIcon) && !loading && (
        <div className={cx(s.imageWrapper, s.secondImage, imageClassName)}>
          <TokenLogo src={secondTokenIcon} tokenSymbol={secondTokenSymbol} {...layoutBasedProps} />
        </div>
      )}

      {(isNull(secondTokenIcon) || (secondTokenIcon && loading)) && (
        <div className={cx(s.secondImage, imageClassName)}>
          <FallbackLogo className={cx(s.image)} />
        </div>
      )}
    </div>
  );
};
