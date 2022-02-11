import { NextPageContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { makeSwapSendPage } from '@factories/swap-send-page';
import { SwapTabAction } from '@utils/types';

const SwapPage = makeSwapSendPage(SwapTabAction.SWAP);

export const getServerSideProps = async (props: NextPageContext) => {
  const { locale } = props;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'swap']))
    }
  };
};

// eslint-disable-next-line import/no-default-export
export default SwapPage;
