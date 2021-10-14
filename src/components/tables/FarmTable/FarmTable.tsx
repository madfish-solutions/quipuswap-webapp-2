import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { MAX_ITEMS_PER_PAGE } from '@utils/defaults';
import { getUniqueKey, getWhitelistedTokenSymbol } from '@utils/helpers';
import { WhitelistedFarm, WhitelistedToken } from '@utils/types';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Tooltip } from '@components/ui/Tooltip';
import { Button } from '@components/ui/Button';
import { Table } from '@components/ui/Table';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { FarmCardItem } from './FarmCardItem';

import s from '../PortfolioTablesStyles.module.sass';

const pageSize = MAX_ITEMS_PER_PAGE;

type FarmTableProps = {
  data: any[]
  totalCount?: number
  exchangeRate?: string
  loading?: boolean
  disabled?: boolean
  className?: string
  // fetch: any
};

const farmMobileItem = (farm:WhitelistedFarm) => (
  <FarmCardItem
    key={getUniqueKey()}
    farm={farm}
  />
);

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const FarmTable: React.FC<FarmTableProps> = ({
  data,
  totalCount,
  loading = true,
  className,
  // fetch,
}) => {
  const { t } = useTranslation(['home']);
  const { colorThemeMode } = useContext(ColorThemeContext);
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
      Header: (
        <div className={s.links}>
          {t('home|Name')}
        </div>
      ),
      id: 'name',
      accessor: (
        { tokenPair }:{ tokenPair: { token1: WhitelistedToken, token2: WhitelistedToken } },
      ) => (
        <div className={s.links}>
          <TokensLogos
            token1={tokenPair.token1}
            token2={tokenPair.token2}
            className={s.tokenLogo}
          />
          <span className={s.cardCellText}>
            {getWhitelistedTokenSymbol(tokenPair.token1)}
            /
            {getWhitelistedTokenSymbol(tokenPair.token2)}
          </span>
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
          {t('home|Pending Rewards')}
          <Tooltip sizeT="small" content={t('home|Expected APR (annual percentage rate) earned through an investment.')} />
        </div>
      ),
      id: 'pendingRewards',
      accessor: () => (
        <>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
          <span className={s.dollar}>
            TOKEN
          </span>
        </>
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
        className={cx(className, modeClass[colorThemeMode])}
        tableClassName={s.table}
        renderMobile={farmMobileItem}
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
    </>
  );
};
