import React, { useContext, useMemo, useState } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import {
  WhitelistedFarm,
} from '@utils/types';
import { MAX_ITEMS_PER_PAGE, STABLE_TOKEN } from '@utils/defaults';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { ArrowDown } from '@components/svg/ArrowDown';
import { Back } from '@components/svg/Back';
import DisabledBack from '@icons/DisabledBack.svg';

import s from './PortfolioTable.module.sass';

type FarmTableProps = {
  outerHeader?: boolean
  header: string
  data: WhitelistedFarm[]
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type FarmItemProps = {
  farm: WhitelistedFarm
};

const FarmItem: React.FC<FarmItemProps> = ({
  farm,
}) => (
  <div className={s.cardCell}>
    <div className={cx(s.links, s.cardCellItem, s.maxWidth, s.wideItem, s.cardCellText)}>
      <TokensLogos
        token1={farm.tokenPair.token1}
        token2={farm.tokenPair.token2}
        className={s.tokenLogo}
      />
      {getWhitelistedTokenSymbol(farm.tokenPair.token1)}
      /
      {getWhitelistedTokenSymbol(farm.tokenPair.token2)}
      <ArrowDown className={s.arrow} />
      <TokensLogos
        token1={STABLE_TOKEN}
        className={s.tokenLogo}
      />
      {getWhitelistedTokenSymbol(STABLE_TOKEN)}
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
        theme="secondary"
        className={s.button}
      >
        Harvest
      </Button>
      <Button
        href="/stake"
        className={s.button}
      >
        Stake
      </Button>
    </div>
  </div>
);

export const FarmTable: React.FC<FarmTableProps> = ({
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
                href="/portfolio"
                control={
                  <Back className={s.proposalBackIcon} />
                }
              >
                Back
              </Button>),
          }}
        />
        )}
        {!outerHeader && (<CardHeader header={{ content: <h2 className={s.h2}>{header}</h2> }} />)}
        {outerHeader && (
        <CardHeader
          header={{ content: '', button: <Button href="/portfolio/farms" theme="inverse">View All</Button> }}
          className={s.header}
        />
        )}
        <CardHeader
          header={{
            content: (
              <div className={s.tableRow}>
                <div className={cx(s.label, s.wideItem)}>
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
          {data.slice(startIndex, endIndex).map((farm) => (
            <FarmItem
              key={`${farm.tokenPair.token1.contractAddress}_${farm.tokenPair.token1.fa2TokenId}:${farm.tokenPair.token2.contractAddress}_${farm.tokenPair.token2.fa2TokenId}`}
              farm={farm}
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
