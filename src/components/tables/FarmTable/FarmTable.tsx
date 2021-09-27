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
        <>
          <TokensLogos
            token1={tokenPair.token1}
            token2={tokenPair.token2}
            className={s.tokenLogo}
          />
          {getWhitelistedTokenSymbol(tokenPair.token1)}
          /
          {getWhitelistedTokenSymbol(tokenPair.token2)}
          {/* {isSponsored && (<Bage className={s.bage} text={t('home|Sponsored')} />)} */}
        </>
      ),
    },
    {
      Header: (
        <>
          {t('home|Total staked')}
          <Tooltip sizeT="small" content={t('home|Total funds locked in the farming contract for each pool.')} />
        </>
      ),
      id: 'staked',
      accessor: () => (
        <>
          $
          <CurrencyAmount className={s.cardAmount} amount="888888888888888.00" />
        </>
      ),
    },
    {
      Header: (
        <>
          {t('home|APR')}
          <Tooltip sizeT="small" content={t('home|Expected APR (annual percentage rate) earned through an investment.')} />
        </>
      ),
      id: 'apr',
      accessor: () => (
        <CurrencyAmount className={s.cardAmount} amount="888888888888888.00" currency="%" />
      ),
    },
    {
      id: 'poolButton',
      accessor: () => (
        <>
          <Button
            theme="secondary"
            className={s.button}
            href="#"
          >
            Get LP
          </Button>
          <Button
            href="/swap"
            className={s.button}
          >
            Farm
          </Button>
        </>
      ),
    },
  ], [t]);

  return (
    <>
      <Table
        theme="farms"
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
        disabled
      />
    </>
  );
};
