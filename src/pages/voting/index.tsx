import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { BaseLayout } from '@layouts/BaseLayout';
import { Voting } from '@containers/Voting';

import s from '@styles/SwapLiquidity.module.sass';

const VotingPage: React.FC = () => {
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

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'vote']),
  },
});

export default VotingPage;
