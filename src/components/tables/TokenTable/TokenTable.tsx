import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { WhitelistedToken } from '@utils/types';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Tooltip } from '@components/ui/Tooltip';
import { Button } from '@components/ui/Button';
import { Table } from '@components/ui/Table';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { TokenCardItem } from './TokenCardItem';

import s from './TokenTable.module.sass';

type TokenTableProps = {
  data: any[]
  loading: boolean
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const farmMobileItem = ({ token }:{ token:WhitelistedToken }) => (
  <TokenCardItem
    key={`${token.contractAddress}:${token.fa2TokenId}`}
    token={token}
  />
);

export const TokenTable: React.FC<TokenTableProps> = ({
  data,
  loading = true,
}) => {
  const { t } = useTranslation(['profile']);
  const [offset, setOffset] = useState(0);

  const { colorThemeMode } = useContext(ColorThemeContext);

  const columns = useMemo(() => [
    {
      Header: t('home|Name'),
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
      accessor: () => (
        <div className={s.links}>
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
          {t('home|Price')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'priceTokenTable',
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
      Header: (
        <div className={s.links}>
          {t('home|Total Value')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'totalValueTokenTable',
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
      id: 'poolButtonTokenTable',
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
      renderMobile={farmMobileItem}
      tableClassName={s.table}
      data={data ?? []}
      loading={loading}
      columns={columns}
      trClassName={s.tr}
      thClassName={s.th}
      tdClassName={s.td}
      pageCount={10}
      pageSize={5}
      setOffset={setOffset}
      isLinked
    />
  );
};
