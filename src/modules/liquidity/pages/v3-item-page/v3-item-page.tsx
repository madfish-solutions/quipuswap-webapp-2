import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { Skeleton, StateWrapper, StickyBlock } from '@shared/components';
import { useTranslation } from '@translation';

import { PageTitleContainer, PositionDetails, PositionFeesList } from './components';
import { useV3ItemPageViewModel } from './use-v3-item-page.vm';
import styles from './v3-item-page.module.scss';

export const V3ItemPage: FC = observer(() => {
  const { t } = useTranslation();
  const { isLoading } = useV3ItemPageViewModel();

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
        <PositionDetails />
      </StickyBlock>
    </>
  );
});
