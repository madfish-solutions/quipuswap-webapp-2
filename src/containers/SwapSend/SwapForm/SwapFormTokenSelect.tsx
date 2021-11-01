import React from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import { Field } from 'react-final-form';
import { FoundDex } from '@quipuswap/sdk';
import { FormApi } from 'final-form';

import { SwapFormValues, TokenDataMap, WhitelistedToken } from '@utils/types';
import { useAccountPkh } from '@utils/dapp';
import { composeValidators, validateBalance, validateMinMax } from '@utils/validators';
import { parseDecimals } from '@utils/helpers';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';

import s from '@styles/CommonContainer.module.sass';

interface SwapFormTokenSelectArgs {
  token: WhitelistedToken;
  setToken: (t: WhitelistedToken) => void;
  tokensData: TokenDataMap;
  handleTokenChange: (token: WhitelistedToken, tokenNumber: 'first' | 'second') => void;
  setDex: (dexes: FoundDex[]) => void;
  form: FormApi<SwapFormValues, Partial<SwapFormValues>>;
  blackListedTokens: WhitelistedToken[];
  setLastChange: (last: string) => void;
  label: string;
  valueField: 'balance1' | 'balance2';
  tokenNumber: 'first' | 'second';
  id: string;
  className?: string;
}

export const SwapFormTokenSelect: React.FC<SwapFormTokenSelectArgs> = ({
  token,
  setToken,
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
      parse={(v) => token?.metadata && parseDecimals(v, 0, Infinity, token.metadata.decimals)}
      name={valueField}
    >
      {({ input, meta }) => (
        <TokenSelect
          {...input}
          blackListedTokens={blackListedTokens}
          onFocus={() => setLastChange(valueField)}
          token={token}
          setToken={setToken}
          handleBalance={(value) => {
            if (token) {
              form.mutators.setValue(
                valueField,
                new BigNumber(parseDecimals(value, 0, Infinity, token.metadata.decimals)),
              );
            }
          }}
          noBalanceButtons={!accountPkh}
          handleChange={(selectedToken) => {
            handleTokenChange(selectedToken, tokenNumber);
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
