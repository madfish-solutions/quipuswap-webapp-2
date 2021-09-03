import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@layouts/BaseLayout';
import { GovernanceForm } from '@containers/Governance/GovernanceCard';

import s from '@styles/SwapLiquidity.module.sass';

const GovernancePage: React.FC = () => {
  const { t } = useTranslation(['common', 'swap']);

  return (
    <BaseLayout
      title={t('swap:Governance page')}
      description={t('swap:Governance page description. Couple sentences...')}
      className={s.wrapper}
    >
      <GovernanceForm className={s.proposal} />
    </BaseLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'governance']),
  },
});

export default GovernancePage;
