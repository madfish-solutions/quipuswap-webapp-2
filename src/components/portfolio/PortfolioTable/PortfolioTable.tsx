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
import { Back } from '@components/svg/Back';
import DisabledBack from '@icons/DisabledBack.svg';

import s from './PortfolioTable.module.sass';

type PortfolioTableProps = {
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
    <div className={s.links}>
      <Button
        href={`https://analytics.quipuswap.com/tokens/${token.contractAddress === TEZOS_TOKEN.contractAddress
          ? TEZOS_TOKEN.contractAddress
          : `${token.contractAddress}_${token.fa2TokenId}`}`}
        external
        theme="secondary"
      >
        Analytics
      </Button>
      <Button
        href={`/swap/${TEZOS_TOKEN.contractAddress}-${getWhitelistedTokenSymbol(token)}`}
      >
        Trade
      </Button>
    </div>
  </div>
);

export const PortfolioTable: React.FC<PortfolioTableProps> = ({
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
        <CardHeader header={{
          content: (
            <Button onClick={handleUnselect} theme="quaternary" className={s.proposalHeader}>
              <Back className={s.proposalBackIcon} />
              Back
            </Button>),
        }}
        />
        )}
        {!outerHeader && (<CardHeader header={{ content: <h2 className={s.h2}>{header}</h2> }} />)}
        <CardHeader header={{ content: '', button: <Button theme="inverse">View All</Button> }} />
        <CardHeader header={{
          content: (
            <div className={s.tableRow}>
              <div className={s.label}>
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
                <span>{page}</span>
                of
                <span>{pageMax}</span>
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
