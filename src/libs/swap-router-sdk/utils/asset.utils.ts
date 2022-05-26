import { TezosToolkit } from '@taquito/taquito';

import { TokenStandardEnum } from '../enum/token-standard.enum';
import { Fa12AssetContractAbstraction } from '../interface/fa1-2-asset.contract-abstraction.interface';
import { Fa2AssetContractAbstraction } from '../interface/fa2-asset.contract-abstraction.interface';
import { getContract } from './contract.utils';
import { detectTokenStandard } from './token-standard.utils';

export const loadAssetContract = async (assetSlug: string, tezos: TezosToolkit) => {
  const [assetAddress, assetId = '0'] = assetSlug.split('_');

  const contract = await getContract(assetAddress, tezos);
  const standard = await detectTokenStandard(tezos, contract);

  if (standard === TokenStandardEnum.FA1_2) {
    return {
      standard,
      contract: contract as Fa12AssetContractAbstraction
    };
  }

  if (standard === TokenStandardEnum.FA2) {
    return {
      standard,
      assetId,
      contract: contract as Fa2AssetContractAbstraction
    };
  }

  return undefined;
};
