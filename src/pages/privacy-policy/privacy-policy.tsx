import React, { useContext } from 'react';

import { Card, CardContent } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BaseLayout } from '@components/common/BaseLayout';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import s from '@styles/PrivacyPolicy.module.sass';

import { EnPrivacy } from './content/en-privacy-policy';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation(['common', 'privacy']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <BaseLayout
      title={t('privacy|Privacy Policy')}
      description={t('privacy|Privacy Policy page description. Couple sentences...')}
      className={cx(s.wrapper, modeClass[colorThemeMode])}
    >
      <Card>
        <CardContent className={s.content}>
          <EnPrivacy />
        </CardContent>
      </Card>
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'privacy']))
  }
});

// eslint-disable-next-line import/no-default-export
export default PrivacyPolicy;
