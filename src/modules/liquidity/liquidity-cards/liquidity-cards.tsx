import { FC } from 'react';

import { eQuipuSwapVideo } from '@config/youtube';
import { Card, Iterator, SettingsButton, Tabs, YouTube } from '@shared/components';
import { useYoutubeTabs } from '@shared/hooks';
import { Nullable, Token } from '@shared/types';
import s from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from '../liquidity.module.scss';
import { AddLiquidityForm } from './add-liquidity-form';
import { LiquidityDetails } from './liquidity-details';
import { LiquidityTabs, TABS_CONTENT } from './liquidity-tabs';
import { RemoveLiquidityForm } from './remove-liquidity-form';
import { useLiquidityFormService } from './use-liquidity-form.service';

interface Props {
  onTokensChange: (token1: Nullable<Token>, token2: Nullable<Token>) => void;
}

export const LiquidityCards: FC<Props> = ({ onTokensChange }) => {
  const { t } = useTranslation();

  const {
    dex,
    tab,
    handleChangeTab,
    tokenA,
    tokenB,
    tokenALoading,
    tokenBLoading,
    handleChangeTokenA,
    handleChangeTokenB,
    handleChangeTokensPair
  } = useLiquidityFormService({ onTokensChange });
  const { isDetails, tabsContent, activeId, setTabId } = useYoutubeTabs({
    detailsLabel: t('liquidity|poolDetails'),
    page: t('common|Liquidity')
  });
  const isAddTabActive = tab.id === 'add';

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs
              tabs={TABS_CONTENT}
              activeId={tab.id}
              setActiveId={id => handleChangeTab(id as LiquidityTabs)}
              className={styles.tabs}
            />
          ),
          button: <SettingsButton colored />,
          className: styles.header
        }}
        contentClassName={styles.content}
        data-test-id="liquidityPageTokenSelect"
      >
        {isAddTabActive ? (
          <AddLiquidityForm
            dex={dex}
            tokenA={tokenA}
            tokenB={tokenB}
            tokenALoading={tokenALoading}
            tokenBLoading={tokenBLoading}
            onTokenAChange={handleChangeTokenA}
            onTokenBChange={handleChangeTokenB}
          />
        ) : (
          <RemoveLiquidityForm dex={dex} tokenA={tokenA} tokenB={tokenB} onChangeTokensPair={handleChangeTokensPair} />
        )}
      </Card>
      <Card
        header={{
          content: <Tabs tabs={tabsContent} activeId={activeId} setActiveId={setTabId} className={s.tabs} />,
          className: s.header
        }}
        contentClassName={styles.LiquidityDetails}
        data-test-id="poolDetails"
      >
        {isDetails ? (
          <LiquidityDetails dex={dex} tokenA={tokenA} tokenB={tokenB} />
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
    </>
  );
};
