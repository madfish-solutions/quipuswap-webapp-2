import React from 'react';
import BigNumber from 'bignumber.js';
import { Field } from 'react-final-form';
import { useTranslation } from 'next-i18next';

import { SwapFormValues, WhitelistedToken } from '@utils/types';
import { getWhitelistedTokenSymbol, parseDecimals, slippageToBignum } from '@utils/helpers';
import { Slippage } from '@components/common/Slippage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
// import { Transactions } from '@components/svg/Transactions';

import s from '@styles/CommonContainer.module.sass';

type SwapFormSlippageProps = {
  values: SwapFormValues;
  token2: WhitelistedToken;
};

export const SwapFormSlippage: React.FC<SwapFormSlippageProps> = ({ values, token2 }) => {
  const { t } = useTranslation(['swap']);

  return (
    <Field initialValue="0.5 %" name="slippage">
      {({ input }) => {
        const slipPerc = slippageToBignum(values.slippage).times(
          new BigNumber(values.balance2 ?? 0),
        );
        const minimumReceived = parseDecimals(
          new BigNumber(values.balance2 ?? 0).minus(slipPerc).toFixed(),
          0,
          Infinity,
          token2.metadata.decimals,
        );
        return (
          <>
            <Slippage handleChange={(value) => input.onChange(value)} />
            <div className={s.receive}>
              <span className={s.receiveLabel}>{t('swap|Minimum received')}</span>
              <CurrencyAmount
                amount={minimumReceived}
                currency={token2 ? getWhitelistedTokenSymbol(token2) : ''}
              />
            </div>
          </>
        );
      }}
    </Field>
  );
};
