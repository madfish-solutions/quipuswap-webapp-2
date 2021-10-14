import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { MAX_ITEMS_PER_PAGE } from '@utils/defaults';
import { WhitelistedToken } from '@utils/types';
import { getUniqueKey } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Tooltip } from '@components/ui/Tooltip';
import { Button } from '@components/ui/Button';
import { Table } from '@components/ui/Table';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { TokenCardItem } from './TokenCardItem';

import s from '../PortfolioTablesStyles.module.sass';

const pageSize = MAX_ITEMS_PER_PAGE;

type TokenTableProps = {
  data: any[]
  loading: boolean
  totalCount?: number
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const farmMobileItem = ({ token }:{ token:WhitelistedToken }) => (
  <TokenCardItem
    key={getUniqueKey()}
    token={token}
  />
);

export const TokenTable: React.FC<TokenTableProps> = ({
  data,
  loading = true,
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

  const columns = useMemo(() => [
    {
      Header: (
        <div className={s.links}>
          {t('home|Name')}
        </div>
      ),
      id: 'nameTokenTable',
      accessor: ({ token, symbol }:{ token:WhitelistedToken, symbol:string }) => (
        <div className={s.links}>
          <TokensLogos
            token1={token}
            className={s.tokenLogo}
          />
          <span className={s.cardCellText}>
            {symbol}
          </span>
          {/* {isSponsored && (<Bage className={s.bage} text={t('home|Sponsored')} />)} */}
        </div>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Your Balance')}
          <Tooltip sizeT="small" content={t('TVL (Total Value Locked) represents the total amount of a specific token locked on QuiuSwap across different pools.')} />
        </div>
      ),
      id: 'balanceTokenTable',
      accessor: ({ balance }:{ balance:string }) => (
        <CurrencyAmount
          className={s.cardAmount}
          amount={balance}
        />
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Price')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'priceTokenTable',
      accessor: ({ price }:{ price:string }) => (
        <>
          <span className={s.dollar}>
            $
          </span>
          <CurrencyAmount
            className={s.cardAmount}
            amount={price}
          />
        </>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Total Value')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'totalValueTokenTable',
      accessor: ({ totalValue }:{ totalValue:string }) => (
        <>
          <span className={s.dollar}>
            $
          </span>
          <CurrencyAmount
            className={s.cardAmount}
            amount={totalValue}
          />
        </>
      ),
    },
    {
      id: 'poolButtonTokenTable',
      accessor: () => (
        <div className={s.last}>
          <Button
            theme="secondary"
            className={s.button}
            href="#"
            external
          >
            {t('home|Analytics')}
          </Button>
          <Button
            href="#"
            className={s.button}
          >
            {t('home|Trade')}
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
      renderMobile={farmMobileItem}
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
