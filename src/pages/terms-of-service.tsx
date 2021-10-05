import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { BaseLayout } from '@layouts/BaseLayout';
import { Card, CardContent } from '@components/ui/Card';
import { RuTermsOfUse } from '@content/ru/terms-of-use';
import { EnTermsOfUse } from '@content/en/terms-of-use';

import s from '@styles/Terms.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const TermsOfUse: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation(['terms', 'common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  let content;
  switch (router.locale) {
    case 'ru':
      content = <RuTermsOfUse />;
      break;
    default:
      content = <EnTermsOfUse />;
      break;
  }

  return (
    <BaseLayout
      title={t('terms|Terms of Usage')}
      description={t('terms|Terms of Usage page description. Couple sentences...')}
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
    ...await serverSideTranslations(locale, ['common', 'terms']),
  },
});

export default TermsOfUse;
