import { FC, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { HIDE_ANALYTICS } from '@config/config';
import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { eQuipuSwapVideo } from '@config/youtube';
import {
  Card,
  DashPlug,
  DetailsCardCell,
  RateView,
  StateCurrencyAmount,
  StatePriceImpact,
  Tabs,
  ViewPairAnlytics,
  YouTube
} from '@shared/components';
import { isEmptyArray } from '@shared/helpers';
import { useYoutubeTabs } from '@shared/hooks';
import { DexPair, Nullable, Token, Undefined } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { Route } from '../route';
import { dexRouteToQuipuUiKitRoute } from './swap-details.helpers';

interface SwapDetailsProps {
  fee: Nullable<BigNumber>;
  feeError: Undefined<Error>;
  priceImpact: Nullable<BigNumber>;
  inputToken?: Token;
  outputToken?: Token;
  route?: DexPair[];
  buyRate: Nullable<BigNumber>;
  sellRate: Nullable<BigNumber>;
  shouldHideRouteRow: boolean;
}

const FALLBACK_ROUTE: DexPair[] = [];

export const SwapDetails: FC<SwapDetailsProps> = ({
  fee,
  feeError,
  priceImpact,
  inputToken,
  outputToken,
  route,
  buyRate,
  sellRate,
  shouldHideRouteRow
}) => {
  const { t } = useTranslation();
  const { isDetails, tabsContent, activeId, setTabId } = useYoutubeTabs({
    detailsLabel: t('swap|exchangeDetails'),
    page: t('common|Swap')
  });

  const routes = useMemo(() => {
    if (route) {
      return inputToken ? dexRouteToQuipuUiKitRoute(inputToken, route) : [];
    }

    return undefined;
  }, [inputToken, route]);

  const fallbackInputToken = TEZOS_TOKEN;
  const fallbackOutputToken = QUIPU_TOKEN;
  const inputTokenWithFallback = inputToken ?? fallbackInputToken;
  const outputTokenWithFallback = outputToken ?? fallbackOutputToken;

  return (
    <Card
      header={{
        content: <Tabs values={tabsContent} activeId={activeId} setActiveId={setTabId} className={styles.tabs} />,
        className: styles.header
      }}
      contentClassName={styles.content}
      data-test-id="exchangeDetails"
    >
      {isDetails ? (
        <>
          <DetailsCardCell
            cellName={t('common|Sell Price')}
            tooltipContent={t(
              'common|The amount of token B you receive for 1 token A, according to the current exchange rate.'
            )}
            className={styles.cell}
            data-test-id="sellPrice"
          >
            <RateView rate={sellRate} inputToken={inputTokenWithFallback} outputToken={outputTokenWithFallback} />
          </DetailsCardCell>

          <DetailsCardCell
            cellName={t('common|Buy Price')}
            tooltipContent={t(
              'common|The amount of token A you receive for 1 token B according to the current exchange rate.'
            )}
            className={styles.cell}
            data-test-id="buyPrice"
          >
            <RateView rate={buyRate} inputToken={outputTokenWithFallback} outputToken={inputTokenWithFallback} />
          </DetailsCardCell>

          <DetailsCardCell
            cellName={t('common|Price impact')}
            tooltipContent={t('swap|The impact your transaction is expected to make on the exchange rate.')}
            className={styles.cell}
            data-test-id="priceImpact"
          >
            <StatePriceImpact priceImpact={priceImpact} />
          </DetailsCardCell>

          <DetailsCardCell
            cellName={t('common|Fee')}
            tooltipContent={t('swap|Expected fee for this transaction charged by the Tezos blockchain.')}
            className={styles.cell}
            data-test-id="fee"
          >
            <StateCurrencyAmount isError={Boolean(feeError)} amount={fee} currency="TEZ" />
          </DetailsCardCell>

          {!shouldHideRouteRow && (
            <DetailsCardCell
              cellName={t('common|Route')}
              tooltipContent={t(
                "swap|When a direct swap is impossible (no liquidity pool for the pair exists yet) QuipuSwap's algorithm will conduct the swap in several transactions, picking the most beneficial chain of trades."
              )}
              className={cx(styles.cell, styles.routeLine)}
              data-test-id="route"
            >
              {isEmptyArray(routes ?? null) ? <DashPlug animation={!routes} /> : <Route routes={routes!} />}
            </DetailsCardCell>
          )}

          {!HIDE_ANALYTICS && (
            <ViewPairAnlytics
              route={route ?? FALLBACK_ROUTE}
              className={styles.detailsButtons}
              buttonClassName={styles.detailsButton}
              iconClassName={styles.linkIcon}
            />
          )}
        </>
      ) : (
        <YouTube video={eQuipuSwapVideo.HowToSwapUnlistedTokens} />
      )}
    </Card>
  );
};
