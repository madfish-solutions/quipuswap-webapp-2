import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { Skeleton, StateWrapper, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { PageTitleContainer, PositionDetails, PositionFeesList } from './components';
import { V3AddLiqForm } from './components/forms/v3-add-liq-form';
import { V3RemoveLiqForm } from './components/forms/v3-remove-liq-form';
import { LiquidityV3FormTabsCard } from './components/liquidity-v3-form-tabs-card';
import { useV3ItemPageViewModel } from './use-v3-item-page.vm';
import styles from './v3-item-page.module.scss';

export const V3ItemPage: FC = observer(() => {
  const { t } = useTranslation();
  const { isLoading, isAddLiqForm, tabId, isBlocked } = useV3ItemPageViewModel();

  return (
    <>
      <PageTitleContainer dataTestId="v3LiqTitle" titleText={t('liquidity|position')} />
      <StateWrapper
        isLoading={isLoading}
        loaderFallback={<Skeleton className={cx(styles.positionFeesSkeleton, styles.mb48)} />}
      >
        <PositionFeesList />
      </StateWrapper>
      <StickyBlock>
        <LiquidityV3FormTabsCard tabActiveId={tabId}>
          {isAddLiqForm ? (
            isBlocked ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '88px',
                  background: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'rgba(255, 255, 0, 0.8)',
                  paddingLeft: 8
                }}
              >
                <p>The deposits to the pool are paused.</p>
              </div>
            ) : (
              <V3AddLiqForm />
            )
          ) : (
            <V3RemoveLiqForm />
          )}
        </LiquidityV3FormTabsCard>
        <PositionDetails />
      </StickyBlock>
    </>
  );
});
