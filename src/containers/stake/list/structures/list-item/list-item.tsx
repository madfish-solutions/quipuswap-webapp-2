import { Card, CardCell } from '@quipuswap/ui-kit';

import { TEZOS_TOKEN } from '@app.config';
import { Tooltip } from '@components/ui/components/tooltip';
import { Button } from '@components/ui/elements/button';
import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';

import { RewardTarget, TokensLogosAndSymbols } from '../../elements';
import { eStakeStatus, StakeStatus } from '../../elements/stake-status';
import styles from './list-item.module.scss';

const ICON_SIZE = 48;

const SELECT = 'Select';

const TOKEN_CONTRACT = 'Token contract';
const STAKE_CONTRACT = 'Farm Contract';
const LINKS_THEME = 'underlined';

const TVL = 'TVL';
const TVL_TOOLTIP = 'tvl tooltip';

const APR = 'APR';
const APR_TOOLTIP = 'apr tooltip';

const APY = 'TVL';
const APY_TOOLTIP = 'apy tooltip';

export const StakeListItem = () => {
  const TOKEN_CONTRACT_URL = '';
  const STAKE_CONTRACT_URL = '';
  const TOOLTIP_TEXT = 'This is text';
  const TVL_AMOUNT = 1000000;

  const TOKEN_A = TEZOS_TOKEN;
  const TOKEN_B = TEZOS_TOKEN;
  const REWARD_TOKEN = TEZOS_TOKEN;

  const LOCKED_TOKEN = TEZOS_TOKEN;
  const LOCKED_TOKEN_DOLLAR_EQUIVALENT = '400.00';

  const APR_AMOUNT = '888%';
  const APY_AMOUNT = '0.008%';

  return (
    <Card className={styles.card}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.itemLeftHeader}>
            <TokensLogosAndSymbols width={ICON_SIZE} tokenA={TOKEN_A} tokenB={TOKEN_B} />
            <StakeStatus status={eStakeStatus.ACTIVE} />
            <Tooltip className={styles.tooltip} content={TOOLTIP_TEXT} />
          </div>
          <div className={styles.rewardTarget}>
            <RewardTarget token={REWARD_TOKEN} />
          </div>
          <div className={styles.stats}>
            <CardCell
              header={
                <>
                  {TVL}
                  <Tooltip content={TVL_TOOLTIP} />
                </>
              }
              className={styles.cardCell}
            >
              <StateCurrencyAmount
                balanceRule
                amount={TVL_AMOUNT}
                currency={LOCKED_TOKEN.metadata.symbol}
                dollarEquivalent={LOCKED_TOKEN_DOLLAR_EQUIVALENT}
              />
            </CardCell>

            <CardCell
              header={
                <>
                  {APR}
                  <Tooltip content={APR_TOOLTIP} />
                </>
              }
              className={styles.cardCell}
            >
              {APR_AMOUNT}
            </CardCell>

            <CardCell
              header={
                <>
                  {APY}
                  <Tooltip content={APY_TOOLTIP} />
                </>
              }
              className={styles.cardCell}
            >
              {APY_AMOUNT}
            </CardCell>
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
          <Button className={styles.button}>{SELECT}</Button>
        </div>
      </div>
    </Card>
  );
};
