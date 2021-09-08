import React, { useContext, useMemo, useState } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import {
  TransactionType,
} from '@utils/types';
import { MAX_ITEMS_PER_PAGE } from '@utils/defaults';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Back } from '@components/svg/Back';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { ExternalLink } from '@components/svg/ExternalLink';
import DisabledBack from '@icons/DisabledBack.svg';

import s from './PortfolioTable.module.sass';

type TransactionTableProps = {
  outerHeader?: boolean
  header: string
  handleUnselect?: () => void
  data: any[]
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type TransactionItemProps = {
  transaction: TransactionType
};

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
}) => (
  <div className={s.cardCell}>
    <div className={cx(s.links, s.cardCellItem, s.maxWidth)}>
      {transaction.action}
      <Button className={s.currency} theme="underlined">
        {getWhitelistedTokenSymbol(transaction.from)}
      </Button>
      to
      <Button className={s.currency} theme="underlined">
        {getWhitelistedTokenSymbol(transaction.to)}
      </Button>
    </div>
    <div className={s.cardCellItem}>
      <CurrencyAmount amount="888888888888888.00" />
    </div>
    <div className={s.cardCellItem}>
      <CurrencyAmount amount="888888888888888.00" currency={getWhitelistedTokenSymbol(transaction.from)} />
    </div>
    <div className={s.cardCellItem}>
      <CurrencyAmount amount="888888888888888.00" currency={getWhitelistedTokenSymbol(transaction.to)} />
    </div>
    <div className={cx(s.links, s.cardCellItem)}>
      <Button
        theme="inverse"
        icon={<ExternalLink />}
      >
        5/25/2021 3:00:51 PM
      </Button>
    </div>
  </div>
);

export const TransactionTable: React.FC<TransactionTableProps> = ({
  outerHeader = false,
  header,
  handleUnselect = () => {},
  data,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [page, setPage] = useState<number>(1);
  const pageMax = useMemo(() => Math.ceil(data.length / MAX_ITEMS_PER_PAGE), [data.length]);
  const startIndex = (page - 1) * MAX_ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + MAX_ITEMS_PER_PAGE - 1, data.length - 1);

  return (
    <>
      {outerHeader && (
      <h1 className={s.h1}>
        {header}
      </h1>
      )}
      <Card
        className={cx(s.portfolioCard, themeClass[colorThemeMode])}
      >
        {!outerHeader && (
        <CardHeader
          header={{
            content: (
              <Button onClick={handleUnselect} theme="quaternary" className={s.proposalHeader}>
                <Back className={s.proposalBackIcon} />
                Back
              </Button>),
          }}
        />
        )}
        {!outerHeader && (<CardHeader header={{ content: <h2 className={s.h2}>{header}</h2> }} />)}
        <CardHeader
          header={{ content: '', button: <Button theme="inverse">View All</Button> }}
          className={s.header}
        />
        <CardHeader
          header={{
            content: (
              <div className={s.tableRow}>
                <div className={cx(s.label)}>
                  Action
                </div>
                <div className={s.label}>
                  Total Value
                </div>
                <div className={s.label}>
                  Token A Amount
                </div>
                <div className={s.label}>
                  Token B Amount
                </div>
                <div className={s.label}>
                  Time
                </div>
              </div>),
          }}
        />
        <CardContent className={s.container}>
          {data.slice(startIndex, endIndex).map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))}
          <div className={s.cardCellSmall}>
            <div className={s.footer}>
              <Button
                onClick={() => setPage(page - 1)}
                theme="quaternary"
                disabled={page < 2}
              >
                {page !== 1 ? (<Back />) : <DisabledBack />}
              </Button>
              <div className={s.pagination}>
                Page
                <span className={s.paginationPage}>{page}</span>
                of
                <span className={s.paginationPage}>{pageMax}</span>
              </div>
              <Button
                onClick={() => setPage(page + 1)}
                theme="quaternary"
                disabled={page > pageMax - 1}
              >
                {page < (pageMax)
                  ? (<Back className={s.forward} />)
                  : <DisabledBack className={s.forward} />}
              </Button>

            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
