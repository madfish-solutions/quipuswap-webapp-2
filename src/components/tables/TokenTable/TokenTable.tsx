import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import {
  WhitelistedToken,
} from '@utils/types';
import { Table } from '@components/ui/Table';

import s from '../Table.module.sass';
import { TokenItem } from './TokenItem';
import { TokenCardItem } from './TokenCardItem';

type TokenTableProps = {
  data: WhitelistedToken[]
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const Header = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(
    themeClass[colorThemeMode],
    s.tableRow,
    s.poolRow,
    s.tableHeader,
    s.tableHeaderBorder,
  );
  return (
    <th className={compoundClassName}>
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
    </th>
  );
};

const farmTableItem = (token:WhitelistedToken) => (
  <TokenItem
    key={`${token.contractAddress}:${token.fa2TokenId}`}
    token={token}
  />
);

const farmMobileItem = (token:WhitelistedToken) => (
  <TokenCardItem
    key={`${token.contractAddress}:${token.fa2TokenId}`}
    token={token}
  />
);

export const TokenTable: React.FC<TokenTableProps> = ({
  data,
}) => (
  <Table
    data={data}
    renderTableData={farmTableItem}
    renderMobileData={farmMobileItem}
    header={<Header />}
  />
);
