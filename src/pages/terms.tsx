import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@layouts/BaseLayout';

import s from '@styles/Terms.module.sass';

const TermsOfUse: React.FC = () => {
  const { t } = useTranslation(['terms', 'common']);

  return (
    <BaseLayout
      title={t('terms|Terms of Usage')}
      description={t('terms|Terms of Usage page description. Couple sentences...')}
      className={s.wrapper}
    >
      {/* <Voting /> */}
      voting
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'terms']),
  },
});

export default TermsOfUse;
