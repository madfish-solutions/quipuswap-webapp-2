import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DOLLAR, PERCENT } from '@config/constants';
import {
  Button,
  Card,
  DetailsCardCell,
  DetailsCardCellWithComponent,
  StateCurrencyAmount,
  AssetSwitcher
} from '@shared/components';
import { ExternalLink } from '@shared/svg';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './pool-details.module.scss';
import { usePoolDetailsViewModel } from './use-pool-details.vm';

export const PoolDetails: FC = observer(() => {
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
  } = usePoolDetailsViewModel();

  return (
    <Card header={{ content: t('liquidity|poolDetails') }} contentClassName={styles.contentClassName}>
      <DetailsCardCell cellName={t('liquidity|TVL')} tooltipContent={t('liquidity|tvlV3PoolTooltip')}>
        <StateCurrencyAmount amount={tvl} currency={DOLLAR} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('liquidity|volume')} tooltipContent={t('liquidity|weeklyVolumeV3PoolTooltip')}>
        <StateCurrencyAmount amount={1} />
      </DetailsCardCell>
      <DetailsCardCellWithComponent
        cellName={t('liquidity|currentPrice')}
        tooltipContent={t('liquidity|currentPriceTooltip')}
        component={
          <AssetSwitcher
            labels={[tokenYSymbol, tokenXSymbol]}
            activeIndex={tokenActiveIndex}
            handleButtonClick={handleButtonClick}
            className={styles.tokenSwitcher}
          />
        }
      >
        <StateCurrencyAmount amount={currentPrice} currency={tokensSymbols} />
      </DetailsCardCellWithComponent>
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
