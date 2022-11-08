import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useDollarEquivalent } from '@providers/use-dollar-equivalent';
import { StateCurrencyAmount, TokensLogos } from '@shared/components';
import { getTokenName, getTokenSymbol } from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';
import { ManagedToken } from '@shared/types';

import styles from './tokens-list-item.module.scss';

interface Props {
  token: ManagedToken;
}

const TOKEN_NAME_MAX_LENGTH = 100;

export const TokensListItem: FC<Props> = observer(({ token }) => {
  const tokenBalance = useTokenBalance(token);
  const dollarEquivalent = useDollarEquivalent(token, tokenBalance);

  return (
    <div className={styles.item}>
      <TokensLogos width={40} tokens={token} />
      <div className={styles.tokenDescription}>
        <h6 className={styles.tokenSymbol}>{getTokenSymbol(token, TOKEN_NAME_MAX_LENGTH)}</h6>
        <div className={styles.tokenName}>{getTokenName(token, TOKEN_NAME_MAX_LENGTH)}</div>
      </div>
      <div className={styles.balance}>
        <StateCurrencyAmount amount={tokenBalance} dollarEquivalent={dollarEquivalent} />
      </div>
    </div>
  );
});
