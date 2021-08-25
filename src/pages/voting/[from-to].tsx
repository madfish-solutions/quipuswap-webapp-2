import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { BaseLayout } from '@layouts/BaseLayout';
import { Voting } from '@containers/Voting';

import s from '@styles/SwapLiquidity.module.sass';

const VotePage: React.FC = () => {
  const { t } = useTranslation(['common', 'swap']);

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

export const getStaticPaths = async () => ({
  paths: [
    { params: { 'from-to': process.env.DEFAULT_SWAP_URI }, locale: 'en' },
    { params: { 'from-to': process.env.DEFAULT_SWAP_URI }, locale: 'fr' },
    { params: { 'from-to': process.env.DEFAULT_SWAP_URI }, locale: 'ru' },
    { params: { 'from-to': process.env.DEFAULT_SWAP_URI }, locale: 'es' },
    { params: { 'from-to': process.env.DEFAULT_SWAP_URI }, locale: 'pt' },
  ],
  fallback: true,
});

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'vote']),
  },
});

export default VotePage;
