import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@layouts/BaseLayout';
import { Stake } from '@containers/Stake';

import s from '@styles/SwapLiquidity.module.sass';

const StakePage: React.FC = () => {
  const { t } = useTranslation(['common', 'swap']);

  return (
    <BaseLayout
      title={t('swap|Stake page')}
      description={t('swap|Stake page description. Couple sentences...')}
      className={s.wrapper}
    >
      <Stake />
    </BaseLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'swap']),
  },
});

export default StakePage;
