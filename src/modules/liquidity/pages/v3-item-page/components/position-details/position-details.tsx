import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PERCENT } from '@config/constants';
import { LiquidityLabels } from '@modules/liquidity/components';
import { Button, Card, DetailsCardCell, StateCurrencyAmount, AssetSwitcher } from '@shared/components';
import { ExternalLink } from '@shared/svg';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { PositionStatus } from '../position-status';
import styles from './position-details.module.scss';
import { usePositionDetailsViewModel } from './use-position-details.vm';

export const PositionDetails: FC = observer(() => {
  const { t } = useTranslation();
  const {
    poolContractUrl,
    id,
    feeBps,
    currentPrice,
    tokensSymbols,
    tokenXSymbol,
    tokenYSymbol,
    tokenActiveIndex,
    handleButtonClick,
    minPrice,
    maxPrice,
    isInRange,
    categories
  } = usePositionDetailsViewModel();

  return (
    <Card
      header={{
        content: (
          <div className={styles.cardHeader}>
            {t('liquidity|positionDetails')}
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
      <DetailsCardCell
        cellName={t('liquidity|tags')}
        tooltipContent={t('liquidity|tagsTooltip')}
        className={styles.deviantBehavior}
      >
        <LiquidityLabels categories={categories} colored={true} />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('liquidity|status')}
        tooltipContent={t('liquidity|statusTooltip')}
        className={styles.deviantBehavior}
      >
        <PositionStatus isInRange={isInRange} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|id')} tooltipContent={t('liquidity|idTooltip')}>
        <StateCurrencyAmount amount={id} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|currentPrice')} tooltipContent={t('liquidity|currentPriceTooltip')}>
        <StateCurrencyAmount amount={currentPrice} currency={tokensSymbols} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|feeRate')} tooltipContent={t('liquidity|feeRateTooltipPosDetails')}>
        <StateCurrencyAmount amount={feeBps} currency={PERCENT} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|minPrice')} tooltipContent={t('liquidity|minPriceTooltip')}>
        <StateCurrencyAmount amount={minPrice} currency={tokensSymbols} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|maxPrice')} tooltipContent={t('liquidity|maxPriceTooltip')}>
        <StateCurrencyAmount amount={maxPrice} currency={tokensSymbols} />
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
