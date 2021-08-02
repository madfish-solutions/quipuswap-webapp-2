import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import { Tooltip } from '@components/ui/Tooltip';
import { TokensNames, TokensNamesProps } from '@components/common/TokensNames';
import { CurrencyAmount } from '@components/common/CurrencyAmount';

import s from './TopAssetsCard.module.sass';

type PairProps = {
  tvl: string
  volume24: string
};

type FarmingProps = {
  apr: string
  totalStaked: string
};

type ButtonProps = {
  label: string
  href: string
  external?: boolean
};

export type TopAssetsCardProps = {
  id: number
  pair: Omit<TokensNamesProps, 'className'>,
  data: PairProps | FarmingProps
  buttons: {
    first: ButtonProps
    second: ButtonProps
  }
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TopAssetsCard: React.FC<TopAssetsCardProps> = ({
  pair,
  data,
  buttons,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(s.root, modeClass[colorThemeMode], className)}>
      <TokensNames {...pair} className={s.pair} />
      {'tvl' in data && (
        <div className={s.item}>
          <h4 className={s.header}>
            TVL
            <Tooltip content="TVL (Total Value Locked) represents the total amount of a specific token locked on QuiuSwap across different pools." />
          </h4>
          <CurrencyAmount amount={data.tvl} currency="$" isRightCurrency labelSize="large" />
        </div>
      )}
      {'volume24' in data && (
        <div className={s.item}>
          <h4 className={s.header}>
            Volume 24h
            <Tooltip content="A total amount of funds that were swapped via each pool today." />
          </h4>
          <CurrencyAmount amount={data.tvl} currency="$" isRightCurrency labelSize="large" />
        </div>
      )}
      {'totalStaked' in data && (
        <div className={s.item}>
          <h4 className={s.header}>
            Total staked
            <Tooltip content="Total funds locked in the farming contract for each pool." />
          </h4>
          <CurrencyAmount amount={data.totalStaked} currency="$" isRightCurrency labelSize="large" />
        </div>
      )}
      {'apr' in data && (
        <div className={s.item}>
          <h4 className={s.header}>
            APR
            <Tooltip content="Expected APR (annual percentage rate) earned through an investment." />
          </h4>
          <CurrencyAmount amount={data.apr} currency="%" labelSize="large" />
        </div>
      )}
      <div className={s.buttons}>
        <Button
          className={s.button}
          href={buttons.first.href}
          external={buttons.first.external}
          theme="secondary"
        >
          {buttons.first.label}
        </Button>
        <Button
          className={s.button}
          href={buttons.second.href}
          external={buttons.second.external}
        >
          {buttons.second.label}
        </Button>
      </div>
    </div>
  );
};
