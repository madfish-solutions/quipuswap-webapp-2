import { FC, useContext } from 'react';

import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { BaseLayout } from '@components/common/BaseLayout';
import { StakingListPage } from '@containers/staking';
import { ListStats } from '@containers/staking/list/list-stats/list-stats';
import { StakeDataProvider, StakeListDataProvider } from '@containers/staking/providers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { SITE_DESCRIPTION, SITE_TITLE } from '@seo.config';
import s from '@styles/PrivacyPolicy.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const StakingList: FC = () => {
  const { t } = useTranslation(['common', 'privacy']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <BaseLayout
      title={t(`privacy|Stake - ${SITE_TITLE}`)}
      description={t(`privacy|${SITE_DESCRIPTION}`)}
      className={cx(s.wrapper, modeClass[colorThemeMode])}
    >
      <StakeDataProvider>
        <StakeListDataProvider>
          <ListStats />
          <StakingListPage />
        </StakeListDataProvider>
      </StakeDataProvider>
    </BaseLayout>
  );
};

// eslint-disable-next-line import/no-default-export
export default StakingList;
