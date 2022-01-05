import React from 'react';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { MAINNET_DEFAULT_TOKEN, TEZOS_TOKEN } from '@app.config';
import { BaseLayout } from '@components/common/BaseLayout';
import { Voting } from '@containers/Voting';
import s from '@styles/Voting.module.sass';
import { getWhitelistedTokenSymbol } from '@utils/helpers';

const VotePage: React.FC = () => {
  const { t } = useTranslation(['common', 'vote']);

  return (
    <BaseLayout
      title={t('vote|Vote page')}
      description={t('vote|Vote page description. Couple sentences...')}
      className={s.wrapper}
    >
      <Voting />
    </BaseLayout>
  );
};

export const getServerSideProps = async ({
  locale,
  query
}: {
  locale: string;
  query: { 'from-to': string; method: string };
}) => {
  const splittedTokens = query['from-to'].split('-');
  const from = getWhitelistedTokenSymbol(TEZOS_TOKEN);
  const to = getWhitelistedTokenSymbol(MAINNET_DEFAULT_TOKEN);
  const isSoleToken = splittedTokens.length < 2;
  const isNoTokens = splittedTokens.length < 1;

  const isQueryMethod = query.method === 'vote' || query.method === 'veto';
  const method = isQueryMethod ? query.method : 'vote';

  if (isNoTokens || isSoleToken || splittedTokens[1] === '' || !isQueryMethod) {
    return {
      redirect: {
        destination: `/voting/${method}/${from}-${to}`,
        permanent: false
      }
    };
  }

  if (
    splittedTokens.length > 0 &&
    splittedTokens[0] !== TEZOS_TOKEN.contractAddress &&
    splittedTokens[0] !== TEZOS_TOKEN.metadata.symbol &&
    splittedTokens[0] !== TEZOS_TOKEN.metadata.name
  ) {
    return {
      redirect: {
        destination: `/voting/${method}/${from}-${to}`,
        permanent: false
      }
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'vote']))
    }
  };
};

// eslint-disable-next-line import/no-default-export
export default VotePage;
