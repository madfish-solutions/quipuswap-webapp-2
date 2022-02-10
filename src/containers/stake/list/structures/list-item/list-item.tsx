import { FC } from 'react';

import { Card } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

import { Tooltip } from '@components/ui/components/tooltip';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { useAccountPkh } from '@utils/dapp';
import { getTokenPairSlug, getTokenSlug, getTokensPairName, getTokenSymbol, isExist } from '@utils/helpers';
import { Token } from '@utils/types';

import { ListItemCardCell, RewardTarget, TokensLogosAndSymbols } from '../../elements';
import { eStakeStatus, StakeStatus } from '../../elements/stake-status';
import styles from './list-item.module.scss';

const ICON_SIZE = 48;

const SELECT = 'Select';

const FULL_CARD_TOOLTIP_TEXT = 'This is text';

const TOKEN_CONTRACT = 'Token contract';
const STAKE_CONTRACT = 'Farm Contract';
const LINKS_THEME = 'underlined';

const TVL = 'TVL';
const TVL_TOOLTIP = 'tvl tooltip';

const APR = 'APR';
const APR_TOOLTIP = 'apr tooltip';

const APY = 'My Balance';
const APY_TOOLTIP = 'apy tooltip';

const MY_BALANCE = 'My Balance';
const MY_BALANCE_TOOLTIP = 'My Balance tooltip';

const MY_DEPOSIT = 'My Deposit';
const MY_DEPOSIT_TOOLTIP = 'My Deposit tooltip';

const MY_EARNED = 'My Earned';
const MY_EARNED_TOOLTIP = 'My Erned tooltip';

interface StakeListItemProps {
  tokenA: Token;
  tokenB: Token;
  stakeStatus: eStakeStatus;
  rewardToken: Token;
  tvl: string;
  apr: number;
  apy: number;
  myBalance: string;
  depositBalance: string;
  earnBalance: string;
  depositExhangeRate: string;
  earnExhangeRate: string;
  stakeUrl: string;
  depositTokenUrl: string;
}

const getDollarEquivalent = (value: string, exhangeRate: string) =>
  new BigNumber(value).times(new BigNumber(exhangeRate)).toFixed();

export const StakeListItem: FC<StakeListItemProps> = ({
  tokenA,
  tokenB,
  stakeStatus,
  rewardToken,
  tvl,
  apr,
  apy,
  myBalance,
  depositBalance,
  earnBalance,
  depositExhangeRate,
  earnExhangeRate,
  stakeUrl,
  depositTokenUrl
}) => {
  const accountPkh = useAccountPkh();

  const TOKEN_A = tokenA;
  const TOKEN_B = tokenB;

  const isPairFull = isExist(TOKEN_B);

  const STAKE_STATUS = stakeStatus;

  const REWARD_TOKEN = rewardToken;

  const LOCKED_TOKEN_SYMBOL = isPairFull ? getTokensPairName(TOKEN_A, TOKEN_B) : getTokenSymbol(TOKEN_A);
  const TVL_AMOUNT = tvl;
  const LOCKED_TOKEN_DOLLAR_EQUIVALENT = getDollarEquivalent(tvl, depositExhangeRate);

  const APR_AMOUNT = `${apr}%`;
  const APY_AMOUNT = `${apy}%`;

  const MY_BALANCE_AMOUNT = myBalance;
  const MY_BALANCE_DOLLAR_EQUIVALENT = getDollarEquivalent(myBalance, depositExhangeRate);

  const MY_DEPOSIT_AMOUNT = depositBalance;
  const MY_DEPOSIT_DOLLAR_EQUIVALENT = getDollarEquivalent(myBalance, depositExhangeRate);

  const MY_EARNED_TOKEN_SYMBOL = getTokenSymbol(REWARD_TOKEN);
  const MY_EARNED_AMOUNT = earnBalance;
  const MY_EARNED_DOLLAR_EQUIVALENT = getDollarEquivalent(earnBalance, earnExhangeRate);

  const TOKEN_CONTRACT_URL = stakeUrl;
  const STAKE_CONTRACT_URL = depositTokenUrl;
  const SELECT_LINK = isPairFull ? `stake/${getTokenPairSlug(TOKEN_A, TOKEN_B)}` : getTokenSlug(TOKEN_A);

  return (
    <Card className={styles.card}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.itemLeftHeader}>
            <TokensLogosAndSymbols width={ICON_SIZE} tokenA={TOKEN_A} tokenB={TOKEN_B} />
            <StakeStatus status={STAKE_STATUS} />
            <Tooltip className={styles.tooltip} content={FULL_CARD_TOOLTIP_TEXT} />
          </div>

          <div className={styles.rewardTarget}>
            <RewardTarget token={REWARD_TOKEN} />
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
                  balanceRule
                  amount={TVL_AMOUNT}
                  currency={LOCKED_TOKEN_SYMBOL}
                  dollarEquivalent={LOCKED_TOKEN_DOLLAR_EQUIVALENT}
                />
              </ListItemCardCell>

              <ListItemCardCell
                cellName={APR}
                tooltip={APR_TOOLTIP}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
              >
                {APR_AMOUNT}
              </ListItemCardCell>

              <ListItemCardCell
                cellName={APY}
                tooltip={APY_TOOLTIP}
                cellNameClassName={styles.CardCellHeader}
                cardCellClassName={styles.cardCell}
              >
                {APY_AMOUNT}
              </ListItemCardCell>
            </div>

            {accountPkh && (
              <div className={styles.userData}>
                <ListItemCardCell
                  cellName={MY_BALANCE}
                  tooltip={MY_BALANCE_TOOLTIP}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                >
                  <StateCurrencyAmount
                    balanceRule
                    amount={MY_BALANCE_AMOUNT}
                    currency={LOCKED_TOKEN_SYMBOL}
                    dollarEquivalent={MY_BALANCE_DOLLAR_EQUIVALENT}
                  />
                </ListItemCardCell>

                <ListItemCardCell
                  cellName={MY_DEPOSIT}
                  tooltip={MY_DEPOSIT_TOOLTIP}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                >
                  <StateCurrencyAmount
                    balanceRule
                    amount={MY_DEPOSIT_AMOUNT}
                    currency={LOCKED_TOKEN_SYMBOL}
                    dollarEquivalent={MY_DEPOSIT_DOLLAR_EQUIVALENT}
                  />
                </ListItemCardCell>

                <ListItemCardCell
                  cellName={MY_EARNED}
                  tooltip={MY_EARNED_TOOLTIP}
                  cellNameClassName={styles.CardCellHeader}
                  cardCellClassName={styles.cardCell}
                >
                  <StateCurrencyAmount
                    balanceRule
                    amount={MY_EARNED_AMOUNT}
                    currency={MY_EARNED_TOKEN_SYMBOL}
                    dollarEquivalent={MY_EARNED_DOLLAR_EQUIVALENT}
                  />
                </ListItemCardCell>
              </div>
            )}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.links}>
            <Button href={TOKEN_CONTRACT_URL} external theme={LINKS_THEME} title={TOKEN_CONTRACT}>
              {TOKEN_CONTRACT}
            </Button>

            <Button href={STAKE_CONTRACT_URL} external theme={LINKS_THEME} title={STAKE_CONTRACT}>
              {STAKE_CONTRACT}
            </Button>
          </div>

          <Button className={styles.button} href={SELECT_LINK}>
            {SELECT}
          </Button>
        </div>
      </div>
    </Card>
  );
};
