import React, { useMemo, useState, useEffect } from 'react';

import { Table, Button, Tooltip, TokensLogos, CurrencyAmount } from '@quipuswap/ui-kit';
import { useTranslation } from 'next-i18next';

import { MAX_ITEMS_PER_PAGE } from '@utils/defaults';
import { getWhitelistedTokenSymbol, prepareTokenLogo } from '@utils/helpers';
import { WhitelistedFarm } from '@utils/types';

import s from './FarmTable.module.sass';

type FarmTableProps = {
  data: WhitelistedFarm[];
  totalCount?: number;
  exchangeRate?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  // fetch: any
};

const pageSize = MAX_ITEMS_PER_PAGE;

export const FarmTable: React.FC<FarmTableProps> = ({
  data,
  totalCount,
  loading = true,
  className
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
  const columns = useMemo(
    () => [
      {
        Header: t('home|Name'),
        id: 'name',
        accessor: ({ tokenPair }: WhitelistedFarm) => (
          <>
            <TokensLogos
              firstTokenIcon={prepareTokenLogo(tokenPair.token1.metadata.thumbnailUri)}
              firstTokenSymbol={getWhitelistedTokenSymbol(tokenPair.token1)}
              secondTokenIcon={prepareTokenLogo(tokenPair.token2.metadata.thumbnailUri)}
              secondTokenSymbol={getWhitelistedTokenSymbol(tokenPair.token2)}
              className={s.tokenLogo}
            />
            {getWhitelistedTokenSymbol(tokenPair.token1)}/{getWhitelistedTokenSymbol(tokenPair.token2)}
            {/* {isSponsored && (<Bage className={s.bage} text={t('home|Sponsored')} />)} */}
          </>
        )
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
            <CurrencyAmount amount="888888888888888.00" currency="$" isLeftCurrency className={s.cardAmount} />
          </>
        )
      },
      {
        Header: (
          <>
            {t('home|APR')}
            <Tooltip
              sizeT="small"
              content={t('home|Expected APR (annual percentage rate) earned through an investment.')}
            />
          </>
        ),
        id: 'apr',
        accessor: () => (
          <CurrencyAmount amount="888888888888888.00" currency="%" isLeftCurrency className={s.cardAmount} />
        )
      },
      {
        id: 'poolButton',
        accessor: () => (
          <>
            <Button theme="secondary" className={s.button} href="#">
              Get LP
            </Button>
            <Button href="/swap" className={s.button}>
              Farm
            </Button>
          </>
        )
      }
    ],
    [t]
  );

  return (
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
  );
};
