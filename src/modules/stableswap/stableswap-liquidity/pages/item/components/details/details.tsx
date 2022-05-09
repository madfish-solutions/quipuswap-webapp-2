import { FC } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import {
  Button,
  Card,
  ContractHashWithCopy,
  DashPlug,
  DetailsCardCell,
  Iterator,
  StateCurrencyAmount,
  StatePercentage,
  StateWrapper
} from '@shared/components';
import { ExternalLink } from '@shared/svg';
import commonContainerStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { TokenLocked } from '../token-locked';
import styles from './details.module.scss';
import { useDetailsVievModel } from './details.vm';

export const Details: FC = observer(() => {
  const { t } = useTranslation();
  const {
    contractAddress,
    id,
    totalLpSupply,
    liquidityProvidersFee,
    interfaceFee,
    stakersFee,
    devFee,
    poolContractUrl,
    CardCellClassName,
    isLoading,
    tokensLockedData
  } = useDetailsVievModel();

  return (
    <Card
      header={{
        content: t('common|Pool Details')
      }}
      contentClassName={commonContainerStyles.content}
      data-test-id="stableswapDetails"
    >
      <DetailsCardCell cellName={t('common|Pair Address')} className={CardCellClassName} data-test-id="pairAddress">
        <StateWrapper
          isLoading={isLoading}
          loaderFallback={<DashPlug />}
          isError={!contractAddress}
          errorFallback={<DashPlug animation={false} />}
        >
          {contractAddress && <ContractHashWithCopy contractAddress={contractAddress} />}
        </StateWrapper>
      </DetailsCardCell>
      <DetailsCardCell cellName={t('common|Pair ID')} className={CardCellClassName} data-test-id="pairId">
        <StateCurrencyAmount isLoading={isLoading} amount={id} />
      </DetailsCardCell>

      <Iterator render={TokenLocked} data={tokensLockedData} />

      <DetailsCardCell
        cellName={t('stableswap|Total LP Supply')}
        className={CardCellClassName}
        data-test-id="totalLpSupply"
      >
        <StateCurrencyAmount isLoading={isLoading} amount={totalLpSupply} />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('stableswap|liquidityProvidersFee')}
        className={CardCellClassName}
        data-test-id="liquidityProvidersFee"
      >
        <StatePercentage isLoading={isLoading} value={liquidityProvidersFee} />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('stableswap|Interface Fee')}
        className={CardCellClassName}
        data-test-id="interfaceFee"
      >
        <StatePercentage isLoading={isLoading} value={interfaceFee} />
      </DetailsCardCell>
      <DetailsCardCell
        cellName={t('stableswap|QUIPU Stakers Fee')}
        className={CardCellClassName}
        data-test-id="quipuStakersFee"
      >
        <StatePercentage isLoading={isLoading} value={stakersFee} />
      </DetailsCardCell>
      <DetailsCardCell cellName={t('stableswap|Dev Fee')} className={CardCellClassName} data-test-id="devFee">
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
    </Card>
  );
});
