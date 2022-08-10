import { FC } from 'react';

import cx from 'classnames';

import { TokenLocked } from '@modules/stableswap/components';
import {
  DetailsCardCell,
  StateWrapper,
  DashPlug,
  ContractHashWithCopy,
  StateCurrencyAmount,
  Iterator,
  StatePercentage,
  Button
} from '@shared/components';
import { ExternalLink } from '@shared/svg';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from '../details/details.module.scss';
import { useDetailsViewModel } from '../details/use-details.vm';

type Props = ReturnType<typeof useDetailsViewModel>;

export const DetailsInfo: FC<Props> = ({
  contractAddress,
  poolId,
  totalLpSupply,
  providersFee,
  interfaceFee,
  stakersFee,
  devFee,
  poolContractUrl,
  cardCellClassName,
  isLoading,
  tvlInUsd,
  tokensLockedData
}) => {
  const { t } = useTranslation();

  return (
    <>
      <DetailsCardCell
        cellName={t('stableswap|poolAddress')}
        tooltipContent={t('stableswap|pairAddress')}
        className={cardCellClassName}
        data-test-id="pairAddress"
      >
        <StateWrapper
          isLoading={isLoading}
          loaderFallback={<DashPlug />}
          isError={!contractAddress}
          errorFallback={<DashPlug animation={false} />}
        >
          {contractAddress && <ContractHashWithCopy contractAddress={contractAddress} />}
        </StateWrapper>
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('stableswap|poolId')}
        tooltipContent={t('stableswap|pairId')}
        className={cardCellClassName}
        data-test-id="pairId"
      >
        <StateCurrencyAmount isLoading={isLoading} amount={poolId} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('stableswap|tvl')}
        tooltipContent={t('stableswap|tvlPoolTooltip')}
        className={cardCellClassName}
        data-test-id="tvl"
      >
        <StateCurrencyAmount isLoading={isLoading} amount={tvlInUsd} dollarEquivalent={tvlInUsd} dollarEquivalentOnly />
      </DetailsCardCell>

      <Iterator render={TokenLocked} data={tokensLockedData} />

      <DetailsCardCell
        cellName={t('stableswap|Total LP Supply')}
        tooltipContent={t('stableswap|totalLPSupply')}
        className={cardCellClassName}
        data-test-id="totalLpSupply"
      >
        <StateCurrencyAmount isLoading={isLoading} amount={totalLpSupply} />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('stableswap|liquidityProvidersFee')}
        tooltipContent={t('stableswap|liquidityProvidersFeeFeeDescription')}
        className={cardCellClassName}
        data-test-id="liquidityProvidersFee"
      >
        <StatePercentage isLoading={isLoading} value={providersFee} />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('stableswap|Interface Fee')}
        tooltipContent={t('stableswap|interfaceFee')}
        className={cardCellClassName}
        data-test-id="interfaceFee"
      >
        <StatePercentage isLoading={isLoading} value={interfaceFee} />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('stableswap|QUIPU Stakers Fee')}
        tooltipContent={t('stableswap|quipuStakersFee')}
        className={cardCellClassName}
        data-test-id="quipuStakersFee"
      >
        <StatePercentage isLoading={isLoading} value={stakersFee} />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('stableswap|Dev Fee')}
        tooltipContent={t('stableswap|devFee')}
        className={cardCellClassName}
        data-test-id="devFee"
      >
        <StatePercentage isLoading={isLoading} value={devFee} />
      </DetailsCardCell>
      <div className={cx(commonContainerStyles.detailsButtons, styles.detailsButtons)}>
        <Button
          className={cx(commonContainerStyles.detailsButton, styles.detailsButton)}
          theme="inverse"
          href={poolContractUrl}
          external
          icon={<ExternalLink className={commonContainerStyles.linkIcon} />}
          data-test-id="stableswapContractButton"
        >
          {t('liquidity|Pair Contract')}
        </Button>
      </div>
    </>
  );
};
