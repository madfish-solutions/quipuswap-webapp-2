import React, { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import {
  FoundDex,
} from '@quipuswap/sdk';

import {
  PoolShare,
  TokenDataMap, WhitelistedToken, WhitelistedTokenPair,
} from '@utils/types';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { Tooltip } from '@components/ui/Tooltip';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';

type LiquidityDetailsProps = {
  currentTab: string
  token1: WhitelistedToken
  token2: WhitelistedToken
  tokensData:TokenDataMap
  tokenPair: WhitelistedTokenPair
  poolShare?: PoolShare
  balanceTotalA: string
  balanceTotalB: string
  dex?: FoundDex
};

export const LiquidityDetails: React.FC<LiquidityDetailsProps> = ({
  currentTab,
  token1,
  token2,
  tokensData,
  tokenPair,
  poolShare,
  balanceTotalA,
  balanceTotalB,
  dex,
}) => {
  const { t } = useTranslation(['common', 'liquidity']);
  const pairLink = useMemo(() => (!dex ? '#' : `https://analytics.quipuswap.com/pairs/${dex.contract.address}`), [dex]);
  const contractLink = useMemo(() => (!dex ? '#' : `https://tzkt.io/${dex.contract.address}`), [dex]);

  const tokenAName = useMemo(() => (token1 ? getWhitelistedTokenSymbol(token1) : 'Token A'), [token1]);
  const tokenBName = useMemo(() => (token2 ? getWhitelistedTokenSymbol(token2) : 'Token B'), [token2]);
  const totalShare = useMemo(() => (poolShare?.total.div(10 ** 6).toString()) ?? '0', [poolShare]);
  const frozenShare = useMemo(() => (poolShare?.frozen.div(10 ** 6).toString()) ?? '0', [poolShare]);
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
            {t('common:Sell Price')}
            <Tooltip
              sizeT="small"
              content={t('common:The amount of {{tokenBName}} you receive for 1 {{tokenAName}}, according to the current exchange rate.', { tokenAName, tokenBName })}
            />
          </>
          )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          <CurrencyAmount
            amount="1"
            currency={tokenAName}
          />
          <span className={s.equal}>=</span>
          <CurrencyAmount
            amount={`${(+(tokensData.first.exchangeRate ?? 1)) / (+(tokensData.second.exchangeRate ?? 1))}`}
            currency={tokenBName}
            dollarEquivalent={`${tokensData.first.exchangeRate ?? 1}`}
          />
        </div>
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common:Buy Price')}
            <Tooltip
              sizeT="small"
              content={t('common:The amount of {{tokenAName}} you receive for 1 {{tokenBName}}, according to the current exchange rate.', { tokenAName, tokenBName })}
            />
          </>
          )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          <CurrencyAmount
            amount="1"
            currency={tokenBName}
          />
          <span className={s.equal}>=</span>
          <CurrencyAmount
            amount={`${(+(tokensData.second.exchangeRate ?? 1)) / (+(tokensData.first.exchangeRate ?? 1))}`}
            currency={tokenAName}
            dollarEquivalent={`${tokensData.second.exchangeRate ?? 1}`}
          />
        </div>
      </CardCell>
      <CardCell
        header={(
          <>
            {t('liquidity:{{tokenAName}} Locked', { tokenAName })}
            <Tooltip
              sizeT="small"
              content={t('liquidity:The amount of {{tokenAName}} that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.', { tokenAName })}
            />
          </>
      )}
        className={s.cell}
      >
        <CurrencyAmount
          amount={balanceTotalA}
          currency={getWhitelistedTokenSymbol(tokenPair.token1)}
        />
      </CardCell>
      <CardCell
        header={(
          <>
            {t('liquidity:{{tokenBName}} Locked', { tokenBName })}
            <Tooltip
              sizeT="small"
              content={t('liquidity:The amount of {{tokenBName}} that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.', { tokenBName })}
            />
          </>
      )}
        className={s.cell}
      >
        <CurrencyAmount
          amount={balanceTotalB}
          currency={getWhitelistedTokenSymbol(tokenPair.token2)}
        />
      </CardCell>
      <CardCell
        header={(
          <>
            {t('liquidity:Your Total LP')}
            <Tooltip
              sizeT="small"
              content={t("liquidity:Total amount of this pool's LP tokens you will own after adding liquidity. LP (Liquidity Pool) tokens represent your current share in a pool.")}
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
            {t('liquidity:Your Frozen LP')}
            <Tooltip
              sizeT="small"
              content={t('liquidity:Frozen LPs are LPs you own that are locked in a smart contract (for voting, farming, etc.) and can not be moved or withdrawn until you unlock them.')}
            />
          </>
      )}
        className={s.cell}
      >
        <CurrencyAmount amount={frozenShare} />
      </CardCell>
      {dex && (
      <div className={s.detailsButtons}>
        <Button
          className={s.detailsButton}
          theme="inverse"
          href={pairLink}
          external
        >
          View Pair Analytics
          <ExternalLink className={s.linkIcon} />
        </Button>
        <Button
          className={s.detailsButton}
          theme="inverse"
          href={contractLink}
          external
        >
          View Pair Contract
          <ExternalLink className={s.linkIcon} />
        </Button>
      </div>
      )}
    </Card>
  );
};
