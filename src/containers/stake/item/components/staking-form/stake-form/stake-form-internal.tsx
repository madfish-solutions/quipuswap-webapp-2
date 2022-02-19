import { FC } from 'react';

import { Button, ConnectWalletButton } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { FormApi } from 'final-form';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';
import { Field } from 'react-final-form';

import { LP_TOKEN_DECIMALS, TEZOS_TOKEN } from '@app.config';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingFormStore } from '@hooks/stores/use-staking-form-store';
import s from '@styles/CommonContainer.module.sass';
import { parseDecimals } from '@utils/helpers';
import { toSixDecimals } from '@utils/helpers/to-six-decimals';
import { Undefined } from '@utils/types';
import { composeValidators, validateBalance, validateMinMax } from '@utils/validators';

interface StakeFormValues {
  balance: number;
  selectedBaker: string;
  currentBacker?: string;
}

interface Props {
  values: StakeFormValues;
  form: FormApi<StakeFormValues, Partial<StakeFormValues>>;
}

export const StakeFormInternal: FC<Props> = observer(({ form, values }) => {
  const { t } = useTranslation(['common', 'stake']);
  const authStore = useAuthStore();
  const { accountPkh } = authStore;
  const stakingFormStore = useStakingFormStore();
  const { stakeItem, isLoading, isLpToken, tokenPair } = stakingFormStore;
  if (!stakeItem) {
    return null;
  }

  const errorInterceptor = (value: Undefined<string>): Undefined<string> => {
    // eslint-disable-next-line no-console
    console.log('errorInterceptor', value);
    // if (isFormError !== Boolean(value)) {
    //   setIsFormError(Boolean(value));
    // }

    return value;
  };

  const availableBalance = '0'; // TODO: Get UserBalance for specific token

  const validateBalance_ =
    accountPkh && availableBalance ? validateBalance(new BigNumber(availableBalance)) : () => undefined;

  const validate = composeValidators(validateMinMax(0, Infinity), validateBalance_);

  const disabled = false;

  const getButton = () => {
    if (!accountPkh) {
      return <ConnectWalletButton className={cx(s.connect, s['mt-24'])} />;
    }

    return (
      <Button type="submit" className={s.button} disabled={disabled}>
        Stake
      </Button>
    );
  };

  return (
    <>
      <Field name="balance" validate={validate} parse={v => parseDecimals(v, 0, Infinity, LP_TOKEN_DECIMALS)}>
        {({ input, meta }) =>
          isLpToken ? (
            <PositionSelect
              {...input}
              notSelectable1={TEZOS_TOKEN}
              tokenPair={tokenPair}
              tokenPairFrozen={true}
              balance={availableBalance}
              handleBalance={value => {
                form.mutators.setValue('balance', toSixDecimals(value));
              }}
              tokensUpdating={{
                isTokenChanging: isLoading,
                setIsTokenChanging: value => {
                  // eslint-disable-next-line no-console
                  console.log('setIsTokenChanging', value);
                }
              }}
              shouldShowBalanceButtons={Boolean(authStore.accountPkh)}
              balanceLabel={t('stake|Available balance')}
              notFrozen
              label="Amount"
              className={s.input}
              error={errorInterceptor((meta.dirty && meta.error) || meta.submitError)}
            />
          ) : (
            <TokenSelect
              balance={availableBalance ?? null}
              label="Amount"
              handleBalance={value => {
                // eslint-disable-next-line no-console
                console.log('handleBalance', value);
              }}
              token={stakeItem.tokenA}
              blackListedTokens={[]}
            />
          )
        }
      </Field>

      <div className={s.buttons}>{getButton()}</div>
    </>
  );
});
