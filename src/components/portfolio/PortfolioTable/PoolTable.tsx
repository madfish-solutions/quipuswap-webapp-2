import React, { useContext, useMemo, useState } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { WhitelistedTokenPair } from '@utils/types';
import { MAX_ITEMS_PER_PAGE } from '@utils/defaults';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Back } from '@components/svg/Back';
import DisabledBack from '@icons/DisabledBack.svg';

import s from './PortfolioTable.module.sass';

type PoolTableProps = {
  outerHeader?: boolean
  header: string
  data: WhitelistedTokenPair[]
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type PoolItemProps = {
  pair: WhitelistedTokenPair
};

const PoolItem: React.FC<PoolItemProps> = ({
  pair,
}) => (
  <div className={s.cardCell}>
    <div className={cx(s.links, s.cardCellItem, s.cardCellText)}>
      <TokensLogos token1={pair.token1} token2={pair.token2} className={s.tokenLogo} />
      {getWhitelistedTokenSymbol(pair.token1)}
      /
      {getWhitelistedTokenSymbol(pair.token2)}
    </div>
    <div className={s.cardCellItem}>
      <CurrencyAmount amount="888888888888888.00" />
    </div>
    <div className={s.cardCellItem}>
      <CurrencyAmount amount="888888888888888.00" currency="$" />
    </div>
    <div className={s.cardCellItem}>
      <CurrencyAmount amount="888888888888888.00" currency="$" />
    </div>
    <div className={cx(s.links, s.cardCellItem)}>
      <Button
        href={`/liquidity/remove/${getWhitelistedTokenSymbol(pair.token1)}-${getWhitelistedTokenSymbol(pair.token2)}`}
        theme="secondary"
        className={s.button}
      >
        Remove
      </Button>
      <Button
        href={`/liquidity/add/${getWhitelistedTokenSymbol(pair.token1)}-${getWhitelistedTokenSymbol(pair.token2)}`}
        className={s.button}
      >
        Add
      </Button>
    </div>
  </div>
);

export const PoolTable: React.FC<PoolTableProps> = ({
  outerHeader = false,
  header,
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
              <Button
                theme="quaternary"
                className={s.proposalHeader}
                control={
                  <Back className={s.proposalBackIcon} />
                }
                href="/portfolio"
              >
                Back
              </Button>),
          }}
        />
        )}
        {!outerHeader && (<CardHeader header={{ content: <h2 className={s.h2}>{header}</h2> }} />)}
        {outerHeader && (
        <CardHeader
          header={{ content: '', button: <Button href="/portfolio/pools" theme="inverse">View All</Button> }}
          className={s.header}
        />
        )}
        <CardHeader
          header={{
            content: (
              <div className={s.tableRow}>
                <div className={cx(s.label, s.shortLabel)}>
                  Name
                </div>
                <div className={s.label}>
                  Your Balance
                </div>
                <div className={s.label}>
                  Price
                </div>
                <div className={s.label}>
                  Total Value
                </div>
                <div className={s.label} />
              </div>),
          }}
        />
        <CardContent className={s.container}>
          {data.slice(startIndex, endIndex).map((pair) => (
            <PoolItem
              key={`${pair.token1.contractAddress}_${pair.token1.fa2TokenId}:${pair.token2.contractAddress}_${pair.token2.fa2TokenId}`}
              pair={pair}
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
