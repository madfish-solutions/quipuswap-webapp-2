import { FC, useContext } from 'react';

import cx from 'classnames';

import { FarmingItem } from '@modules/farming/interfaces';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button, Card, StateCurrencyAmount, StatusLabel, Tooltip } from '@shared/components';
import { getTokensPairName, getTokenSymbol, isExist, multipliedIfPossible } from '@shared/helpers';

import { ListItemCardCell, RewardTarget, TokensLogosAndSymbols } from '../../components';
import styles from './list-item.module.scss';
import { useListItemViewModal } from './use-list-item.vm';

const ICON_SIZE = 48;
const LINKS_THEME = 'underlined';

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const FarmingListItem: FC<FarmingItem> = ({
  id,
  tokenA,
  tokenB,
  stakeStatus,
  rewardToken,
  tvlInStakedToken: tvl,
  tvlInUsd: tvlDollarEquivalent,
  apr,
  apy,
  depositExchangeRate,
  earnExchangeRate,
  stakeUrl,
  depositTokenUrl,
  myBalance,
  depositBalance,
  earnBalance
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { translation } = useListItemViewModal();

  const {
    selectTranslation,
    fullCardTooltipTranslation,
    tokenContractTranslation,
    farmingContractTranslation,
    tvlTranslation,
    tvlTooltipTranslation,
    aprTranslation,
    aprTooltipTranslation,
    apyTranslation,
    apyTooltipTranslation,
    yourBalanceTranslation,
    yourBalanceTooltipTranslation,
    yourDepositTranslation,
    yourDepositTooltipTranslation,
    yourEarnedTranslation,
    yourEarnedTooltipTranslation
  } = translation;

  const isPairFull = isExist(tokenB);
  const depositTokenSymbol = isPairFull ? getTokensPairName(tokenA, tokenB) : getTokenSymbol(tokenA);

  const selectLink = `farming/${id}`;

  const myBalanceDollarEquivalent = multipliedIfPossible(myBalance, depositExchangeRate);
  const myDepositDollarEquivalent = multipliedIfPossible(depositBalance, depositExchangeRate);
  const MyEarnTokenSymbol = getTokenSymbol(rewardToken);
  const myEarnDollarEquivalent = multipliedIfPossible(earnBalance, earnExchangeRate);

  const isAllowUserData = Boolean(myBalance || depositBalance || earnBalance);

  return (
    <Card className={cx(styles.card, themeClass[colorThemeMode])}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.itemLeftHeader}>
            <TokensLogosAndSymbols width={ICON_SIZE} tokenA={tokenA} tokenB={tokenB} />
            <StatusLabel status={stakeStatus} />
            <Tooltip className={styles.tooltip} content={fullCardTooltipTranslation} />
          </div>

          <div className={styles.rewardTarget}>
            <RewardTarget token={rewardToken} />
          </div>

          <div className={styles.stats}>
            <div className={styles.stakeStats}>
              <ListItemCardCell
                cellName={tvlTranslation}
                tooltip={tvlTooltipTranslation}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
              >
                <StateCurrencyAmount
                  amount={tvl}
                  currency={depositTokenSymbol}
                  dollarEquivalent={tvlDollarEquivalent}
                />
              </ListItemCardCell>

              <ListItemCardCell
                cellName={aprTranslation}
                tooltip={aprTooltipTranslation}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
              >
                <StateCurrencyAmount amount={apr} currency="%" isError={!apr} />
              </ListItemCardCell>

              <ListItemCardCell
                cellName={apyTranslation}
                tooltip={apyTooltipTranslation}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
              >
                <StateCurrencyAmount amount={apy} currency="%" isError={!apr} />
              </ListItemCardCell>
            </div>
            {isAllowUserData && (
              <div className={styles.userData}>
                <ListItemCardCell
                  cellName={yourBalanceTranslation}
                  tooltip={yourBalanceTooltipTranslation}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                >
                  <StateCurrencyAmount
                    amount={myBalance}
                    currency={depositTokenSymbol}
                    dollarEquivalent={myBalanceDollarEquivalent}
                    isError={!myBalance}
                  />
                </ListItemCardCell>

                <ListItemCardCell
                  cellName={yourDepositTranslation}
                  tooltip={yourDepositTooltipTranslation}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                >
                  <StateCurrencyAmount
                    amount={depositBalance}
                    currency={depositTokenSymbol}
                    dollarEquivalent={myDepositDollarEquivalent}
                    isError={!depositBalance}
                  />
                </ListItemCardCell>

                <ListItemCardCell
                  cellName={yourEarnedTranslation}
                  tooltip={yourEarnedTooltipTranslation}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                >
                  <StateCurrencyAmount
                    amount={earnBalance}
                    currency={MyEarnTokenSymbol}
                    dollarEquivalent={myEarnDollarEquivalent}
                    isError={!earnBalance}
                  />
                </ListItemCardCell>
              </div>
            )}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.links}>
            <Button href={depositTokenUrl} external theme={LINKS_THEME} title={tokenContractTranslation}>
              {tokenContractTranslation}
            </Button>

            <Button href={stakeUrl} external theme={LINKS_THEME} title={farmingContractTranslation}>
              {farmingContractTranslation}
            </Button>
          </div>

          <Button className={styles.button} href={selectLink}>
            {selectTranslation}
          </Button>
        </div>
      </div>
    </Card>
  );
};
