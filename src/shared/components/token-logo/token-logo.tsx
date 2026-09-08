import { FC, useContext, useEffect, useState } from 'react';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { isExist, prepareTokenLogo } from '@shared/helpers';
import { FallbackLogo } from '@shared/svg';
import { Nullable } from '@shared/types';

import s from './token-logo.module.scss';

interface PropsAbstraction {
  src: Nullable<string>;
  tokenSymbol?: Nullable<string>;
  contractAddress?: Nullable<string>;
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

const DEFAULT_SIZE = 24;
const TZKT_SERVICES_URL = 'https://services.tzkt.io/v1';
const TF_BAKER_ADDRESS = 'tz3UQN6nBQHofmgQ3pZannhiYE2CT7TEZFim';

export const TokenLogo: FC<Props> = ({ src, tokenSymbol, contractAddress, layout = 'fixed', size = DEFAULT_SIZE }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [failedUrls, setFailedUrls] = useState<string[]>([]);

  const primaryUrl = prepareTokenLogo(src);
  const trimmedContractAddress = contractAddress?.trim();
  const avatarsPath = colorThemeMode === ColorModes.Dark ? 'avatars-dark' : 'avatars';
  let fallbackUrl: string | null;
  if (trimmedContractAddress === 'tez') {
    fallbackUrl = `${TZKT_SERVICES_URL}/${avatarsPath}/${TF_BAKER_ADDRESS}`;
  } else if (trimmedContractAddress) {
    fallbackUrl = `${TZKT_SERVICES_URL}/${avatarsPath}/${trimmedContractAddress}`;
  } else {
    fallbackUrl = null;
  }
  const url = [primaryUrl, fallbackUrl].find(candidate => isExist(candidate) && !failedUrls.includes(candidate));

  const handleLoadError = () => {
    if (url) {
      setFailedUrls(currentFailedUrls => [...currentFailedUrls, url]);
    }
  };

  useEffect(() => setFailedUrls([]), [src, contractAddress]);

  const layoutBasedProps = layout === 'fill' ? { layout: 'fill' } : { layout: 'fixed', width: size, height: size };

  return !isExist(url) ? (
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
