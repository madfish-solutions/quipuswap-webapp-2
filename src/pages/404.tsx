import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { NotFoundLayout } from '@layouts/NotFoundLayout';

import s from '@styles/SwapLiquidity.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const NotFound: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <NotFoundLayout
      title={t('common:Page Not Found')}
      description={t('common:Page not found description. Couple sentences...')}
      className={cx(s.wrapper404, modeClass[colorThemeMode])}
    >
      <div className={s.statusCode}>
        404
      </div>
      <div className={s.status}>
        {t('common:Page Not Found')}
        !
      </div>
    </NotFoundLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common']),
  },
});

export default NotFound;
