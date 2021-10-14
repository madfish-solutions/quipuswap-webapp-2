import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
} from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { MAX_ITEMS_PER_PAGE } from '@utils/defaults';
import { getUniqueKey } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Tooltip } from '@components/ui/Tooltip';
import { Button } from '@components/ui/Button';
import { Table } from '@components/ui/Table';
// import { Bage } from '@components/ui/Bage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { WhitelistedToken } from '@utils/types';
import { InvestCardItem } from './InvestCardItem';

import s from '../PortfolioTablesStyles.module.sass';

type InvestTableProps = {
  data: any[]
  totalCount?: number
  exchangeRate?: string
  loading?: boolean
  className?: string
  fetch?: any
};

const pageSize = MAX_ITEMS_PER_PAGE;

const investMobileItem = () => (
  <InvestCardItem
    key={getUniqueKey()}
  />
);

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const InvestTable: React.FC<InvestTableProps> = ({
  data,
  totalCount,
  loading = true,
  className,
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

  // useEffect(() => {
  //   fetch({
  //     variables: {
  //       limit: pageSize ?? 10,
  //       offset,
  //     },
  //   });
  // }, [fetch, offset]);

  const columns = useMemo(() => [
    {
      Header: (
        <div className={s.links}>
          {t('home|Name')}
        </div>
      ),
      id: 'name',
      accessor: ({ token1, token2 }:{ token1:WhitelistedToken, token2: WhitelistedToken }) => (
        <div className={s.links}>
          <TokensLogos
            token1={token1}
            token2={token2}
            className={s.tokenLogo}
          />
          <span className={s.cardCellText}>
            {token1.metadata.symbol}
            /
            {token2.metadata.symbol}
          </span>
          {/* {isSponsored && (<Bage className={s.bage} text={t('home|Sponsored')} />)} */}
        </div>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Your Share')}
          <Tooltip sizeT="small" content={t('TVL (Total Value Locked) represents the total amount of a specific token locked on QuiuSwap across different pools.')} />
        </div>
      ),
      id: 'yourShare',
      accessor: () => (
        <>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
          <span className={s.dollar}>
            %
          </span>
        </>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Your LP Balance')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'yourLPBalance',
      accessor: () => (
        <>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
          <span className={s.dollar}>
            LP
          </span>
        </>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Your Liquidity')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'yourLiquidity',
      accessor: () => (
        <>
          <span className={s.dollar}>
            $
          </span>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
        </>
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
            external
          >
            {t('home|Remove')}
          </Button>
          <Button
            href="#"
            className={s.button}
          >
            {t('home|Add')}
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
      renderMobile={investMobileItem}
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
