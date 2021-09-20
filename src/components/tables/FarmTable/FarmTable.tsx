import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import {
  WhitelistedFarm,
} from '@utils/types';
import { TEZOS_TOKEN } from '@utils/defaults';
import { Table } from '@components/ui/Table';

import { Tooltip } from '@components/ui/Tooltip';
import s from './FarmTable.module.sass';
import { FarmItem } from './FarmItem';
import { FarmCardItem } from './FarmCardItem';

type FarmTableProps = {
  data: WhitelistedFarm[]
  disabled?: boolean
  loading: boolean
};
const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const Header = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['home']);
  const compoundClassName = cx(
    themeClass[colorThemeMode],
    s.tableRow,
    s.farmRow,
    s.tableHeader,
    s.tableHeaderBorder,
  );
  return (
    <th className={compoundClassName}>
      <div className={s.label}>
        {t('home:Name')}
      </div>
      <div className={s.label}>
        {t('home:Total staked')}
        <Tooltip sizeT="small" content={t('home:Total funds locked in the farming contract for each pool.')} />
      </div>
      <div className={s.label}>
        {t('home:APR')}
        <Tooltip sizeT="small" content={t('home:Expected APR (annual percentage rate) earned through an investment.')} />
      </div>
      <div className={s.label} />
    </th>
  );
};

const farmTableItem = (farm:WhitelistedFarm) => {
  const { tokenPair } = farm;
  return (
    <FarmItem
      key={`${tokenPair.token1.contractAddress}_${tokenPair.token1.fa2TokenId}:${tokenPair.token2.contractAddress}_${tokenPair.token2.fa2TokenId}`}
      farm={farm}
      isSponsored={
      tokenPair.token1.contractAddress === TEZOS_TOKEN.contractAddress
    }
    />
  );
};

const farmMobileItem = (farm:WhitelistedFarm) => {
  const { tokenPair } = farm;
  return (
    <FarmCardItem
      key={`${tokenPair.token1.contractAddress}_${tokenPair.token1.fa2TokenId}:${tokenPair.token2.contractAddress}_${tokenPair.token2.fa2TokenId}`}
      farm={farm}
      isSponsored={
      tokenPair.token1.contractAddress === TEZOS_TOKEN.contractAddress
    }
    />
  );
};

export const FarmTable: React.FC<FarmTableProps> = ({
  data,
  disabled = false,
  loading,
}) => {
  if (loading) {
    return (
      <Table
        disabled={disabled}
        data={data}
        renderTableData={farmTableItem}
        renderMobileData={farmMobileItem}
        header={<Header />}
      />
    );
  }
  return (
    <Table
      disabled={disabled}
      data={data}
      renderTableData={farmTableItem}
      renderMobileData={farmMobileItem}
      header={<Header />}
    />
  );
};
