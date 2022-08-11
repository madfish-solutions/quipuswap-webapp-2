import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { QuipuSwapVideo } from '@config/constants';
import { Card, Tabs, YouTube } from '@shared/components';
import commonContainerStyles from '@styles/CommonContainer.module.scss';

import { DetailsInfo } from '../details-info';
import { useDetailsViewModel } from './use-details.vm';
import { useTabs } from './use-tabs.vm';

export const Details: FC = observer(() => {
  const detailsInfoParams = useDetailsViewModel();
  const { isDetails, tabsContent, activeId, setTabId } = useTabs();

  return (
    <Card
      header={{
        content: (
          <Tabs
            values={tabsContent}
            activeId={activeId}
            setActiveId={setTabId}
            className={commonContainerStyles.tabs}
          />
        ),
        className: commonContainerStyles.header
      }}
      contentClassName={commonContainerStyles.content}
      data-test-id="stableswapDetails"
    >
      {isDetails ? (
        <DetailsInfo {...detailsInfoParams} />
      ) : (
        <YouTube videoId={QuipuSwapVideo.HowToAddLiquidityToTheStableSwap} />
      )}
    </Card>
  );
});
