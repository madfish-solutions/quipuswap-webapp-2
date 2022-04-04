/* eslint-disable no-console */
import { FC } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { useTranslation } from 'next-i18next';

import { EMPTY_POOL_AMOUNT } from '@app.config';
import { ContractHashWithCopy } from '@components/common/contract-hash-with-copy/contract-hash-with-copy';
import { RateView } from '@components/common/pair-details/rate-view';
import { StateWrapper } from '@components/state-wrapper';
import { DashPlug } from '@components/ui/dash-plug';
import { DetailsCardCell } from '@components/ui/details-card-cell';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { useLoadLiquidityShare } from '@containers/liquidity/hooks/use-load-liquidity-share';
import { useAccountPkh } from '@utils/dapp';
import { isExist, isNull, isUndefined } from '@utils/helpers';
import { Nullable, Optional, Token } from '@utils/types';

import { LiquidityDetailsButtons } from './components/liquidity-details-buttons';
import s from './liquidity-details.module.sass';
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

  return (
    <>
      <DetailsCardCell
        cellName={t('common|Pair Address')}
        tooltipContent={t(
          'common|Address of the share(LP) token contract. Along with pair id(if any)it can be used to find the LP token in your wallet.',
          { tokenASymbol, tokenBSymbol }
        )}
        className={s.LiquidityDetails_CardCell}
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
        tooltipContent={t('common|Token id of the share(LP) token.', { tokenASymbol, tokenBSymbol })}
        className={s.LiquidityDetails_CardCell}
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
        className={s.LiquidityDetails_CardCell}
      >
        <RateView rate={sellPrice} inputToken={tokenA} outputToken={tokenB} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('common|Buy Price')}
        tooltipContent={t(
          'common|The amount of {{tokenASymbol}} you receive for 1 {{tokenBSymbol}}, according to the current exchange rate.',
          { tokenASymbol, tokenBSymbol }
        )}
        className={s.LiquidityDetails_CardCell}
      >
        <RateView rate={buyPrice} inputToken={tokenB} outputToken={tokenA} />
      </DetailsCardCell>

      <DetailsCardCell
        cellName={t('liquidity|{{tokenASymbol}} Locked', { tokenASymbol })}
        tooltipContent={t('liquidity|The amount of {{tokenASymbol}} locked in the pool by liquidity providers.', {
          tokenASymbol
        })}
        className={s.LiquidityDetails_CardCell}
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
        className={s.LiquidityDetails_CardCell}
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
              "liquidity|Total amount of this pool's LP tokens you will own after adding liquidity. LP (liquidity Pool) tokens represent your current share in a pool."
            )}
            className={s.LiquidityDetails_CardCell}
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
            className={s.LiquidityDetails_CardCell}
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
