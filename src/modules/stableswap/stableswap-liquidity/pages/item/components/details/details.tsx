import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { eQuipuSwapVideo } from '@config/youtube';
import { Card, Tabs, YouTube } from '@shared/components';
import { useYoutubeTabs } from '@shared/hooks';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { DetailsView } from '../details-view';
import { useDetailsViewModel } from './use-details.vm';

export const Details: FC = observer(() => {
  const detailsInfoParams = useDetailsViewModel();
  const { t } = useTranslation();
  const { isDetails, tabsContent, activeId, setTabId } = useYoutubeTabs({
    detailsLabel: t('common|Pool Details'),
    page: t('common|Stableswap') + t('common|Liquidity')
  });

  return (
    <Card
      header={{
        content: (
          <Tabs tabs={tabsContent} activeId={activeId} setActiveId={setTabId} className={commonContainerStyles.tabs} />
        ),
        className: commonContainerStyles.header
      }}
      contentClassName={commonContainerStyles.content}
      data-test-id="stableswapDetails"
    >
      {isDetails ? (
        <DetailsView {...detailsInfoParams} />
      ) : (
        <YouTube video={eQuipuSwapVideo.HowToAddLiquidityToTheStableSwap} />
      )}
    </Card>
  );
});
