import { FC } from 'react';

import { Card } from '@quipuswap/ui-kit';

import { Tooltip } from '@components/ui/components/tooltip';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { StakingItem } from '@interfaces/staking.interfaces';
import { bigNumberToString, getDollarEquivalent, getTokensPairName, getTokenSymbol, isExist } from '@utils/helpers';

import { ListItemCardCell, RewardTarget, TokensLogosAndSymbols } from '../../components';
import { StakeStatusBox } from '../../components/stake-status-box';
import styles from './list-item.module.scss';

const ICON_SIZE = 48;

// TODO: Move to Translation
const SELECT = 'Select';
const FULL_CARD_TOOLTIP_TEXT = 'This is text';
const TOKEN_CONTRACT = 'Token contract';
const STAKE_CONTRACT = 'Farm Contract';
const LINKS_THEME = 'underlined';
const TVL = 'TVL';
const TVL_TOOLTIP = 'tvl tooltip';
const APR = 'APR';
const APR_TOOLTIP = 'apr tooltip';
const APY = 'APY';
const APY_TOOLTIP = 'apy tooltip';
const MY_BALANCE = 'My Balance';
const MY_BALANCE_TOOLTIP = 'My Balance tooltip';
const MY_DEPOSIT = 'My Deposit';
const MY_DEPOSIT_TOOLTIP = 'My Deposit tooltip';
const MY_EARNED = 'My Earned';
const MY_EARNED_TOOLTIP = 'My Earned tooltip';

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
  const isPairFull = isExist(tokenB);
  const depositTokenSymbol = isPairFull ? getTokensPairName(tokenA, tokenB) : getTokenSymbol(tokenA);

  const selectLink = `staking/${id}`;

  const myBalanceDollarEquivalent = getDollarEquivalent(myBalance, bigNumberToString(depositExchangeRate));
  const myDepositDollarEquivalent = getDollarEquivalent(depositBalance, bigNumberToString(depositExchangeRate));
  const MyEarnTokenSymbol = getTokenSymbol(rewardToken);
  const myEarnDollarEquivalent = getDollarEquivalent(earnBalance, bigNumberToString(earnExchangeRate));

  const isAllowUserData = Boolean(myBalance || depositBalance || earnBalance);

  return (
    <Card className={styles.card}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.itemLeftHeader}>
            <TokensLogosAndSymbols width={ICON_SIZE} tokenA={tokenA} tokenB={tokenB} />
            <StakeStatusBox status={stakeStatus} />
            <Tooltip className={styles.tooltip} content={FULL_CARD_TOOLTIP_TEXT} />
          </div>

          <div className={styles.rewardTarget}>
            <RewardTarget token={rewardToken} />
          </div>

          <div className={styles.stats}>
            <div className={styles.stakeStats}>
              <ListItemCardCell
                cellName={TVL}
                tooltip={TVL_TOOLTIP}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
              >
                <StateCurrencyAmount
                  amount={tvl}
                  currency={depositTokenSymbol}
                  dollarEquivalent={bigNumberToString(tvlDollarEquivalent)}
                />
              </ListItemCardCell>

              <ListItemCardCell
                cellName={APR}
                tooltip={APR_TOOLTIP}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
              >
                <StateCurrencyAmount amount={apr} currency="%" isError={!apr} />
              </ListItemCardCell>

              <ListItemCardCell
                cellName={APY}
                tooltip={APY_TOOLTIP}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
              >
                <StateCurrencyAmount amount={apy} currency="%" isError={!apr} />
              </ListItemCardCell>
            </div>
            {isAllowUserData && (
              <div className={styles.userData}>
                <ListItemCardCell
                  cellName={MY_BALANCE}
                  tooltip={MY_BALANCE_TOOLTIP}
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
                  cellName={MY_DEPOSIT}
                  tooltip={MY_DEPOSIT_TOOLTIP}
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
                  cellName={MY_EARNED}
                  tooltip={MY_EARNED_TOOLTIP}
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
            <Button href={depositTokenUrl} external theme={LINKS_THEME} title={TOKEN_CONTRACT}>
              {TOKEN_CONTRACT}
            </Button>

            <Button href={stakeUrl} external theme={LINKS_THEME} title={STAKE_CONTRACT}>
              {STAKE_CONTRACT}
            </Button>
          </div>

          <Button className={styles.button} href={selectLink}>
            {SELECT}
          </Button>
        </div>
      </div>
    </Card>
  );
};
