import React, { FC, useEffect, useMemo, useState } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { Button, Card, CardCell, CurrencyAmount, ExternalLink, Skeleton, Tooltip } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { usePairInfo } from '@containers/Liquidity/LiquidityForms/hooks';
import { fallbackTokenToTokenData, fromDecimals, getWhitelistedTokenSymbol, parseDecimals } from '@utils/helpers';
import { PoolShare, TokenDataMap, WhitelistedToken } from '@utils/types';

import s from '../Liquidity.module.sass';
import { LiquidityTab } from './liquidity-tabs';

interface LiquidityDetailsProps {
  dex: FoundDex;
  tab: LiquidityTab;
  tokenA: WhitelistedToken;
  tokenB: WhitelistedToken;
}

export const LiquidityDetails: FC<LiquidityDetailsProps> = ({ dex, tab, tokenA, tokenB }) => {
  const { t } = useTranslation(['common', 'liquidity']);

  const [tokensData, setTokensData] = useState<TokenDataMap>({
    first: fallbackTokenToTokenData(tokenA),
    second: fallbackTokenToTokenData(tokenB)
  });

  const poolShare: PoolShare = useMemo(
    () => ({
      frozen: new BigNumber(888000000),
      unfrozen: new BigNumber(888000000),
      total: new BigNumber(888000000)
    }),
    []
  );

  const pairInfo = usePairInfo(dex, tokenA, tokenB);
  const pairLink = useMemo(() => (!dex ? '#' : `https://analytics.quipuswap.com/pairs/${dex.contract.address}`), [dex]);
  const contractLink = useMemo(() => (!dex ? '#' : `https://tzkt.io/${dex.contract.address}`), [dex]);
  const tokenAName = useMemo(() => getWhitelistedTokenSymbol(tokenA), [tokenA]);
  const tokenBName = useMemo(() => getWhitelistedTokenSymbol(tokenB), [tokenB]);

  const balanceTotalA = useMemo(() => new BigNumber(pairInfo ? pairInfo.tokenAPool : 0).toString(), [pairInfo]);
  const balanceTotalB = useMemo(() => new BigNumber(pairInfo ? pairInfo.tokenBPool : 0).toString(), [pairInfo]);
  const totalShare = useMemo(
    () => fromDecimals(poolShare?.total || new BigNumber(0), 6).toString() ?? '0',
    [poolShare]
  );
  const frozenShare = useMemo(
    () => fromDecimals(poolShare?.frozen || new BigNumber(0), 6).toString() ?? '0',
    [poolShare]
  );
  const sellPrice = useMemo(
    () =>
      parseDecimals(
        new BigNumber(tokensData.first.exchangeRate ?? 1).div(tokensData.second.exchangeRate ?? 1).toString(),
        0,
        Infinity,
        tokenB.metadata.decimals
      ),
    [tokensData, tokenB.metadata.decimals]
  );
  const buyPrice = useMemo(
    () =>
      parseDecimals(
        new BigNumber(tokensData.second.exchangeRate ?? 1).div(tokensData.first.exchangeRate ?? 1).toString(),
        0,
        Infinity,
        tokenA.metadata.decimals
      ),
    [tokensData, tokenA.metadata.decimals]
  );

  useEffect(() => {
    setTokensData(prevState => ({ ...prevState, first: fallbackTokenToTokenData(tokenA) }));
  }, [tokenA]);

  useEffect(() => {
    setTokensData(prevState => ({ ...prevState, second: fallbackTokenToTokenData(tokenB) }));
  }, [tokenB]);

  return (
    <Card
      header={{
        content: `${tab.label} Liquidity Details`
      }}
      contentClassName={s.content}
    >
      <CardCell
        header={
          <>
            {t('common|Sell Price')}
            <Tooltip
              sizeT="small"
              content={t(
                'common|The amount of {{tokenBName}} you receive for 1 {{tokenAName}}, according to the current exchange rate.',
                { tokenAName, tokenBName }
              )}
            />
          </>
        }
        className={s.cell}
      >
        <div className={s.cellAmount}>
          <CurrencyAmount amount="1" currency={tokenAName} />
          <span className={s.equal}>=</span>
          <CurrencyAmount
            amount={sellPrice}
            currency={tokenBName}
            dollarEquivalent={tokensData.first.exchangeRate ? `${tokensData.first.exchangeRate}` : undefined}
          />
        </div>
      </CardCell>
      <CardCell
        header={
          <>
            {t('common|Buy Price')}
            <Tooltip
              sizeT="small"
              content={t(
                'common|The amount of {{tokenAName}} you receive for 1 {{tokenBName}}, according to the current exchange rate.',
                { tokenAName, tokenBName }
              )}
            />
          </>
        }
        className={s.cell}
      >
        <div className={s.cellAmount}>
          <CurrencyAmount amount="1" currency={tokenBName} />
          <span className={s.equal}>=</span>
          <CurrencyAmount
            amount={buyPrice}
            currency={tokenAName}
            dollarEquivalent={tokensData.second.exchangeRate ? `${tokensData.second.exchangeRate}` : undefined}
          />
        </div>
      </CardCell>
      <CardCell
        header={
          <>
            {t('liquidity|{{tokenAName}} Locked', { tokenAName })}
            <Tooltip
              sizeT="small"
              content={t(
                'liquidity|The amount of {{tokenAName}} that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.',
                { tokenAName }
              )}
            />
          </>
        }
        className={s.cell}
      >
        {!dex ? <Skeleton className={s.currency2} /> : <CurrencyAmount amount={balanceTotalA} currency={tokenAName} />}
      </CardCell>
      <CardCell
        header={
          <>
            {t('liquidity|{{tokenBName}} Locked', { tokenBName })}
            <Tooltip
              sizeT="small"
              content={t(
                'liquidity|The amount of {{tokenBName}} that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.',
                { tokenBName }
              )}
            />
          </>
        }
        className={s.cell}
      >
        {!dex ? <Skeleton className={s.currency2} /> : <CurrencyAmount amount={balanceTotalB} currency={tokenBName} />}
      </CardCell>
      <CardCell
        header={
          <>
            {t('liquidity|Your Total LP')}
            <Tooltip
              sizeT="small"
              content={t(
                "liquidity|Total amount of this pool's LP tokens you will own after adding liquidity. LP (Liquidity Pool) tokens represent your current share in a pool."
              )}
            />
          </>
        }
        className={s.cell}
      >
        <CurrencyAmount amount={totalShare} />
      </CardCell>
      <CardCell
        header={
          <>
            {t('liquidity|Your Frozen LP')}
            <Tooltip
              sizeT="small"
              content={t(
                'liquidity|Frozen LPs are LPs you own that are locked in a smart contract (for voting, farming, etc.) and can not be moved or withdrawn until you unlock them.'
              )}
            />
          </>
        }
        className={s.cell}
      >
        <CurrencyAmount amount={frozenShare} />
      </CardCell>
      <div className={s.detailsButtons}>
        {dex ? (
          <Button
            className={s.detailsButton}
            theme="inverse"
            href={pairLink}
            external
            icon={<ExternalLink className={s.linkIcon} />}
          >
            {t('liquidity|View Pair Analytics')}
          </Button>
        ) : (
          <Skeleton className={cx(s.buttonSkel, s.detailsButton)} />
        )}
        {dex ? (
          <Button
            className={s.detailsButton}
            theme="inverse"
            href={contractLink}
            external
            icon={<ExternalLink className={s.linkIcon} />}
          >
            {t('liquidity|View Pair Contract')}
          </Button>
        ) : (
          <Skeleton className={cx(s.buttonSkel, s.detailsButton)} />
        )}
      </div>
    </Card>
  );
};
