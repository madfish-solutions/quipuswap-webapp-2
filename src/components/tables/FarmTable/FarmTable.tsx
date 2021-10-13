import React, {
  useState, useMemo, useEffect,
} from 'react';
import { useTranslation } from 'next-i18next';

import {
  WhitelistedFarm,
} from '@utils/types';

import { MAX_ITEMS_PER_PAGE } from '@utils/defaults';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Tooltip } from '@components/ui/Tooltip';
import { Button } from '@components/ui/Button';
import { Table } from '@components/ui/Table';
import { CurrencyAmount } from '@components/common/CurrencyAmount';

import s from './FarmTable.module.sass';

type FarmTableProps = {
  data: WhitelistedFarm[]
  totalCount?: number
  exchangeRate?: string
  loading?: boolean
  disabled?: boolean
  className?: string
  // fetch: any
};

const pageSize = MAX_ITEMS_PER_PAGE;

export const FarmTable: React.FC<FarmTableProps> = ({
  data,
  totalCount,
  loading = true,
  className,
  // fetch,
}) => {
  const { t } = useTranslation(['home']);
  const [pageCount, setPageCount] = useState<number>(0);
  const [, setOffset] = useState(0);

  useEffect(() => {
    if (totalCount) {
      setPageCount(totalCount);
    }
  }, [totalCount]);

  // useEffect(() => {
  //   fetch({
  //     variables: {
  //       limit: pageSize ?? 10,
  //       offset,
  //     },
  //   });
  // }, [fetch, offset, pageSize]);

  const columns = useMemo(() => [
    {
      Header: t('home|Name'),
      id: 'name',
      accessor: ({ tokenPair }:WhitelistedFarm) => (
        <div className={s.links}>
          <TokensLogos
            token1={tokenPair.token1}
            token2={tokenPair.token2}
            className={s.tokenLogo}
          />
          {getWhitelistedTokenSymbol(tokenPair.token1)}
          /
          {getWhitelistedTokenSymbol(tokenPair.token2)}
          {/* {isSponsored && (<Bage className={s.bage} text={t('home|Sponsored')} />)} */}
        </div>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Your stake')}
          <Tooltip sizeT="small" content={t('home|Total funds locked in the farming contract for each pool.')} />
        </div>
      ),
      id: 'staked',
      accessor: () => (
        <div className={s.links}>
          <span className={s.dollar}>
            $
          </span>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
        </div>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Pending Rewards')}
          <Tooltip sizeT="small" content={t('home|Expected APR (annual percentage rate) earned through an investment.')} />
        </div>
      ),
      id: 'pendingRewards',
      accessor: () => (
        <div className={s.links}>
          <span className={s.dollar}>
            $
          </span>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
        </div>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Total Value')}
          <Tooltip sizeT="small" content={t('home|Expected APR (annual percentage rate) earned through an investment.')} />
        </div>
      ),
      id: 'totalValue',
      accessor: () => (
        <div className={s.links}>
          <span className={s.dollar}>
            $
          </span>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
        </div>
      ),
    },
    {
      id: 'poolButton',
      accessor: () => (
        <div className={s.last}>
          <Button
            theme="secondary"
            className={s.button}
            href="#"
          >
            Harvest
          </Button>
          <Button
            href="/swap"
            className={s.button}
          >
            Stake
          </Button>
        </div>
      ),
    },
  ], [t]);

  return (
    <>
      <Table
        theme="pools"
        className={className}
        tableClassName={s.table}
        data={data ?? []}
        columns={columns}
        pageCount={pageCount}
        pageSize={pageSize ?? 10}
        setOffset={setOffset}
        loading={loading}
      />
    </>
  );
};
