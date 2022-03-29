import { FC, useContext } from 'react';

import { Card, CardContent } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { Layout } from 'layout';
import { ColorModes, ColorThemeContext } from '@providers';
import { SITE_DESCRIPTION, SITE_TITLE } from '@config';
import s from '@styles/Terms.module.sass';

import { EnTermsOfService } from './content/en-terms-of-service';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const TermsOfService: FC = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Layout
      title={(`terms|Terms of Usage - ${SITE_TITLE}`)}
      description={(`terms|${SITE_DESCRIPTION}`)}
      className={cx(s.wrapper, modeClass[colorThemeMode])}
    >
      <Card>
        <CardContent className={s.content}>
          <EnTermsOfService />
        </CardContent>
      </Card>
    </Layout>
  );
};

// eslint-disable-next-line import/no-default-export
export default TermsOfService;
