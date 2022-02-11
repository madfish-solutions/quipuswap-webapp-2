import { NextPageContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import { makeSwapOrSendRedirectionUrl } from '@utils/redirections';
import { SwapTabAction } from '@utils/types';

const RedirectSwapPage = () => {
  const router = useRouter();

  if (typeof window !== 'undefined') {
    router.push(makeSwapOrSendRedirectionUrl(router.query, SwapTabAction.SWAP));
  }

  return null;
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  if (ctx.res) {
    return {
      redirect: {
        destination: makeSwapOrSendRedirectionUrl(ctx.query, SwapTabAction.SWAP),
        permanent: false
      }
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale ?? 'en', ['common', 'swap']))
    }
  };
};

// eslint-disable-next-line import/no-default-export
export default RedirectSwapPage;
