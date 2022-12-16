import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DOLLAR, PERCENT } from '@config/constants';
import { LiquidityLabels } from '@modules/liquidity/components';
import { Button, Card, DetailsCardCell, StateCurrencyAmount, AssetSwitcher } from '@shared/components';
import { ExternalLink } from '@shared/svg';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './position-details-create.module.scss';
import { usePositionDetailsCreateViewModel } from './use-position-details-create.vm';

export const PositionDetailsCreate: FC = observer(() => {
  const { t } = useTranslation();
  const {
    poolContractUrl,
    tvl,
    feeBps,
    currentPrice,
    tokensSymbols,
    tokenXSymbol,
    tokenXAmount,
    tokenYSymbol,
    tokenYAmount,
    tokenActiveIndex,
    handleButtonClick
  } = usePositionDetailsCreateViewModel();

  return (
    <Card
      header={{
        content: (
          <div className={styles.cardHeader}>
            {t('liquidity|poolDetails')}
            <AssetSwitcher
              labels={[tokenYSymbol, tokenXSymbol]}
              activeIndex={tokenActiveIndex}
              handleButtonClick={handleButtonClick}
              className={styles.tokenSwitcher}
            />
          </div>
        ),
        className: styles.header
      }}
      contentClassName={styles.contentClassName}
    >
      <DetailsCardCell cellName={t('liquidity|tags')} tooltipContent={t('liquidity|tvlV3PoolTooltip')}>
        <LiquidityLabels categories={[]} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|TVL')} tooltipContent={t('liquidity|tvlV3PoolTooltip')}>
        <StateCurrencyAmount amount={tvl} currency={DOLLAR} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|volume')} tooltipContent={t('liquidity|weeklyVolumeV3PoolTooltip')}>
        <StateCurrencyAmount amount={1} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|currentPrice')} tooltipContent={t('liquidity|currentPriceTooltip')}>
        <StateCurrencyAmount amount={currentPrice} currency={tokensSymbols} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|feeRate')} tooltipContent={t('liquidity|feesRateTooltip')}>
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
        tooltipContent={t('liquidity|tokenReservesTooltip')}
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
