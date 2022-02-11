import { NextPageContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { makeRedirectSwapSendPage } from '@factories/redirect-swap-send-page';
import { makeSwapOrSendRedirectionUrl } from '@utils/redirections';
import { SwapTabAction } from '@utils/types';

const RedirectSwapPage = makeRedirectSwapSendPage(SwapTabAction.SWAP);

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
