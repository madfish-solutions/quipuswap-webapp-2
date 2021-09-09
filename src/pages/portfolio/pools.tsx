import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@layouts/BaseLayout';
import { PortfolioPools } from '@containers/Portfolio';

import s from '@styles/SwapLiquidity.module.sass';

const PortfolioPage: React.FC = () => {
  const { t } = useTranslation(['common', 'swap']);

  return (
    <BaseLayout
      title={t('swap:Portfolio page')}
      description={t('swap:Portfolio page description. Couple sentences...')}
      className={s.wrapper}
    >
      <PortfolioPools />
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'swap']),
  },
});

export default PortfolioPage;
