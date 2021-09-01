import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { BaseLayout } from '@layouts/BaseLayout';
import { Liquidity } from '@containers/Liquidity';
import { LineChartSampleData } from '@components/charts/content';

import s from '@styles/SwapLiquidity.module.sass';

const LineChart = dynamic(() => import('@components/charts/LineChart'), {
  ssr: false,
});

const LiquidityPage: React.FC = () => {
  const { t } = useTranslation(['common', 'liquidity']);

  return (
    <BaseLayout
      title={t('liquidity:Liquidity page')}
      description={t('liquidity:Liquidity page description. Couple sentences...')}
      className={s.wrapper}
    >
      <Liquidity />
      <LineChart className={s.chart} data={LineChartSampleData} />
    </BaseLayout>
  );
};

export const getServerSideProps = async (props:any) => {
  const { locale, query } = props;
  const splittedTokens = query['from-to'].split('-');
  const from = getWhitelistedTokenSymbol(TEZOS_TOKEN);
  const to = getWhitelistedTokenSymbol(STABLE_TOKEN);
  const isSoleToken = splittedTokens.length < 2;
  const isNoTokens = splittedTokens.length < 1;

  const isQueryMethod = query.method === 'add' || query.method === 'remove';
  const method = isQueryMethod ? query.method : 'add';

  if (isNoTokens || isSoleToken || splittedTokens[1] === '' || !isQueryMethod) {
    return {
      redirect: {
        destination: `/liquidity/${method}/${from}-${to}`,
        permanent: true,
      },
    };
  }

  if (splittedTokens.length > 0
    && (splittedTokens[0] !== TEZOS_TOKEN.contractAddress
    && splittedTokens[0] !== TEZOS_TOKEN.metadata.symbol
    && splittedTokens[0] !== TEZOS_TOKEN.metadata.name)
  ) {
    return {
      redirect: {
        destination: `/liquidity/${method}/${from}-${to}`,
        permanent: true,
      },
    };
  }

  return ({
    props: {
      ...await serverSideTranslations(locale, ['common', 'liquidity']),
    },
  });
};

export default LiquidityPage;
