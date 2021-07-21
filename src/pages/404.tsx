import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { NotFoundLayout } from '@layouts/NotFoundLayout';

import s from '@styles/SwapLiquidity.module.sass';

const NotFound: React.FC = () => {
  const { t } = useTranslation(['common']);

  return (
    <NotFoundLayout
      title={t('common:Page Not Found')}
      description={t('common:Page not found description. Couple sentences...')}
      className={s.wrapper}
    >
      Todo
    </NotFoundLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common']),
  },
});

export default NotFound;
