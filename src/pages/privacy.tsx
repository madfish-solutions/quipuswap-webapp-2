import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@layouts/BaseLayout';

import s from '@styles/PrivacyPolicy.module.sass';

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation(['common', 'privacy']);

  return (
    <BaseLayout
      title={t('terms|Privacy Policy')}
      description={t('terms|Privacy Policy page description. Couple sentences...')}
      className={s.wrapper}
    >
      {/* <Voting /> */}
      voting
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'privacy']),
  },
});

export default PrivacyPolicy;
