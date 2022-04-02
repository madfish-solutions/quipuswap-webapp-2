import { FC, useMemo } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { HIDE_ANALYTICS, networksDefaultTokens, NETWORK_ID, TEZOS_TOKEN } from '@config/config';
import {
  Card,
  DashPlug,
  DetailsCardCell,
  RateView,
  StateCurrencyAmount,
  StatePriceImpact,
  ViewPairAnlytics
} from '@shared/components';
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
}

export const SwapDetails: FC<SwapDetailsProps> = ({
  fee,
  feeError,
  priceImpact,
  inputToken,
  outputToken,
  route = [],
  buyRate,
  sellRate
}) => {
  const { t } = useTranslation(['common', 'swap']);
  const routes = useMemo(() => (inputToken ? dexRouteToQuipuUiKitRoute(inputToken, route) : []), [inputToken, route]);

  const fallbackInputToken = TEZOS_TOKEN;
  const fallbackOutputToken = networksDefaultTokens[NETWORK_ID];
  const inputTokenWithFallback = inputToken ?? fallbackInputToken;
  const outputTokenWithFallback = outputToken ?? fallbackOutputToken;

  return (
    <Card
      header={{
        content: `Exchange Details`
      }}
      contentClassName={styles.content}
    >
      <DetailsCardCell
        cellName={t('common|Sell Price')}
        tooltipContent={t(
          'common|The amount of token B you receive for 1 token A, according to the current exchange rate.'
        )}
        className={styles.cell}
      >
        <RateView rate={sellRate} inputToken={inputTokenWithFallback} outputToken={outputTokenWithFallback} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Buy Price')}
        tooltipContent={t(
          'common|The amount of token A you receive for 1 token B according to the current exchange rate.'
        )}
        className={styles.cell}
      >
        <RateView rate={buyRate} inputToken={outputTokenWithFallback} outputToken={inputTokenWithFallback} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Price impact')}
        tooltipContent={t('swap|The impact your transaction is expected to make on the exchange rate.')}
        className={styles.cell}
      >
        <StatePriceImpact priceImpact={priceImpact} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Fee')}
        tooltipContent={t('swap|Expected fee for this transaction charged by the Tezos blockchain.')}
        className={styles.cell}
      >
        <StateCurrencyAmount isError={Boolean(feeError)} amount={fee} currency="TEZ" />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Route')}
        tooltipContent={t(
          "swap|When a direct swap is impossible (no liquidity pool for the pair exists yet) QuipuSwap's algorithm will conduct the swap in several transactions, picking the most beneficial chain of trades."
        )}
        className={cx(styles.cell, styles.routeLine)}
      >
        {Boolean(routes.length) ? <Route routes={routes} /> : <DashPlug animation={false} />}
      </DetailsCardCell>

      {!HIDE_ANALYTICS && (
        <ViewPairAnlytics
          route={route}
          className={styles.detailsButtons}
          buttonClassName={styles.detailsButton}
          iconClassName={styles.linkIcon}
        />
      )}
    </Card>
  );
};
