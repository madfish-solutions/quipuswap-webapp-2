import { FC, useContext } from 'react';

import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { networksDefaultTokens, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { BaseLayout } from '@components/common/BaseLayout';
import { PageTitle } from '@components/common/page-title';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { SITE_DESCRIPTION, SITE_TITLE } from '@seo.config';
import s from '@styles/PrivacyPolicy.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

// TODO: replace with tokens from selected staking
const STUB_TOKEN1 = TEZOS_TOKEN;
const STUB_TOKEN2 = networksDefaultTokens[NETWORK_ID];

const StakeItemPage: FC = () => {
  const { t } = useTranslation(['common', 'privacy']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <BaseLayout
      title={t(`privacy|Stake - ${SITE_TITLE}`)}
      description={t(`privacy|${SITE_DESCRIPTION}`)}
      className={cx(s.wrapper, modeClass[colorThemeMode])}
    >
      <PageTitle>
        {STUB_TOKEN1.metadata.symbol}/{STUB_TOKEN2.metadata.symbol}
      </PageTitle>
    </BaseLayout>
  );
};
// eslint-disable-next-line import/no-default-export
export default StakeItemPage;

// @ts-ignore
export const getServerSideProps = async props => {
  const { locale } = props;

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'stake']))
    }
  };
};
