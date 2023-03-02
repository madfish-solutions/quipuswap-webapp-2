import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DOLLAR, PERCENT } from '@config/constants';
import { LiquidityLabels } from '@modules/liquidity/components';
import { Button, Card, DetailsCardCell, StateCurrencyAmount } from '@shared/components';
import { ExternalLink } from '@shared/svg';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { PriceView } from '../price-view';
import { TokensOrderSwitcher } from '../tokens-order-switcher';
import styles from './pool-details-create.module.scss';
import { usePoolDetailsCreateViewModel } from './use-pool-details-create.vm';

export const PoolDetailsCreate: FC = observer(() => {
  const { t } = useTranslation();
  const {
    poolContractUrl,
    tvl,
    feeBps,
    currentPrice,
    tokenXSymbol,
    tokenXAmount,
    tokenYSymbol,
    tokenYAmount,
    categories,
    volume,
    apr
  } = usePoolDetailsCreateViewModel();

  return (
    <Card
      header={{
        content: (
          <div className={styles.cardHeader}>
            {t('liquidity|poolDetails')}
            <TokensOrderSwitcher className={styles.tokenSwitcher} />
          </div>
        ),
        className: styles.header
      }}
      contentClassName={styles.contentClassName}
    >
      <DetailsCardCell
        cellName={t('liquidity|tags')}
        tooltipContent={t('liquidity|tvlV3PoolTooltip')}
        className={styles.deviantBehavior}
      >
        <LiquidityLabels categories={categories} colored={true} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('liquidity|TVL')} tooltipContent={t('liquidity|tvlV3PoolTooltip')}>
        <StateCurrencyAmount amount={tvl} currency={DOLLAR} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|currentPrice')} tooltipContent={t('liquidity|currentPriceTooltip')}>
        <PriceView price={currentPrice} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|volume')} tooltipContent={t('liquidity|weeklyVolumeV3PoolTooltip')}>
        <StateCurrencyAmount amount={volume} currency={DOLLAR} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|APR')} tooltipContent={t('liquidity|aprTooltip')}>
        <StateCurrencyAmount amount={apr} currency={DOLLAR} />
      </DetailsCardCell>

      <DetailsCardCell cellName={t('liquidity|feeRate')} tooltipContent={t('liquidity|feeRateTooltip')}>
        <StateCurrencyAmount amount={feeBps} currency={PERCENT} />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('liquidity|tokenReserves', { tokenSymbol: tokenXSymbol })}
        tooltipContent={t('liquidity|tokenReservesTooltip')}
      >
        <StateCurrencyAmount amount={tokenXAmount} currency={tokenXSymbol} />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('liquidity|tokenReserves', { tokenSymbol: tokenYSymbol })}
        tooltipContent={t('liquidity|tokenQuoteReservesTooltip')}
      >
        <StateCurrencyAmount amount={tokenYAmount} currency={tokenYSymbol} />
      </DetailsCardCell>
      <div className={commonContainerStyles.detailsButtons}>
        <Button
          className={commonContainerStyles.detailsButton}
          theme="inverse"
          href={poolContractUrl}
          external
          icon={<ExternalLink className={commonContainerStyles.linkIcon} />}
          data-test-id="v3ItemContractButton"
        >
          {t('liquidity|Pair Contract')}
        </Button>
      </div>
    </Card>
  );
});
