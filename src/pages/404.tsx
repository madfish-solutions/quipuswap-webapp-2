import React, { useContext } from 'react';
import { ColorModes, ColorThemeContext } from '@madfish-solutions/quipu-ui-kit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { BaseLayout } from '@layouts/BaseLayout';

import s from '@styles/SwapLiquidity.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const NotFound: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <BaseLayout
      title={t('common|Page Not Found')}
      description={t('common|Page not found description. Couple sentences...')}
      className={cx(s.wrapper404, modeClass[colorThemeMode])}
    >
      <div className={s.statusCode}>
        404
      </div>
      <div className={s.status}>
        {t('common|Page Not Found')}
        !
      </div>
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common']),
  },
});

export default NotFound;
