import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
} from 'react';
import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { MAX_ITEMS_PER_PAGE, TEZOS_TOKEN } from '@utils/defaults';
import { fromDecimals } from '@utils/helpers';
import { PoolTableType } from '@utils/types';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
// import { Bage } from '@components/ui/Bage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Tooltip } from '@components/ui/Tooltip';
import { Button } from '@components/ui/Button';
import { Table } from '@components/ui/Table';

import s from './PoolTable.module.sass';
import { PoolCardItem } from './PoolCardItem';

type PoolTableProps = {
  data?: PoolTableType
  totalCount?: number
  exchangeRate?: string
  loading?: boolean
  className?: string
  fetch: any
};

const pageSize = MAX_ITEMS_PER_PAGE;

const poolMobileItem = (pool:PoolTableType) => (
  <PoolCardItem
    key={pool.pair.name}
    pool={pool}
  />
);

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

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

  const { colorThemeMode } = useContext(ColorThemeContext);

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
  }, [fetch, offset]);
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
      theme="pools"
      className={cx(className, modeClass[colorThemeMode])}
      tableClassName={s.table}
      renderMobile={poolMobileItem}
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
