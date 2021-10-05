import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { BaseLayout } from '@layouts/BaseLayout';
import { Card, CardContent } from '@components/ui/Card';
import { RuPrivacy } from '@content/ru/privacy-policy';
import { EnPrivacy } from '@content/en/privacy-policy';

import s from '@styles/PrivacyPolicy.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const PrivacyPolicy: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'privacy']);

  const { colorThemeMode } = useContext(ColorThemeContext);

  let content;
  switch (router.locale) {
    case 'ru':
      content = <RuPrivacy />;
      break;
    default:
      content = <EnPrivacy />;
      break;
  }

  return (
    <BaseLayout
      title={t('privacy|Privacy Policy')}
      description={t('privacy|Privacy Policy page description. Couple sentences...')}
      className={cx(s.wrapper, modeClass[colorThemeMode])}
    >
      <Card>
        <CardContent className={s.content}>
          {content}
        </CardContent>
      </Card>
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'privacy']),
  },
});

export default PrivacyPolicy;
