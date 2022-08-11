import { FC } from 'react';

import { QuipuSwapVideo } from '@config/constants';
import { Card, Iterator, SettingsButton, Tabs, YouTube } from '@shared/components';
import { Nullable, Token } from '@shared/types';
import s from '@styles/CommonContainer.module.scss';

import styles from '../liquidity.module.scss';
import { AddLiquidityForm } from './add-liquidity-form';
import { LiquidityDetails } from './liquidity-details';
import { LiquidityTabs, TABS_CONTENT } from './liquidity-tabs';
import { RemoveLiquidityForm } from './remove-liquidity-form';
import { useLiquidityFormService } from './use-liquidity-form.service';
import { useTabs } from './use-tabs.vm';

interface Props {
  onTokensChange: (token1: Nullable<Token>, token2: Nullable<Token>) => void;
}

export const LiquidityCards: FC<Props> = ({ onTokensChange }) => {
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
  const { isDetails, tabsContent, activeId, setTabId } = useTabs();
  const isAddTabActive = tab.id === 'add';

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs
              values={TABS_CONTENT}
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
          content: <Tabs values={tabsContent} activeId={activeId} setActiveId={setTabId} className={s.tabs} />,
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
              { videoId: QuipuSwapVideo.HowToAddLiquidityToAnExistingLiquidityPool },
              { videoId: QuipuSwapVideo.HowToSeeLPTokensInYourWallet },
              { videoId: QuipuSwapVideo.HowToRemoveLiquidityFromTheLiquidityPool },
              { videoId: QuipuSwapVideo.HowToAddANewLiquidityPoolToQuipuSwap }
            ]}
          />
        )}
      </Card>
    </>
  );
};
