import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';

import { fromDecimals } from '@utils/helpers';
import { Table } from '@components/ui/Table';
import { Tooltip } from '@components/ui/Tooltip';
import { TokensLogos } from '@components/ui/TokensLogos';
// import { Bage } from '@components/ui/Bage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';

import { MAX_ITEMS_PER_PAGE, TEZOS_TOKEN } from '@utils/defaults';
import { PoolTableType } from '@utils/types';
import s from './PoolTable.module.sass';

type PoolTableProps = {
  data?: PoolTableType
  totalCount?: number
  exchangeRate?: string
  loading?: boolean
  className?: string
  fetch: any
};

const pageSize = MAX_ITEMS_PER_PAGE;

export const PoolTable: React.FC<PoolTableProps> = ({
  data,
  totalCount,
  loading = true,
  className,
  fetch,
}) => {
  const { t } = useTranslation(['home']);
  const [pageCount, setPageCount] = useState<number>(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (totalCount) {
      setPageCount(totalCount);
    }
  }, [totalCount]);

  useEffect(() => {
    fetch({
      variables: {
        limit: pageSize ?? 10,
        offset,
      },
    });
  }, [fetch, offset, pageSize]);
  const columns = useMemo(() => [
    {
      Header: t('home:Name'),
      id: 'name',
      accessor: ({ token1, token2, pair }:PoolTableType) => (
        <>
          <TokensLogos
            token1={token1 || TEZOS_TOKEN}
            token2={token2}
            className={s.tokenLogo}
          />
          {pair.name}
          {/* {isSponsored && (<Bage className={s.bage} text={t('home:Sponsored')} />)} */}
        </>
      ),
    },
    {
      Header: (
        <>
          {t('home:TVL')}
          <Tooltip sizeT="small" content={t('TVL (Total Value Locked) represents the total amount of a specific token locked on QuiuSwap across different pools.')} />
        </>
      ),
      id: 'tvl',
      accessor: ({ data: dataInside, xtzUsdQuote }:PoolTableType) => (
        <>
          $
          <CurrencyAmount
            className={s.cardAmount}
            amount={fromDecimals(new BigNumber(dataInside.tvl), 6)
              .multipliedBy(new BigNumber(xtzUsdQuote))
              .integerValue()
              .toString()}
          />
        </>
      ),
    },
    {
      Header: (
        <>
          {t('home:Volume 24h')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </>
      ),
      id: 'volume24h',
      accessor: ({ data: dataInside, xtzUsdQuote }:PoolTableType) => (
        <>
          $
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
        <>
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
        </>
      ),
    },
  ], [data, offset, t]);

  return (
    <Table
      theme="pools"
      className={className}
      tableClassName={s.table}
      data={data ?? []}
      loading={loading}
      columns={columns}
      trClassName={s.tr}
      thClassName={s.th}
      tdClassName={s.td}
      pageCount={pageCount}
      pageSize={pageSize ?? 10}
      setOffset={setOffset}
      isLinked
    />
  );
};
