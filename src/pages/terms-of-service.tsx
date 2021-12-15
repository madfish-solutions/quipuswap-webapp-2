import React, { useContext } from 'react';

import { Card, CardContent } from '@quipuswap/ui-kit';
import s from '@styles/Terms.module.sass';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import { EnTermsOfUse } from '@content/en/terms-of-use';
import { RuTermsOfUse } from '@content/ru/terms-of-use';
import { BaseLayout } from '@layouts/BaseLayout';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

const TermsOfUse: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation(['terms', 'common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const content = router.locale === 'ru' ? <RuTermsOfUse /> : <EnTermsOfUse />;

  return (
    <BaseLayout
      title={t('terms|Terms of Usage')}
      description={t('terms|Terms of Usage page description. Couple sentences...')}
      className={cx(s.wrapper, modeClass[colorThemeMode])}
    >
      <Card>
        <CardContent className={s.content}>{content}</CardContent>
      </Card>
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'terms']))
  }
});

// eslint-disable-next-line import/no-default-export
export default TermsOfUse;
