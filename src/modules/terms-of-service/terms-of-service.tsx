import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext, Card, CardContent } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { SITE_DESCRIPTION, SITE_TITLE } from '@config/seo.config';

import { Layout } from '../../layout';
import { EnTermsOfService } from './content/en-terms-of-service';
import styles from './terms.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const TermsOfService: FC = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Layout
      title={`terms|Terms of Usage - ${SITE_TITLE}`}
      description={`terms|${SITE_DESCRIPTION}`}
      className={cx(styles.wrapper, modeClass[colorThemeMode])}
    >
      <Card>
        <CardContent className={styles.content}>
          <EnTermsOfService />
        </CardContent>
      </Card>
    </Layout>
  );
};

// eslint-disable-next-line import/no-default-export
export default TermsOfService;
