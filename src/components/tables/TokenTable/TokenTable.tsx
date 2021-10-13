import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import {
  PoolTableType,
  WhitelistedToken,
} from '@utils/types';
import { Table } from '@components/ui/Table';

import { TokensLogos } from '@components/ui/TokensLogos';
import { TEZOS_TOKEN } from '@utils/defaults';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { Tooltip } from '@components/ui/Tooltip';
import { fromDecimals } from '@utils/helpers';
import BigNumber from 'bignumber.js';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokenCardItem } from './TokenCardItem';

import s from '../Table.module.sass';

type TokenTableProps = {
  data: WhitelistedToken[]
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const farmMobileItem = (token:WhitelistedToken) => (
  <TokenCardItem
    key={`${token.contractAddress}:${token.fa2TokenId}`}
    token={token}
  />
);

export const TokenTable: React.FC<TokenTableProps> = ({
  data,
}) => {
  const { t } = useTranslation(['profile']);
  const [offset, setOffset] = useState(0);

  const { colorThemeMode } = useContext(ColorThemeContext);

  const columns = useMemo(() => [
    {
      Header: t('home|Name'),
      id: 'name',
      accessor: ({ token1, token2, pair }:PoolTableType) => (
        <div className={s.links}>
          <TokensLogos
            token1={token1 || TEZOS_TOKEN}
            token2={token2}
            className={s.tokenLogo}
          />
          <span className={s.cardCellText}>
            {pair.name}
          </span>
          {/* {isSponsored && (<Bage className={s.bage} text={t('home|Sponsored')} />)} */}
        </div>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|TVL')}
          <Tooltip sizeT="small" content={t('TVL (Total Value Locked) represents the total amount of a specific token locked on QuiuSwap across different pools.')} />
        </div>
      ),
      id: 'tvl',
      accessor: ({ data: dataInside, xtzUsdQuote }:PoolTableType) => (
        <div className={s.links}>
          <span className={s.dollar}>
            $
          </span>
          <CurrencyAmount
            className={s.cardAmount}
            amount={fromDecimals(new BigNumber(dataInside.tvl), 6)
              .multipliedBy(new BigNumber(xtzUsdQuote))
              .integerValue()
              .toString()}
          />
        </div>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Volume 24h')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'volume24h',
      accessor: ({ data: dataInside, xtzUsdQuote }:PoolTableType) => (
        <>
          <span className={s.dollar}>
            $
          </span>
          <CurrencyAmount
            className={s.cardAmount}
            amount={fromDecimals(new BigNumber(dataInside.volume24h), 6)
              .multipliedBy(new BigNumber(xtzUsdQuote))
              .integerValue()
              .toString()}
          />
        </>
      ),
    },
    {
      id: 'poolButton',
      accessor: ({ buttons }:PoolTableType) => (
        <div className={s.last}>
          <Button
            theme="secondary"
            className={s.button}
            href={buttons.first.href ?? ''}
            external
          >
            {buttons.first.label}
          </Button>
          <Button
            href={buttons.second.href ?? ''}
            className={s.button}
          >
            {buttons.second.label}
          </Button>
        </div>
      ),
    },
    // eslint-disable-next-line
  ], [data, offset, t]);

  return (
    <Table
      className={cx(modeClass[colorThemeMode])}
      renderMobile={farmMobileItem}
      data={data ?? []}
      columns={columns}
      setOffset={setOffset}
    />
  );
};
