import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@layouts/BaseLayout';
import { SwapSend } from '@containers/SwapSend';

import s from '@styles/SwapLiquidity.module.sass';

type SwapSendPageProps = {
  fromToSlug?: string;
};

const SwapSendPage: React.FC<SwapSendPageProps> = ({ fromToSlug }) => {
  const { t } = useTranslation(['common', 'swap']);

  return (
    <BaseLayout
      title={t('swap|Swap page')}
      description={t('swap|Swap page description. Couple sentences...')}
      className={s.wrapper}
    >
      <SwapSend fromToSlug={fromToSlug} />
    </BaseLayout>
  );
};

export const getServerSideProps = async (props:any) => {
  const { locale, query } = props;

  return ({
    props: {
      ...await serverSideTranslations(locale, ['common', 'swap']),
      fromToSlug: query['from-to'],
    },
  });
};

export default SwapSendPage;
