import { FC, useContext } from 'react';

import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { BaseLayout } from '@components/common/BaseLayout';
import { FarmsListPage } from '@containers/farming';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { SITE_DESCRIPTION, SITE_TITLE } from '@seo.config';
import s from '@styles/PrivacyPolicy.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const FarmsList: FC = () => {
  const { t } = useTranslation(['common', 'privacy']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <BaseLayout
      title={t(`privacy|Stake - ${SITE_TITLE}`)}
      description={t(`privacy|${SITE_DESCRIPTION}`)}
      className={cx(s.wrapper, modeClass[colorThemeMode])}
    >
      <FarmsListPage />
    </BaseLayout>
  );
};

// eslint-disable-next-line import/no-default-export
export default FarmsList;
