import { FC, useContext } from 'react';

import { Card, CardContent } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { BaseLayout } from '@components/common/BaseLayout';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import s from '@styles/Terms.module.sass';

import { EnTermsOfService } from './content/en-terms-of-service';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const TermsOfService: FC = () => {
  const { t } = useTranslation(['terms', 'common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <BaseLayout
      title={t('terms|Terms of Usage')}
      description={t('terms|Terms of Usage page description. Couple sentences...')}
      className={cx(s.wrapper, modeClass[colorThemeMode])}
    >
      <Card>
        <CardContent className={s.content}>
          <EnTermsOfService />
        </CardContent>
      </Card>
    </BaseLayout>
  );
};
