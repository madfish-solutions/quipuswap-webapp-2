import { FC, useEffect, useState } from 'react';

import { isExist, prepareTokenLogo } from '@shared/helpers';
import { FallbackLogo } from '@shared/svg';
import { Nullable } from '@shared/types';

import s from './token-logo.module.scss';

interface PropsAbstraction {
  src: Nullable<string>;
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

export const TokenLogo: FC<Props> = ({ src, tokenSymbol, layout = 'fixed', size = 24 }) => {
  const [loadError, setLoadError] = useState(false);

  const url = prepareTokenLogo(src);

  const handleLoadError = () => setLoadError(true);

  useEffect(() => setLoadError(false), [src]);

  const layoutBasedProps = layout === 'fill' ? { layout: 'fill' } : { layout: 'fixed', width: size, height: size };

  return loadError || !isExist(url) ? (
    <FallbackLogo size={size} className={s.image} />
  ) : (
    <img
      onError={handleLoadError}
      src={url}
      alt={`${tokenSymbol}`}
      className={s.image}
      style={{ ...layoutBasedProps }}
    />
  );
};
