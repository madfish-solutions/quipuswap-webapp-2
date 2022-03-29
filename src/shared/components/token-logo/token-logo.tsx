import React, { useEffect, useState } from 'react';

import { Nullable } from 'types/types';

import { FallbackLogo } from '@shared/svg/fallback-logo';
import s from './TokenLogo.module.sass';

interface PropsAbstraction {
  src: string;
  tokenSymbol?: Nullable<string>;
}

interface PropsFixed extends PropsAbstraction {
  layout?: 'fixed';
  size?: number;
}

interface PropsFill extends PropsAbstraction {
  layout: 'fill';
  size?: undefined;
}

type Props = PropsFixed | PropsFill;

export const TokenLogo: React.FC<Props> = ({ src, tokenSymbol, layout = 'fixed', size = 24 }) => {
  const [loadError, setLoadError] = useState(false);

  const handleLoadError = () => setLoadError(true);

  useEffect(() => setLoadError(false), [src]);

  const layoutBasedProps = layout === 'fill' ? { layout: 'fill' } : { layout: 'fixed', width: size, height: size };

  return loadError ? (
    <FallbackLogo className={s.image} />
  ) : (
    <img
      onError={handleLoadError}
      src={src}
      alt={`${tokenSymbol}`}
      className={s.image}
      style={{ ...layoutBasedProps }}
    />
  );
};
