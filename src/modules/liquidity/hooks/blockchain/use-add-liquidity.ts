import BigNumber from 'bignumber.js';

import { FISRT_INDEX, LP_TOKEN_DECIMALS } from '@config/constants';
import { LP_TOKEN } from '@modules/liquidity/pages/cpmm-item/components/forms/helpers/mock-lp-token';
import { useRootStore } from '@providers/root-store-provider';
import { useAccountPkh } from '@providers/use-dapp';
import {
  decreaseBySlippage,
  extractTokens,
  getTransactionDeadline,
  isExist,
  isNull,
  isTezosToken,
  sortTokens,
  toAtomic,
  toReal
} from '@shared/helpers';
import { useSettingsStore } from '@shared/hooks/use-settings-store';
import { tokensAndAmountsMapper } from '@shared/mapping';
import { amplitudeService } from '@shared/services';
import { Nullable } from '@shared/types';
import { useConfirmOperation, useToasts } from '@shared/utils';
import { useTranslation } from '@translation';

import { addDexTwoLiquidityApi } from '../../api';
import { makeLiquidityOperationLogData, getValueWithFee } from '../../helpers';
import { useLiquidityItemStore } from '../store';

export const useAddLiquidity = () => {
  const { tezos } = useRootStore();
  const { showErrorToast } = useToasts();
  const confirmOperation = useConfirmOperation();
  const { t } = useTranslation();
  const {
    settings: { transactionDeadline, liquiditySlippage }
  } = useSettingsStore();
  const accountPkh = useAccountPkh();
  const { item } = useLiquidityItemStore();

  const addLiquidity = async (inputAmounts: Array<Nullable<BigNumber>>, candidate: string) => {
    if (isNull(tezos) || !isExist(item) || isNull(accountPkh) || !inputAmounts.every(isExist)) {
      return;
    }
    const itemId = item.id;
    const tokens = extractTokens(item.tokensInfo);

    const atomicInputAmounts = inputAmounts.map((amount: BigNumber, index: number) =>
      toAtomic(amount, tokens[index]).integerValue(BigNumber.ROUND_DOWN)
    );

    const tokensAndAmounts = tokensAndAmountsMapper(tokens, atomicInputAmounts).sort((a, b) =>
      sortTokens(a.token, b.token)
    );

    if (isTezosToken(tokensAndAmounts[FISRT_INDEX].token)) {
      tokensAndAmounts.reverse();
    }

    const shares = atomicInputAmounts[FISRT_INDEX].multipliedBy(item.totalSupply)
      .dividedBy(item.tokensInfo[FISRT_INDEX].atomicTokenTvl)
      .decimalPlaces(LP_TOKEN.metadata.decimals);

    const sharesWithFee = getValueWithFee(shares, item.feesRate).integerValue(BigNumber.ROUND_DOWN);

    const sharesWithSlippage = decreaseBySlippage(sharesWithFee, liquiditySlippage).integerValue(BigNumber.ROUND_DOWN);

    const deadline = await getTransactionDeadline(tezos, transactionDeadline);

    const logData = makeLiquidityOperationLogData(toReal(sharesWithSlippage, LP_TOKEN_DECIMALS), liquiditySlippage, item);

    try {
      amplitudeService.logEvent('DEX_TWO__LIQUIDITY_ADD', logData);
      const operation = await addDexTwoLiquidityApi(
        tezos,
        sharesWithSlippage,
        tokensAndAmounts,
        deadline,
        accountPkh,
        candidate,
        itemId
      );
      await confirmOperation(operation.opHash, { message: t('liquidity|successfullyAdded') });
      amplitudeService.logEvent('DEX_TWO_LIQUIDITY_ADD_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);
      amplitudeService.logEvent('DEX_TWO__LIQUIDITY_ADD_FAILED', { ...logData, error });
    }
  };

  return { addLiquidity };
};
