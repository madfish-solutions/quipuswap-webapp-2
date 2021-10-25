import {useTranslation} from 'next-i18next';
import React, {useMemo} from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import {Field} from 'react-final-form';
import {FoundDex} from '@quipuswap/sdk';

import {useAccountPkh} from '@utils/dapp';
import {TokenDataMap, WhitelistedToken, WhitelistedTokenPair} from '@utils/types';
import {composeValidators, validateBalance, validateMinMax} from '@utils/validators';
import {fromDecimals, parseTezDecimals} from '@utils/helpers';
import {TEZOS_TOKEN} from '@utils/defaults';
import {PositionSelect} from '@components/ui/ComplexInput/PositionSelect';
import {ComplexInput} from '@components/ui/ComplexInput';
import {ArrowDown} from '@components/svg/ArrowDown';
import {Plus} from '@components/svg/Plus';

import s from '../Liquidity.module.sass';

import {hanldeTokenPairSelect} from '../liquidityHelpers';

interface LiquidityFormRemoveProps {
  tab: 'remove' | 'add';
  tokenPair: WhitelistedTokenPair;
  setDex: (dex?: FoundDex) => void;
  setTokens: (tokens: WhitelistedToken[]) => void;
  handleTokenChange: (arg: any) => void;
  setTokenPair: (pair: WhitelistedTokenPair) => void;
  form: any;
  poolShare: any;
  tokensData: TokenDataMap;
}

export const LiquidityFormRemove: React.FC<LiquidityFormRemoveProps> = ({
  tab,
  tokenPair,
  setDex,
  setTokens,
  handleTokenChange,
  setTokenPair,
  form,
  poolShare,
  tokensData,
}) => {
  const {t} = useTranslation(['liquidity']);
  const accountPkh = useAccountPkh();
  const frozenBalance = useMemo(
    () => fromDecimals(new BigNumber(poolShare?.frozen ?? '0'), 6).toString(),
    [poolShare],
  );
  const liquiditBalance = useMemo(
    () => fromDecimals(new BigNumber(poolShare?.unfrozen ?? '0'), 6).toString(),
    [poolShare],
  );
  const totalBalance = useMemo(
    () =>
      fromDecimals(new BigNumber(poolShare?.unfrozen ?? '0'), 6)
        .plus(fromDecimals(new BigNumber(poolShare?.frozen ?? '0'), 6))
        .toString(),
    [poolShare],
  );

  if (tab !== 'remove') {
    return null;
  }

  return (
    <>
      <Field
        name="balance3"
        validate={composeValidators(
          validateMinMax(0, Infinity),
          validateBalance(new BigNumber(totalBalance)),
        )}
        parse={(v) => parseTezDecimals(v)}
      >
        {({input, meta}) => (
          <>
            <PositionSelect
              {...input}
              autoComplete="off"
              notSelectable1={TEZOS_TOKEN}
              tokenPair={tokenPair}
              setTokenPair={(pair) => {
                setDex(undefined);
                setTokens([pair.token1, pair.token2]);
                handleTokenChange({token: pair.token1, tokenNumber: 'first'});
                handleTokenChange({token: pair.token2, tokenNumber: 'second'});
                hanldeTokenPairSelect(pair, setTokenPair, handleTokenChange);
              }}
              handleBalance={(value) => {
                form.mutators.setValue('balance3', +value);
              }}
              noBalanceButtons={!accountPkh}
              balance={liquiditBalance}
              frozenBalance={frozenBalance}
              totalBalance={totalBalance}
              balanceLabel={t('common|Liquid Balance')}
              id="liquidity-remove-input"
              label={t('liquidity|Select LP')}
              className={s.input}
              error={(meta.touched && meta.error) || meta.submitError}
            />
            <ArrowDown className={s.iconButton} />
          </>
        )}
      </Field>
      <Field name="balanceA" validate={validateMinMax(0, Infinity)}>
        {({input, meta}) => (
          <ComplexInput
            {...input}
            token1={tokenPair.token1}
            handleBalance={() => {}}
            balance={tokensData.first.balance}
            exchangeRate={tokensData.first.exchangeRate}
            id="liquidity-token-A"
            label={t('liquidity|Output')}
            className={cx(s.input, s.mb24)}
            readOnly
            error={(meta.touched && meta.error) || meta.submitError}
          />
        )}
      </Field>

      <Plus className={s.iconButton} />
      <Field name="balanceB" validate={validateMinMax(0, Infinity)}>
        {({input, meta}) => (
          <ComplexInput
            {...input}
            token1={tokenPair.token2}
            handleBalance={() => {}}
            balance={tokensData.second.balance}
            exchangeRate={tokensData.second.exchangeRate}
            id="liquidity-token-B"
            label={t('liquidity|Output')}
            className={cx(s.input, s.mb24)}
            readOnly
            error={(meta.touched && meta.error) || meta.submitError}
          />
        )}
      </Field>
    </>
  );
};
