import React from 'react';

import cx from 'classnames';

import { TokenLogo } from '@components/common/TokenLogo';
import { isExist, isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { FallbackLogo } from '../../svg/FallbackLogo';
import s from './TokensLogos.module.sass';

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

export const TokensLogos: React.FC<TokensLogosProps> = props => {
  const { firstTokenIcon, firstTokenSymbol, secondTokenIcon, secondTokenSymbol, className, imageClassName, loading } =
    props;

  const compoundClassName = cx(s.root, { [s.pairs]: secondTokenIcon }, className);

  const layoutBasedProps =
    props.layout === 'fill' ? { layout: 'fill' as const } : { layout: 'fixed' as const, size: props.width };

  const wrapLoading = loading === true;

  return (
    <div className={compoundClassName}>
      <div className={cx(s.imageWrapper, imageClassName)}>
        {isExist(firstTokenIcon) && !wrapLoading ? (
          <TokenLogo src={firstTokenIcon} tokenSymbol={firstTokenSymbol} {...layoutBasedProps} />
        ) : (
          <FallbackLogo className={cx(s.image)} />
        )}
      </div>

      {isExist(secondTokenIcon) && !wrapLoading && (
        <div className={cx(s.imageWrapper, s.secondImage, imageClassName)}>
          <TokenLogo src={secondTokenIcon} tokenSymbol={secondTokenSymbol} {...layoutBasedProps} />
        </div>
      )}

      {(isNull(secondTokenIcon) || (secondTokenIcon && wrapLoading)) && (
        <div className={cx(s.secondImage, imageClassName)}>
          <FallbackLogo className={cx(s.image)} />
        </div>
      )}
    </div>
  );
};
