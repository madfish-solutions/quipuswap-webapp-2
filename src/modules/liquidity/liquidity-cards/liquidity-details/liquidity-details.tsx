/* eslint-disable no-console */
import { FC } from 'react';

import { FoundDex } from '@quipuswap/sdk';

import { EMPTY_POOL_AMOUNT } from '@config/constants';
import { useAccountPkh } from '@providers/use-dapp';
import {
  ContractHashWithCopy,
  DashPlug,
  DetailsCardCell,
  RateView,
  StateCurrencyAmount,
  StateWrapper
} from '@shared/components';
import { isExist, isNull, isUndefined } from '@shared/helpers';
import { Nullable, Optional, Token } from '@shared/types';
import { useTranslation } from '@translation';

import { useLoadLiquidityShare } from '../../hooks';
import { LiquidityDetailsButtons } from './components/liquidity-details-buttons';
import styles from './liquidity-details.module.scss';
import { useLiquidityDetailsViewModel } from './use-liqiudity-details.vm';

interface Props {
  dex: Optional<FoundDex>;
  tokenA: Nullable<Token>;
  tokenB: Nullable<Token>;
}

export const LiquidityDetails: FC<Props> = ({ dex, tokenA, tokenB }) => {
  const { t } = useTranslation(['common', 'liquidity']);
  const accountPkh = useAccountPkh();
  const { share } = useLoadLiquidityShare(dex, tokenA, tokenB);

  const {
    tokenASymbol,
    tokenBSymbol,
    sellPrice,
    buyPrice,
    fixedTokenAPoll,
    fixedTokenBPoll,
    pairLink,
    contractLink,
    isPoolNotExists,
    contractAddress,
    pairId
  } = useLiquidityDetailsViewModel(dex, tokenA, tokenB);

  const isDexNotExists = isUndefined(dex);
  const isLoadingA = isDexNotExists || isNull(tokenA);
  const isLoadingB = isDexNotExists || isNull(tokenB);
  const isLoadingShares = isNull(share);

  const isErrorA = Boolean(!isLoadingA && (!fixedTokenAPoll || fixedTokenAPoll.eq(EMPTY_POOL_AMOUNT)));
  const isErrorB = Boolean(!isLoadingB && (!fixedTokenBPoll || fixedTokenBPoll.eq(EMPTY_POOL_AMOUNT)));
  const isErrorShares = isPoolNotExists;

  const totalAmount = share?.total ?? null;
  const frozenAmount = share?.frozen ?? null;

  if (!tokenASymbol || !tokenBSymbol) {
    return null;
  }

  return (
    <>
      <DetailsCardCell
        cellName={t('common|Pair Address')}
        tooltipContent={t(
          'common|Address of the share(LP) token contract. Along with pair id(if any)it can be used to find the LP token in your wallet.',
          { tokenASymbol, tokenBSymbol }
        )}
        className={styles.LiquidityDetails_CardCell}
      >
        <StateWrapper
          loaderFallback={<DashPlug />}
          isError={!contractAddress || !contractLink}
          errorFallback={<DashPlug animation={false} />}
        >
          {contractAddress && contractLink && <ContractHashWithCopy contractAddress={contractAddress} />}
        </StateWrapper>
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Pair ID')}
        tooltipContent={t('common|Token id of the share(LP) token.')}
        className={styles.LiquidityDetails_CardCell}
      >
        <StateWrapper
          loaderFallback={<DashPlug />}
          isError={!isExist(pairId)}
          errorFallback={<DashPlug animation={false} />}
        >
          {pairId}
        </StateWrapper>
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Sell Price')}
        tooltipContent={t(
          'common|The amount of {{tokenBSymbol}} you receive for 1 {{tokenASymbol}}, according to the current exchange rate.',
          { tokenASymbol, tokenBSymbol }
        )}
        className={styles.LiquidityDetails_CardCell}
      >
        <RateView rate={sellPrice} inputToken={tokenA} outputToken={tokenB} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Buy Price')}
        tooltipContent={t(
          'common|The amount of {{tokenASymbol}} you receive for 1 {{tokenBSymbol}}, according to the current exchange rate.',
          { tokenASymbol, tokenBSymbol }
        )}
        className={styles.LiquidityDetails_CardCell}
      >
        <RateView rate={buyPrice} inputToken={tokenB} outputToken={tokenA} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|{{tokenASymbol}} Locked', { tokenASymbol })}
        tooltipContent={t('common|The amount of {{tokenASymbol}} locked in the pool by liquidity providers.', {
          tokenASymbol
        })}
        className={styles.LiquidityDetails_CardCell}
      >
        <StateCurrencyAmount
          amount={fixedTokenAPoll}
          currency={tokenASymbol}
          isLoading={isLoadingA}
          isError={isErrorA}
          amountDecimals={tokenA?.metadata.decimals}
        />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('liquidity|{{tokenBSymbol}} Locked', { tokenBSymbol })}
        tooltipContent={t('liquidity|The amount of {{tokenBSymbol}} locked in the pool by liquidity providers.', {
          tokenBSymbol
        })}
        className={styles.LiquidityDetails_CardCell}
      >
        <StateCurrencyAmount
          amount={fixedTokenBPoll}
          currency={tokenBSymbol}
          isLoading={isLoadingB}
          isError={isErrorB}
          amountDecimals={tokenB?.metadata.decimals}
        />
      </DetailsCardCell>

      {accountPkh && (
        <>
          <DetailsCardCell
            cellName={t('liquidity|Your Total LP')}
            tooltipContent={t(
              "liquidity|Total amount of this pool'styles LP tokens you will own after adding liquidity. LP (liquidity Pool) tokens represent your current share in a pool."
            )}
            className={styles.LiquidityDetails_CardCell}
          >
            <StateCurrencyAmount
              amount={totalAmount}
              isLoading={isLoadingShares || isLoadingA}
              isError={isErrorShares}
            />
          </DetailsCardCell>

          <DetailsCardCell
            cellName={t('liquidity|Your Frozen LP')}
            tooltipContent={t(
              'liquidity|Frozen LPs are LPs you own that are locked in a smart contract (for voting, farming, etc.) and can not be moved or withdrawn until you unlock them.'
            )}
            className={styles.LiquidityDetails_CardCell}
          >
            <StateCurrencyAmount
              amount={frozenAmount}
              isLoading={isLoadingShares || isLoadingB}
              isError={isErrorShares}
            />
          </DetailsCardCell>
        </>
      )}

      <LiquidityDetailsButtons dex={dex} contractLink={contractLink} pairLink={pairLink} />
    </>
  );
};
