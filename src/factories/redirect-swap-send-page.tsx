import { useRouter } from 'next/router';

import { SwapTabAction } from '@interfaces/types';
import { makeSwapOrSendRedirectionUrl } from '@utils/redirections';

export const makeRedirectSwapSendPage = (action: SwapTabAction) => {
  return () => {
    const router = useRouter();

    if (typeof window !== 'undefined') {
      router.push(makeSwapOrSendRedirectionUrl(router.query, action));
    }

    return null;
  };
};
