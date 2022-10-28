import { FC } from 'react';

import { eQuipuSwapVideo } from '@config/youtube';
import { Card, Iterator, Tabs, YouTube } from '@shared/components';
import { useYoutubeTabs } from '@shared/hooks';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import s from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { DexTwoDetailsView } from '../dex-two-details-view';
import { useDexTwoDetailsViewModel } from './dex-two-details.vm';

export const DexTwoDetails: FC = () => {
  const { t } = useTranslation();
  const detailsViewProps = useDexTwoDetailsViewModel();
  const { isDetails, tabsContent, activeId, setTabId } = useYoutubeTabs({
    detailsLabel: t('liquidity|poolDetails'),
    page: t('common|Liquidity')
  });

  return (
    <Card
      header={{
        content: <Tabs tabs={tabsContent} activeId={activeId} setActiveId={setTabId} className={s.tabs} />,
        className: commonContainerStyles.header
      }}
      contentClassName={commonContainerStyles.content}
      data-test-id="dexTwoDetails"
    >
      {isDetails ? (
        <DexTwoDetailsView {...detailsViewProps} />
      ) : (
        <Iterator
          isGrouped
          wrapperClassName={s.youtubeList}
          render={YouTube}
          data={[
            { video: eQuipuSwapVideo.HowToAddLiquidityToAnExistingLiquidityPool },
            { video: eQuipuSwapVideo.HowToSeeLPTokensInYourWallet },
            { video: eQuipuSwapVideo.HowToRemoveLiquidityFromTheLiquidityPool },
            { video: eQuipuSwapVideo.HowToAddANewLiquidityPoolToQuipuSwap }
          ]}
        />
      )}
    </Card>
  );
};
