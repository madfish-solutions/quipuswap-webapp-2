import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PERCENT } from '@config/constants';
import { LiquidityLabels } from '@modules/liquidity/components';
import { Button, Card, DetailsCardCell, StateCurrencyAmount } from '@shared/components';
import { ExternalLink } from '@shared/svg';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './position-details.module.scss';
import { usePositionDetailsViewModel } from './use-position-details.vm';
import { useShouldShowTokenXToYPrice } from '../../hooks';
import { PositionStatus } from '../position-status';
import { PriceView } from '../price-view';
import { TokensOrderSwitcher } from '../tokens-order-switcher';

export const PositionDetails: FC = observer(() => {
  const { t } = useTranslation();
  const { poolContractUrl, id, feeBps, currentPrice, minPrice, maxPrice, isInRange, categories } =
    usePositionDetailsViewModel();
  const shouldShowTokenXToYPrice = useShouldShowTokenXToYPrice();

  return (
    <Card
      header={{
        content: (
          <div className={styles.cardHeader}>
            {t('liquidity|positionDetails')}
            <TokensOrderSwitcher className={styles.tokenSwitcher} />
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
        <PriceView price={currentPrice} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|feeRate')} tooltipContent={t('liquidity|feeRateTooltipPosDetails')}>
        <StateCurrencyAmount amount={feeBps} currency={PERCENT} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|minPrice')} tooltipContent={t('liquidity|minPriceTooltip')}>
        <PriceView price={shouldShowTokenXToYPrice ? maxPrice : minPrice} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|maxPrice')} tooltipContent={t('liquidity|maxPriceTooltip')}>
        <PriceView price={shouldShowTokenXToYPrice ? minPrice : maxPrice} />
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
