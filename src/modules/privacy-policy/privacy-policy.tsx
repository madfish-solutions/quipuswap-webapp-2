import { FC, useContext } from 'react';

import { Card, CardContent, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { SITE_DESCRIPTION, SITE_TITLE } from '@config/seo.config';

import { Layout } from '../../layout';
import { EnPrivacyPolicy } from './content/en-privacy-policy';
import styles from './privacy-policy.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const PrivacyPolicy: FC = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Layout
      title={`privacy|Privacy Policy - ${SITE_TITLE}`}
      description={`privacy|${SITE_DESCRIPTION}`}
      className={cx(styles.wrapper, modeClass[colorThemeMode])}
    >
      <Card>
        <CardContent className={styles.content}>
          <EnPrivacyPolicy />
        </CardContent>
      </Card>
    </Layout>
  );
};

// eslint-disable-next-line import/no-default-export
export default PrivacyPolicy;
