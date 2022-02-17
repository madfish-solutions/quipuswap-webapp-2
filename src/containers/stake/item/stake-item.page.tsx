import { useContext } from 'react';

import { StickyBlock } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { BaseLayout } from '@components/common/BaseLayout';
import { PageTitle } from '@components/common/page-title';
import { DashPlug } from '@components/ui/dash-plug';
import { StakeListItemProps } from '@containers/stake/list/structures';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { SITE_DESCRIPTION, SITE_TITLE } from '@seo.config';
import s from '@styles/PrivacyPolicy.module.sass';

import { StakingDetails } from './components/staking-details';
import { WrappedStakingForm } from './components/staking-form';
import { StakingProvider } from './helpers/staking.provider';
import stakingPageStyles from './stake-item.page.module.sass';

interface StakeItemProps {
  data: StakeListItemProps | null;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const StakeItem = ({ data }: StakeItemProps) => {
  const { t } = useTranslation(['common', 'privacy']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <StakingProvider>
      <BaseLayout
        title={t(`privacy|Stake - ${SITE_TITLE}`)}
        description={t(`privacy|${SITE_DESCRIPTION}`)}
        className={cx(s.wrapper, modeClass[colorThemeMode])}
      >
        <PageTitle>
          {data ? (
            `${data.tokenA.metadata.symbol}/${data.tokenB.metadata.symbol}`
          ) : (
            <DashPlug animation={true} className={stakingPageStyles.titleLoader} zoom={1.45} />
          )}
        </PageTitle>

        {/* TODO: add items between that */}

        <StickyBlock>
          <WrappedStakingForm />
          <StakingDetails />
        </StickyBlock>
      </BaseLayout>
    </StakingProvider>
  );
};
