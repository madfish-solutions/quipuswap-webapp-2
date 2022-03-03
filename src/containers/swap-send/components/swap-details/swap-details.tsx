import { FC, useMemo } from 'react';

import { Card } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { NETWORK_ID, networksDefaultTokens, TEZOS_TOKEN } from '@app.config';
import { RateView } from '@components/common/pair-details/rate-view';
import { DashPlug } from '@components/ui/dash-plug';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { StatePriceImpact } from '@components/ui/state-components/price-impact';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { ViewPairAnlitics } from '@components/ui/view-pair-analitics';
import s from '@styles/CommonContainer.module.sass';
import { DexPair, Nullable, Token, Undefined } from '@utils/types';

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
      contentClassName={s.content}
    >
      <DetailsCardCell
        cellName={t('common|Sell Price')}
        tooltipContent={t(
          'common|The amount of token B you receive for 1 token A, according to the current exchange rate.'
        )}
        className={s.cell}
      >
        <RateView rate={sellRate} inputToken={inputTokenWithFallback} outputToken={outputTokenWithFallback} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Buy Price')}
        tooltipContent={t(
          'common|The amount of token A you receive for 1 token B according to the current exchange rate.'
        )}
        className={s.cell}
      >
        <RateView rate={buyRate} inputToken={outputTokenWithFallback} outputToken={inputTokenWithFallback} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Price impact')}
        tooltipContent={t('swap|The impact your transaction is expected to make on the exchange rate.')}
        className={s.cell}
      >
        <StatePriceImpact priceImpact={priceImpact} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Fee')}
        tooltipContent={t('swap|Expected fee for this transaction charged by the Tezos blockchain.')}
        className={s.cell}
      >
        <StateCurrencyAmount isError={Boolean(feeError)} amount={fee} currency="TEZ" />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Route')}
        tooltipContent={t(
          "swap|When a direct swap is impossible (no liquidity pool for the pair exists yet) QuipuSwap's algorithm will conduct the swap in several transactions, picking the most beneficial chain of trades."
        )}
        className={cx(s.cell, s.routeLine)}
      >
        {Boolean(routes.length) ? <Route routes={routes} /> : <DashPlug animation={false} />}
      </DetailsCardCell>

      <ViewPairAnlitics
        route={route}
        className={s.detailsButtons}
        buttonClassName={s.detailsButton}
        iconClassName={s.linkIcon}
      />
    </Card>
  );
};
