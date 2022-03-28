import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { object as objectSchema } from 'yup';

import {
  TEZOS_TOKEN_DECIMALS,
  TEZOS_TOKEN_SLUG,
  TEZOS_TOKEN_SYMBOL,
  TEZ_TRANSFER_AMOUNT_CAP
} from '../../../app.config';
import { useGlobalModalsState } from '../../hooks/use-global-modals-state';
import { useToasts } from '../../hooks/use-toasts';
import { useBalances } from '../../../providers/balances-provider';
import { useTezos } from '../../../providers/use-dapp';
import { useConfirmOperation } from '../../dapp/confirm-operation';
import { prepareNumberAsString } from '../../helpers/prepare-number-as-string';
import { fromDecimals } from '../../../shared/helpers/from-decimals';
import { defined } from '../../../shared/helpers/type-checks';
import { makeNumberAsStringTestFn, numberAsStringSchema } from '../../helpers/number-as-string';

import { DonationFormValues } from './types';

const TOKEN_ATOM_RAW_AMOUNT = 1;
const MIN_INPUT_AMOUNT = fromDecimals(new BigNumber(TOKEN_ATOM_RAW_AMOUNT), TEZOS_TOKEN_DECIMALS);
const EMPTY_BALANCE_AMOUNT = 0;
const REQUIRE_FIELD_MESSAGE = 'common|This field is required';

export const useDonationFormik = () => {
  const { t } = useTranslation(['common']);
  const { showErrorToast } = useToasts();
  const { closeDonationModal } = useGlobalModalsState();

  const { balances } = useBalances();
  const tezos = useTezos();
  const confirmOperation = useConfirmOperation();
  const inputTokenBalance = balances[TEZOS_TOKEN_SLUG];
  const max = inputTokenBalance?.minus(TEZ_TRANSFER_AMOUNT_CAP);
  const emptyBalanceAmountValidationSchema = numberAsStringSchema({
    value: EMPTY_BALANCE_AMOUNT,
    isInclusive: false
  })
    .test(
      'balance',
      () => t('common|Insufficient funds'),
      makeNumberAsStringTestFn(value => value.eq(EMPTY_BALANCE_AMOUNT))
    )
    .required(t(REQUIRE_FIELD_MESSAGE));
  const someBalanceAmountValidationSchema = numberAsStringSchema(
    {
      value: EMPTY_BALANCE_AMOUNT,
      isInclusive: false
    },
    max && { value: max, isInclusive: true },
    max && t('common|valueOutOfRangeError', { min: MIN_INPUT_AMOUNT.toFixed(), max: max.toFixed() })
  )
    .test(
      'input-decimals-amount',
      () =>
        t('common|tokenDecimalsOverflowError', {
          tokenSymbol: TEZOS_TOKEN_SYMBOL,
          decimalPlaces: TEZOS_TOKEN_DECIMALS
        }),
      makeNumberAsStringTestFn(value => value.decimalPlaces() <= TEZOS_TOKEN_DECIMALS)
    )
    .required(t(REQUIRE_FIELD_MESSAGE));

  const validationSchema = objectSchema().shape({
    amount: inputTokenBalance?.eq(EMPTY_BALANCE_AMOUNT)
      ? emptyBalanceAmountValidationSchema
      : someBalanceAmountValidationSchema
  });

  const handleSubmit = async (formValues: Partial<DonationFormValues>) => {
    try {
      const amount = Number(prepareNumberAsString(defined(formValues.amount)));
      const operation = await defined(tezos).wallet.transfer({ to: DONATION_ADDRESS, amount: amount }).send();

      closeDonationModal();

      await confirmOperation(operation.opHash, {
        message: t('common|donationSuccess')
      });
    } catch (e) {
      showErrorToast(e as Error);
    }
  };

  return useFormik({
    validationSchema,
    initialValues: { amount: '' },
    initialErrors: {},
    onSubmit: handleSubmit,
    validateOnChange: true
  });
};
