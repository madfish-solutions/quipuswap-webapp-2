import React from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import { Field } from 'react-final-form';

import { TokenDataMap, WhitelistedToken } from '@utils/types';
import { useAccountPkh } from '@utils/dapp';
import { composeValidators, validateBalance, validateMinMax } from '@utils/validators';
import { parseDecimals } from '@utils/helpers';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';

import s from '@styles/CommonContainer.module.sass';

interface SwapFormTokenSelectArgs {
  token1: WhitelistedToken;
  setToken1: (t: WhitelistedToken) => void;
  tokensData: TokenDataMap;
  handleTokenChange: (token: WhitelistedToken, tokenNumber: 'first' | 'second') => void;
  setDex: (arr: any[]) => void;
  form: any;
  blackListedTokens: WhitelistedToken[];
  setLastChange: (last: string) => void;
  label: string;
  valueField: 'balance1' | 'balance2';
  tokenNumber: 'first' | 'second';
  id: string;
  className?: string;
}

export const SwapFormTokenSelect: React.FC<SwapFormTokenSelectArgs> = ({
  token1,
  setToken1,
  tokensData,
  handleTokenChange,
  setDex,
  form,
  blackListedTokens,
  setLastChange,
  label,
  valueField,
  tokenNumber,
  id,
  className,
}) => {
  const accountPkh = useAccountPkh();
  return (
    <Field
      validate={composeValidators(
        validateMinMax(0, Infinity),
        accountPkh
          ? validateBalance(new BigNumber(tokensData[tokenNumber].balance))
          : () => undefined,
      )}
      parse={(v) => token1?.metadata && parseDecimals(v, 0, Infinity, token1.metadata.decimals)}
      name={valueField}
    >
      {({ input, meta }) => (
        <TokenSelect
          {...input}
          blackListedTokens={blackListedTokens}
          onFocus={() => setLastChange(valueField)}
          token={token1}
          setToken={setToken1}
          handleBalance={(value) => {
            if (token1) {
              form.mutators.setValue(
                valueField,
                new BigNumber(parseDecimals(value, 0, Infinity, token1.metadata.decimals)),
              );
            }
          }}
          noBalanceButtons={!accountPkh}
          handleChange={(token) => {
            handleTokenChange(token, tokenNumber);
            setDex([]);
          }}
          balance={tokensData[tokenNumber].balance}
          exchangeRate={tokensData[tokenNumber].exchangeRate}
          id={id}
          label={label}
          className={cx(s.input, className)}
          error={meta.error || meta.submitError}
        />
      )}
    </Field>
  );
};
