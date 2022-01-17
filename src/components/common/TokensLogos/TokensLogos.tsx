import React from 'react';

import cx from 'classnames';

import { TokenLogo } from '@components/common/TokenLogo';
import { isUndefined } from '@utils/helpers';
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
  const { firstTokenIcon, firstTokenSymbol, secondTokenIcon, secondTokenSymbol, className, imageClassName } = props;

  const compoundClassName = cx(s.root, { [s.pairs]: secondTokenIcon }, className);

  const layoutBasedProps =
    props.layout === 'fill' ? { layout: 'fill' as const } : { layout: 'fixed' as const, size: props.width };

  return (
    <div className={compoundClassName}>
      <div className={cx(s.imageWrapper, imageClassName)}>
        {firstTokenIcon ? (
          <TokenLogo src={firstTokenIcon} tokenSymbol={firstTokenSymbol} {...layoutBasedProps} />
        ) : (
          <FallbackLogo className={cx(s.image)} />
        )}
      </div>

      {secondTokenIcon && (
        <div className={cx(s.imageWrapper, s.secondImage, imageClassName)}>
          <TokenLogo src={secondTokenIcon} tokenSymbol={secondTokenSymbol} {...layoutBasedProps} />
        </div>
      )}

      {!secondTokenIcon && !isUndefined(secondTokenIcon) && (
        <div className={cx(s.secondImage, imageClassName)}>
          <FallbackLogo className={cx(s.image)} />
        </div>
      )}
    </div>
  );
};
