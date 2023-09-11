import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { eQuipuSwapVideo } from '@config/youtube';
import { Card, Iterator, Opportunity, Tabs, YouTube } from '@shared/components';
import { isEmptyArray } from '@shared/helpers';
import { useYoutubeTabs } from '@shared/hooks';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { useDexTwoDetailsViewModel } from './dex-two-details.vm';
import { DexTwoDetailsView } from '../dex-two-details-view';

export const DexTwoDetails: FC = observer(() => {
  const { t } = useTranslation();
  const { detailsViewProps, opportunities } = useDexTwoDetailsViewModel();
  const { isDetails, tabsContent, activeId, setTabId } = useYoutubeTabs({
    detailsLabel: t('liquidity|poolDetails'),
    page: t('common|Liquidity')
  });

  return (
    <div>
      {!isEmptyArray(opportunities) && (
        <Iterator
          render={Opportunity}
          data={opportunities}
          wrapperClassName={commonContainerStyles.opportunitiesWrapper}
          isGrouped
        />
      )}

      <Card
        header={{
          content: (
            <Tabs
              tabs={tabsContent}
              activeId={activeId}
              setActiveId={setTabId}
              className={commonContainerStyles.tabs}
            />
          ),
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
            wrapperClassName={commonContainerStyles.youtubeList}
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
    </div>
  );
});
