import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { BaseLayout } from '@layouts/BaseLayout';
import { Voting } from '@containers/Voting';

import s from '@styles/SwapLiquidity.module.sass';

const VotePage: React.FC = () => {
  const { t } = useTranslation(['common', 'vote']);

  return (
    <BaseLayout
      title={t('vote:Vote page')}
      description={t('vote:Vote page description. Couple sentences...')}
      className={s.wrapper}
    >
      <Voting />
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

  const isQueryMethod = query.method === 'vote' || query.method === 'veto';
  const method = isQueryMethod ? query.method : 'vote';

  if (isNoTokens || isSoleToken || splittedTokens[1] === '') {
    return {
      redirect: {
        destination: `/voting/${method}/${from}-${to}`,
        permanent: false,
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
        destination: `/voting/${method}/${from}-${to}`,
        permanent: false,
      },
    };
  }

  return ({
    props: {
      ...await serverSideTranslations(locale, ['common', 'vote']),
    },
  });
};

export default VotePage;
