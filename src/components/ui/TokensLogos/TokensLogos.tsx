import React from 'react';
import Image from 'next/image';
import cx from 'classnames';

import { prepareTokenLogo } from '@utils/helpers';
import FallbackLogo from '@icons/FallbackLogo.svg';

import s from './TokensLogos.module.sass';

export type TokenType = {
  icon: string | null | undefined
  name: string
};

export interface TokensLogosInterface {
  token1: TokenType
  token2?: TokenType
  className?: string
}

export const TokensLogos: React.FC<TokensLogosInterface> = ({
  token1,
  token2,
  className,
}) => {
  const compoundClassName = cx(
    s.root,
    { [s.pairs]: token2 },
    className,
  );

  const prepareToken1 = {
    ...token1,
    icon: prepareTokenLogo(token1.icon),
  };
  const prepareToken2 = token2 && {
    ...token2,
    icon: prepareTokenLogo(token2.icon),
  };

  return (
    <div className={compoundClassName}>
      {prepareToken1.icon ? (
        <Image
          layout="fixed"
          width={24}
          height={24}
          src={prepareToken1.icon}
          alt={prepareToken1.name ?? 'Symbol'}
          className={cx(s.image)}
        />
      ) : (
        <FallbackLogo className={cx(s.image)} />
      )}

      {prepareToken2?.icon && (
        <div className={s.secondImage}>
          <Image
            layout="fixed"
            width={24}
            height={24}
            src={prepareToken2.icon}
            alt={prepareToken2.name ?? 'Symbol'}
            className={cx(s.image)}
          />
        </div>
      )}

      {
        prepareToken2?.icon === null && (
          <div className={s.secondImage}>
            <FallbackLogo className={cx(s.image)} />
          </div>
        )
      }
    </div>
  );
};
