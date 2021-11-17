import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { BaseLayout } from '@layouts/BaseLayout';
import { SwapSend } from '@containers/SwapSend';

import s from '@styles/SwapLiquidity.module.sass';

const SwapSendPage: React.FC = () => {
  const { t } = useTranslation(['common', 'swap']);

  return (
    <BaseLayout
      title={t('swap|Swap page')}
      description={t('swap|Swap page description. Couple sentences...')}
      className={s.wrapper}
    >
      <SwapSend />
    </BaseLayout>
  );
};

const defaultFromToken = getWhitelistedTokenSymbol(TEZOS_TOKEN);
const defaultToToken = getWhitelistedTokenSymbol(STABLE_TOKEN);

export const getServerSideProps = async (props:any) => {
  const { locale, query } = props;
  const splitTokens = query['from-to'].split('-');
  const from = splitTokens[0] || defaultFromToken;
  let to = splitTokens[1] || defaultToToken;

  if (from === to) {
    to = from === defaultFromToken ? defaultToToken : defaultFromToken;
  }

  if ((from !== splitTokens[0]) || (to !== splitTokens[1])) {
    return {
      redirect: {
        destination: `/swap/${from}-${to}`,
        permanent: true,
      },
    };
  }

  return ({
    props: {
      ...await serverSideTranslations(locale, ['common', 'swap']),
    },
  });
};

export default SwapSendPage;
