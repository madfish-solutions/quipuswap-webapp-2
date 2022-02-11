import { useRouter } from 'next/router';

import { makeSwapOrSendRedirectionUrl } from '@utils/redirections';
import { SwapTabAction } from '@utils/types';

export const makeRedirectSwapSendPage = (action: SwapTabAction) => {
  return () => {
    const router = useRouter();

    if (typeof window !== 'undefined') {
      router.push(makeSwapOrSendRedirectionUrl(router.query, action));
    }

    return null;
  };
};
