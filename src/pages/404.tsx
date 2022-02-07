import React, { useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@components/common/BaseLayout';
import { SITE_DESCRIPTION } from '@seo.config';
import s from '@styles/SwapLiquidity.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

const NotFound: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <BaseLayout
      title={t('common|Page Not Found')}
      description={t(`common|${SITE_DESCRIPTION}`)}
      className={cx(s.wrapper404, modeClass[colorThemeMode])}
    >
      <div className={s.statusCode}>404</div>
      <div className={s.status}>{t('common|Page Not Found')}!</div>
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common']))
  }
});

// eslint-disable-next-line import/no-default-export
export default NotFound;
