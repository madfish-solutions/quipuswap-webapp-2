import { FC, useContext } from 'react';

import { Card, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { Tooltip } from '@components/ui/components/tooltip';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { StakingItem } from '@interfaces/staking.interfaces';
import { getDollarEquivalent, getTokensPairName, getTokenSymbol, isExist } from '@utils/helpers';

import { ListItemCardCell, RewardTarget, TokensLogosAndSymbols } from '../../components';
import { StakeStatusBox } from '../../components/stake-status-box';
import styles from './list-item.module.scss';
import { useListItemViewModal } from './use-list-item.vm';

const ICON_SIZE = 48;
const LINKS_THEME = 'underlined';

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const StakingListItem: FC<StakingItem> = ({
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
    stakeContractTranslation,
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

  const selectLink = `staking/${id}`;

  const myBalanceDollarEquivalent = getDollarEquivalent(myBalance, depositExchangeRate);
  const myDepositDollarEquivalent = getDollarEquivalent(depositBalance, depositExchangeRate);
  const MyEarnTokenSymbol = getTokenSymbol(rewardToken);
  const myEarnDollarEquivalent = getDollarEquivalent(earnBalance, earnExchangeRate);

  const isAllowUserData = Boolean(myBalance || depositBalance || earnBalance);

  return (
    <Card className={cx(styles.card, themeClass[colorThemeMode])}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.itemLeftHeader}>
            <TokensLogosAndSymbols width={ICON_SIZE} tokenA={tokenA} tokenB={tokenB} />
            <StakeStatusBox status={stakeStatus} />
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

            <Button href={stakeUrl} external theme={LINKS_THEME} title={stakeContractTranslation}>
              {stakeContractTranslation}
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
