import { IS_NETWORK_HANGZHOUNET, IS_NETWORK_ITHACANET, IS_NETWORK_MAINNET } from '@config/enviroment';
import { HANGZHOUNET_DEFAULT_TOKEN, ITHACANET_DEFAULT_TOKEN, MAINNET_DEFAULT_TOKEN } from '@config/tokens';
import { Token } from '@shared/types';

export const isRewardTokenQUIPU = (rewardToken: Token): boolean => {
  if (IS_NETWORK_MAINNET) {
    const areAddressesEqual = rewardToken.contractAddress === MAINNET_DEFAULT_TOKEN.contractAddress;
    const areIdsEqual = rewardToken.fa2TokenId === MAINNET_DEFAULT_TOKEN.fa2TokenId;

    return areAddressesEqual && areIdsEqual;
  }

  if (IS_NETWORK_HANGZHOUNET) {
    const areAddressesEqual = rewardToken.contractAddress === HANGZHOUNET_DEFAULT_TOKEN.contractAddress;
    const areIdsEqual = rewardToken.fa2TokenId === HANGZHOUNET_DEFAULT_TOKEN.fa2TokenId;

    return areAddressesEqual && areIdsEqual;
  }

  if (IS_NETWORK_ITHACANET) {
    const areAddressesEqual = rewardToken.contractAddress === ITHACANET_DEFAULT_TOKEN.contractAddress;
    const areIdsEqual = rewardToken.fa2TokenId === ITHACANET_DEFAULT_TOKEN.fa2TokenId;

    return areAddressesEqual && areIdsEqual;
  }

  return false;
};
