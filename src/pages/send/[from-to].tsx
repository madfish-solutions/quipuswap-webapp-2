import React from 'react';

import { NextPageContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@components/common/BaseLayout';
import { TestnetAlert } from '@components/common/testnet-alert';
import { SwapSend } from '@containers/swap-send';
import { SITE_DESCRIPTION, SITE_TITLE } from '@seo.config';
import s from '@styles/SwapLiquidity.module.sass';
import { SwapTabAction } from '@utils/types';

const SendPage: React.FC = () => {
  const { t } = useTranslation(['common', 'swap']);

  return (
    <BaseLayout
      title={t(`swap|Swap page - ${SITE_TITLE}`)}
      description={t(`'swap|${SITE_DESCRIPTION}`)}
      className={s.wrapper}
    >
      <TestnetAlert />
      <SwapSend initialAction={SwapTabAction.SEND} />
    </BaseLayout>
  );
};

export const getServerSideProps = async (props: NextPageContext) => {
  const { locale } = props;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'swap']))
    }
  };
};

// eslint-disable-next-line import/no-default-export
export default SendPage;
