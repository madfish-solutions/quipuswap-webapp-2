import React from 'react';
import Image from 'next/image';
import cx from 'classnames';

import { prepareTokenLogo, getWhitelistedTokenSymbol } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';
import { FallbackLogo } from '@components/svg/FallbackLogo';

import s from './TokensLogos.module.sass';

export interface TokensLogosInterface {
  token1: WhitelistedToken
  token2?: WhitelistedToken
  width?:number
  className?: string
  imageClassName?: string
  layout?: 'fixed' | 'fill'
}

export const TokensLogos: React.FC<TokensLogosInterface> = ({
  token1,
  token2,
  width = 24,
  className,
  imageClassName,
  layout = 'fixed',
}) => {
  const compoundClassName = cx(
    s.root,
    { [s.pairs]: token2 },
    className,
  );

  const prepareToken1 = token1 && {
    ...token1,
    icon: prepareTokenLogo(token1.metadata?.thumbnailUri),
  };
  const prepareToken2 = token2 && {
    ...token2,
    icon: prepareTokenLogo(token2.metadata?.thumbnailUri),
  };

  return (
    <div className={compoundClassName}>
      <div className={cx(s.imageWrapper, imageClassName)}>
        {prepareToken1.icon ? (
          <Image
            {...layout === 'fill' ? { layout } : { layout, width, height: width }}
            src={prepareToken1.icon}
            alt={getWhitelistedTokenSymbol(prepareToken1)}
            className={cx(s.image)}
          />
        ) : (
          <FallbackLogo className={cx(s.image)} />
        )}
      </div>
      {prepareToken2?.icon && (
        <div className={cx(s.imageWrapper, s.secondImage, imageClassName)}>
          <Image
            {...layout === 'fill' ? { layout } : { layout, width, height: width }}
            src={prepareToken2.icon}
            alt={getWhitelistedTokenSymbol(prepareToken2)}
            className={cx(s.image)}
          />
        </div>
      )}

      {
        prepareToken2?.icon === null && (
          <div className={cx(s.secondImage, imageClassName)}>
            <FallbackLogo className={cx(s.image)} />
          </div>
        )
      }
    </div>
  );
};
