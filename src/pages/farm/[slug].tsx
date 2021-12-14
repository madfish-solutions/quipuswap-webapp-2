import React from 'react';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Farm } from '@containers/Farm';
import { BaseLayout } from '@layouts/BaseLayout';
import s from '@styles/SwapLiquidity.module.sass';

const FarmPage: React.FC = () => {
  const { t } = useTranslation(['common', 'swap']);

  return (
    <BaseLayout
      title={t('swap:Farm page')}
      description={t('swap:Farm page description. Couple sentences...')}
      className={s.wrapper}
    >
      <Farm />
    </BaseLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'swap']))
  }
});

export default FarmPage;
