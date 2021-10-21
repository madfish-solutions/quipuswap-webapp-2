import {useTranslation} from 'next-i18next';
import React, {useMemo, useCallback} from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import {Field} from 'react-final-form';
import {FoundDex} from '@quipuswap/sdk';

import {useAccountPkh, useNetwork, useTezos} from '@utils/dapp';
import {
  LiquidityFormValues,
  QSMainNet,
  TokenDataMap,
  WhitelistedToken,
  WhitelistedTokenPair,
} from '@utils/types';

import {
  composeValidators,
  validateBalance,
  validateMinMax,
  validateRebalance,
} from '@utils/validators';
import {parseDecimals} from '@utils/helpers';
import {TokenSelect} from '@components/ui/ComplexInput/TokenSelect';
import {Plus} from '@components/svg/Plus';

import s from '../Liquidity.module.sass';

import {hanldeTokenPairSelect} from '../liquidityHelpers';

interface LiquidityFormAddProps {
  tab: 'remove' | 'add';
  values: LiquidityFormValues;
  tokenPair: WhitelistedTokenPair;
  setDex: (dex?: FoundDex) => void;
  setTokens: (tokens: WhitelistedToken[]) => void;
  setTokenPair: (pair: WhitelistedTokenPair) => void;
  handleTokenChange: (token: WhitelistedToken, tokenNumber: 'first' | 'second') => void;
  setLastChange: (change: 'balance1' | 'balance2') => void;
  form: any;
  tokensData: TokenDataMap;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  localSwap: BigNumber;
  localInvest: BigNumber;
}

export const LiquidityFormAdd: React.FC<LiquidityFormAddProps> = ({
  tab,
  values,
  setDex,
  handleTokenChange,
  setLastChange,
  setTokens,
  setTokenPair,
  form,
  token1,
  token2,
  tokensData,
  localSwap,
  localInvest,
}) => {
  const {t} = useTranslation(['liquidity']);
  const accountPkh = useAccountPkh();
  const tezos = useTezos();
  const networkId = useNetwork().id as QSMainNet;
  const blackListedTokens = useMemo(
    () => [...(token1 ? [token1] : []), ...(token2 ? [token2] : [])],
    [token1, token2],
  );
  const balanceValidator = useMemo(() => {
    if (values.rebalanceSwitcher) {
      return composeValidators(
        validateRebalance(localSwap.toString(), localInvest.toString()),
        () =>
          new BigNumber(values.balance1).eq(0) && new BigNumber(values.balance2).eq(0)
            ? t('liquidity|Value has to be a greater than zero')
            : undefined,
      );
    }
    return validateMinMax(0, Infinity);
  }, [values.rebalanceSwitcher, localSwap, localInvest, t, values.balance1, values.balance2]);

  const setToken2 = useCallback(
    (token: WhitelistedToken) => {
      setTokens([token1 || undefined, token]);
      if (token1) {
        hanldeTokenPairSelect(
          {token1, token2: token} as WhitelistedTokenPair,
          setTokenPair,
          handleTokenChange,
        );
      }
      // eslint-disable-next-line
    },
    [tezos, accountPkh, networkId, token1],
  );

  if (tab !== 'add') {
    return null;
  }

  return (
    <>
      <Field
        name="balance1"
        validate={composeValidators(
          balanceValidator,
          accountPkh ? validateBalance(new BigNumber(tokensData.first.balance)) : () => undefined,
        )}
        parse={(v) => token1?.metadata && parseDecimals(v, 0, Infinity, token1.metadata.decimals)}
      >
        {({input, meta}) => (
          <TokenSelect
            {...input}
            blackListedTokens={blackListedTokens}
            onFocus={() => setLastChange('balance1')}
            token={token1}
            setToken={() => {}}
            notSelectable
            handleBalance={(value) => {
              setLastChange('balance1');
              form.mutators.setValue(
                'balance1',
                +parseDecimals(value, 0, Infinity, token1 ? token1.metadata.decimals : undefined),
              );
            }}
            noBalanceButtons={!accountPkh}
            handleChange={(token) => {
              setDex(undefined);
              setLastChange('balance1');
              handleTokenChange(token, 'first');
            }}
            balance={tokensData.first.balance}
            exchangeRate={tokensData.first.exchangeRate}
            id="liquidity-token-1"
            label={t('liquidity|Input')}
            className={s.input}
            error={(meta.touched && meta.error) || meta.submitError}
          />
        )}
      </Field>
      <Plus className={s.iconButton} />
      <Field
        name="balance2"
        validate={composeValidators(
          balanceValidator,
          accountPkh ? validateBalance(new BigNumber(tokensData.second.balance)) : () => undefined,
        )}
        parse={(v) => token2?.metadata && parseDecimals(v, 0, Infinity, token2.metadata.decimals)}
      >
        {({input, meta}) => (
          <TokenSelect
            {...input}
            blackListedTokens={blackListedTokens}
            onFocus={() => setLastChange('balance2')}
            token={token2}
            setToken={setToken2}
            handleBalance={(value) => {
              setLastChange('balance2');
              form.mutators.setValue(
                'balance2',
                +parseDecimals(value, 0, Infinity, token2 ? token2.metadata.decimals : undefined),
              );
            }}
            noBalanceButtons={!accountPkh}
            handleChange={(token) => {
              setDex(undefined);
              handleTokenChange(token, 'second');
            }}
            balance={tokensData.second.balance}
            exchangeRate={tokensData.second.exchangeRate}
            id="liquidity-token-2"
            label={t('liquidity|Input')}
            className={cx(s.input, s.mb24)}
            error={(meta.touched && meta.error) || meta.submitError}
          />
        )}
      </Field>
    </>
  );
};
