import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import {
  TransactionType,
  WhitelistedToken,
} from '@utils/types';
import { MAX_ITEMS_PER_PAGE } from '@utils/defaults';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Tooltip } from '@components/ui/Tooltip';
import { Button } from '@components/ui/Button';
import { Table } from '@components/ui/Table';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { TransactionCardItem } from './TransactionCardItem';

import s from '../TokenTable/TokenTable.module.sass';

const pageSize = MAX_ITEMS_PER_PAGE;

type TransactionTableProps = {
  data: TransactionType[]
  loading: boolean
  totalCount: number
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const transactionMobileItem = (transaction:TransactionType) => (
  <TransactionCardItem
    key={transaction.id}
    transaction={transaction}
  />
);

export const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  loading,
  totalCount,
}) => {
  const { t } = useTranslation(['profile']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [offset, setOffset] = useState(0);

  const [pageCount, setPageCount] = useState<number>(0);

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
      Header: (
        <div className={s.links}>
          {t('home|Action')}
        </div>
      ),
      id: 'action',
      accessor: ({ from, to }: { from:WhitelistedToken, to:WhitelistedToken }) => (
        <div className={s.links}>
          <TokensLogos
            token1={from}
            token2={to}
            className={s.tokenLogo}
          />
          <span className={s.cardCellText}>
            {from.metadata.symbol}
            /
            {to.metadata.symbol}
          </span>
          {/* {isSponsored && (<Bage className={s.bage} text={t('home|Sponsored')} />)} */}
        </div>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Total Value')}
          <Tooltip sizeT="small" content={t('TVL (Total Value Locked) represents the total amount of a specific token locked on QuiuSwap across different pools.')} />
        </div>
      ),
      id: 'balance',
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
          {t('home|Token A Amount')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'tokenAAmount',
      accessor: ({ from }) => (
        <>
          <span className={s.dollar}>
            $
          </span>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
          <span className={s.dollar}>
            {from.metadata.symbol}
          </span>
        </>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Token B Amount')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'tokenBAmount',
      accessor: ({ to }) => (
        <>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
          <span className={s.dollar}>
            {to.metadata.symbol}
          </span>
        </>
      ),
    },
    {
      id: 'time',
      accessor: () => (
        <div className={s.last}>
          <Button
            theme="secondary"
            className={s.button}
            href="#"
            external
          >
            Analytics
          </Button>
          <Button
            href="#"
            className={s.button}
          >
            Trade
          </Button>
        </div>
      ),
    },
    // eslint-disable-next-line
  ], [data, offset, t]);

  return (
    <Table
      theme="pools"
      className={cx(modeClass[colorThemeMode])}
      tableClassName={s.table}
      renderMobile={transactionMobileItem}
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
