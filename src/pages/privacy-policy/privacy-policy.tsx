import { FC, useContext } from 'react';

import { Card, CardContent } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from '../../shared/hooks/use-translation';

import { BaseLayout } from '@components/common/BaseLayout';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { SITE_DESCRIPTION, SITE_TITLE } from '@seo.config';
import s from '@styles/PrivacyPolicy.module.sass';

import { EnPrivacyPolicy } from './content/en-privacy-policy';

// const useTranslations = (scopes: string[]) => {
//   const { t } = useTranslation(scopes);

//   return { t };
// };

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const PrivacyPolicy: FC = () => {
  const { t } = useTranslation();
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <BaseLayout
      title={t(`privacy|Privacy Policy - ${SITE_TITLE}`)}
      description={t(`privacy|${SITE_DESCRIPTION}`)}
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
