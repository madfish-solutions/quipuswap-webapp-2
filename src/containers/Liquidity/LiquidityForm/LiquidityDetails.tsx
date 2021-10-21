import React, { useMemo } from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { FoundDex } from '@quipuswap/sdk';

import { PoolShare, TokenDataMap, WhitelistedToken } from '@utils/types';
import { fromDecimals, getWhitelistedTokenSymbol, parseDecimals } from '@utils/helpers';
import { Tooltip } from '@components/ui/Tooltip';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { Skeleton } from '@components/ui/Skeleton';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '../Liquidity.module.sass';

type LiquidityDetailsProps = {
  currentTab: string;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  tokensData: TokenDataMap;
  poolShare?: PoolShare;
  dex?: FoundDex;
};

export const LiquidityDetails: React.FC<LiquidityDetailsProps> = ({
  currentTab,
  token1,
  token2,
  tokensData,
  poolShare,
  dex,
}) => {
  const { t } = useTranslation(['common', 'liquidity']);
  const pairLink = useMemo(
    () => (!dex ? '#' : `https://analytics.quipuswap.com/pairs/${dex.contract.address}`),
    [dex],
  );
  const contractLink = useMemo(
    () => (!dex ? '#' : `https://tzkt.io/${dex.contract.address}`),
    [dex],
  );
  const loading = useMemo(() => !token1 || !token2, [token1, token2]);
  const tokenAName = useMemo(
    () => (token1 ? getWhitelistedTokenSymbol(token1) : 'Token A'),
    [token1],
  );
  const tokenBName = useMemo(
    () => (token2 ? getWhitelistedTokenSymbol(token2) : 'Token B'),
    [token2],
  );

  const balanceTotalA = useMemo(
    () => new BigNumber(dex ? dex.storage.storage.tez_pool : 0).toString(),
    [dex],
  );
  const balanceTotalB = useMemo(
    () => new BigNumber(dex ? dex.storage.storage.token_pool : 0).toString(),
    [dex],
  );
  const totalShare = useMemo(
    () => fromDecimals(poolShare?.total || new BigNumber(0), 6).toString() ?? '0',
    [poolShare],
  );
  const frozenShare = useMemo(
    () => fromDecimals(poolShare?.frozen || new BigNumber(0), 6).toString() ?? '0',
    [poolShare],
  );
  const sellPrice = useMemo(
    () => parseDecimals(
      new BigNumber(tokensData.first.exchangeRate ?? 1)
        .div(tokensData.second.exchangeRate ?? 1)
        .toString(),
      0,
      Infinity,
      token2.metadata.decimals,
    ),
    [tokensData, token2.metadata.decimals],
  );
  const buyPrice = useMemo(
    () => parseDecimals(
      new BigNumber(tokensData.second.exchangeRate ?? 1)
        .div(tokensData.first.exchangeRate ?? 1)
        .toString(),
      0,
      Infinity,
      token1.metadata.decimals,
    ),
    [tokensData, token1.metadata.decimals],
  );
  return (
    <Card
      header={{
        content: `${currentTab} Liquidity Details`,
      }}
      contentClassName={s.content}
    >
      <CardCell
        header={(
          <>
            {t('common|Sell Price')}
            <Tooltip
              sizeT="small"
              content={t(
                'common|The amount of {{tokenBName}} you receive for 1 {{tokenAName}}, according to the current exchange rate.',
                { tokenAName, tokenBName },
              )}
            />
          </>
        )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          {loading ? (
            <Skeleton className={s.currency} />
          ) : (
            <CurrencyAmount amount="1" currency={tokenAName} />
          )}
          <span className={s.equal}>=</span>
          {loading ? (
            <Skeleton className={s.currency2} />
          ) : (
            <CurrencyAmount
              amount={sellPrice}
              currency={tokenBName}
              dollarEquivalent={
                tokensData.first.exchangeRate ? `${tokensData.first.exchangeRate}` : undefined
              }
            />
          )}
        </div>
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common|Buy Price')}
            <Tooltip
              sizeT="small"
              content={t(
                'common|The amount of {{tokenAName}} you receive for 1 {{tokenBName}}, according to the current exchange rate.',
                { tokenAName, tokenBName },
              )}
            />
          </>
        )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          {loading ? (
            <Skeleton className={s.currency} />
          ) : (
            <CurrencyAmount amount="1" currency={tokenBName} />
          )}
          <span className={s.equal}>=</span>
          {loading ? (
            <Skeleton className={s.currency2} />
          ) : (
            <CurrencyAmount
              amount={buyPrice}
              currency={tokenAName}
              dollarEquivalent={
                tokensData.second.exchangeRate ? `${tokensData.second.exchangeRate}` : undefined
              }
            />
          )}
        </div>
      </CardCell>
      <CardCell
        header={(
          <>
            {t('liquidity|{{tokenAName}} Locked', { tokenAName })}
            <Tooltip
              sizeT="small"
              content={t(
                'liquidity|The amount of {{tokenAName}} that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.',
                { tokenAName },
              )}
            />
          </>
        )}
        className={s.cell}
      >
        {loading || !dex ? (
          <Skeleton className={s.currency2} />
        ) : (
          <CurrencyAmount amount={balanceTotalA} currency={tokenAName} />
        )}
      </CardCell>
      <CardCell
        header={(
          <>
            {t('liquidity|{{tokenBName}} Locked', { tokenBName })}
            <Tooltip
              sizeT="small"
              content={t(
                'liquidity|The amount of {{tokenBName}} that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.',
                { tokenBName },
              )}
            />
          </>
        )}
        className={s.cell}
      >
        {loading || !dex ? (
          <Skeleton className={s.currency2} />
        ) : (
          <CurrencyAmount amount={balanceTotalB} currency={tokenBName} />
        )}
      </CardCell>
      <CardCell
        header={(
          <>
            {t('liquidity|Your Total LP')}
            <Tooltip
              sizeT="small"
              content={t(
                "liquidity|Total amount of this pool's LP tokens you will own after adding liquidity. LP (Liquidity Pool) tokens represent your current share in a pool.",
              )}
            />
          </>
        )}
        className={s.cell}
      >
        <CurrencyAmount amount={totalShare} />
      </CardCell>
      <CardCell
        header={(
          <>
            {t('liquidity|Your Frozen LP')}
            <Tooltip
              sizeT="small"
              content={t(
                'liquidity|Frozen LPs are LPs you own that are locked in a smart contract (for voting, farming, etc.) and can not be moved or withdrawn until you unlock them.',
              )}
            />
          </>
        )}
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
