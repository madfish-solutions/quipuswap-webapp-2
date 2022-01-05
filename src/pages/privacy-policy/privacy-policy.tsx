import { FC, useContext } from 'react';

import { Card, CardContent } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { BaseLayout } from '@components/common/BaseLayout';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import s from '@styles/PrivacyPolicy.module.sass';

import { EnPrivacyPolicy } from './content/en-privacy-policy';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const PrivacyPolicy: FC = () => {
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
          <EnPrivacyPolicy />
        </CardContent>
      </Card>
    </BaseLayout>
  );
};

// eslint-disable-next-line import/no-default-export
export default PrivacyPolicy;
