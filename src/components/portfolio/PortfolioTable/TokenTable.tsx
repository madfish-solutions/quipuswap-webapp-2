import React, { useContext, useMemo, useState } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import {
  WhitelistedToken,
} from '@utils/types';
import { MAX_ITEMS_PER_PAGE, TEZOS_TOKEN } from '@utils/defaults';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Back } from '@components/svg/Back';
import DisabledBack from '@icons/DisabledBack.svg';

import s from './PortfolioTable.module.sass';

type TokenTableProps = {
  outerHeader?: boolean
  header: string
  handleUnselect?: () => void
  data: WhitelistedToken[]
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type TokenItemProps = {
  token: WhitelistedToken
};

const TokenItem: React.FC<TokenItemProps> = ({
  token,
}) => (
  <div className={s.cardCell}>
    <div className={cx(s.links, s.cardCellItem)}>
      <TokensLogos token1={token} className={s.tokenLogo} />
      {getWhitelistedTokenSymbol(token)}
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
        href={`https://analytics.quipuswap.com/tokens/${token.contractAddress === TEZOS_TOKEN.contractAddress
          ? TEZOS_TOKEN.contractAddress
          : `${token.contractAddress}_${token.fa2TokenId ?? 0}`}`}
        external
        theme="secondary"
        className={s.button}
      >
        Analytics
      </Button>
      <Button
        href={`/swap/${TEZOS_TOKEN.contractAddress}-${getWhitelistedTokenSymbol(token)}`}
        className={s.button}
      >
        Trade
      </Button>
    </div>
  </div>
);

export const TokenTable: React.FC<TokenTableProps> = ({
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
          {data.slice(startIndex, endIndex).map((token) => (
            <TokenItem
              key={`${token.contractAddress}:${token.fa2TokenId}`}
              token={token}
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
