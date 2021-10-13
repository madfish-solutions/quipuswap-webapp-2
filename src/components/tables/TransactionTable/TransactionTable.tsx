import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import {
  TransactionType,
} from '@utils/types';
import { Table } from '@components/ui/Table';

import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Tooltip } from '@components/ui/Tooltip';
import { TEZOS_TOKEN, STABLE_TOKEN } from '@utils/defaults';
import { TransactionCardItem } from './TransactionCardItem';

import s from '../TokenTable/TokenTable.module.sass';

type TransactionTableProps = {
  data: TransactionType[]
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
}) => {
  const { t } = useTranslation(['profile']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const [offset, setOffset] = useState(0);

  const columns = useMemo(() => [
    {
      Header: t('home|Action'),
      id: 'action',
      accessor: () => (
        <div className={s.links}>
          <TokensLogos
            token1={TEZOS_TOKEN}
            token2={STABLE_TOKEN}
            className={s.tokenLogo}
          />
          <span className={s.cardCellText}>
            {TEZOS_TOKEN.metadata.symbol}
            /
            {STABLE_TOKEN.metadata.symbol}
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
          {t('home|Token B Amount')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'tokenBAmount',
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
      columns={columns}
      trClassName={s.tr}
      thClassName={s.th}
      tdClassName={s.td}
      setOffset={setOffset}
    />
  );
};
