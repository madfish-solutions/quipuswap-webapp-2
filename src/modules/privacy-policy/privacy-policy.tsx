import { FC, useContext } from 'react';

import { Card, CardContent } from '@quipuswap/ui-kit';
import cx from 'classnames';
// import { useTranslation } from '../../shared/hooks/use-translation';

import { Layout } from 'layout';
import { ColorModes, ColorThemeContext } from '@providers';
import { SITE_DESCRIPTION, SITE_TITLE } from '@config';
import s from '@styles/PrivacyPolicy.module.sass';

import { EnPrivacyPolicy } from './content/en-privacy-policy';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const PrivacyPolicy: FC = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Layout
      title={`privacy|Privacy Policy - ${SITE_TITLE}`}
      description={`privacy|${SITE_DESCRIPTION}`}
      className={cx(s.wrapper, modeClass[colorThemeMode])}
    >
      <Card>
        <CardContent className={s.content}>
          <EnPrivacyPolicy />
        </CardContent>
      </Card>
    </Layout>
  );
};

// eslint-disable-next-line import/no-default-export
export default PrivacyPolicy;
