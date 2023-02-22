import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { withApproveApi } from '@blockchain';
import { THREE_ROUTE_APP_ID } from '@config/config';
import { FIRST_INDEX, ZERO_AMOUNT } from '@config/constants';
import { THREE_ROUTE_API_AUTH_TOKEN, THREE_ROUTE_API_URL, THREE_ROUTE_CONTRACT_ADDRESS } from '@config/environment';
import { getContract } from '@shared/dapp';
import { decreaseByPercentage, isTezosToken, toAtomic } from '@shared/helpers';
import { Token } from '@shared/types';

import { threeRouteTokenMatches } from '../helpers';
import { ThreeRouteDex, ThreeRouteSwapResponse, ThreeRouteToken } from '../types';

const NUMBER_DISCRIMINATION_PREFIX = 'uniqueprefix';

const jsonWithBigNumberParser = (origJSON: string): ReturnType<typeof JSON['parse']> => {
  const stringedJSON = origJSON.replace(/:\s*([-+Ee0-9.]+)/g, `: "${NUMBER_DISCRIMINATION_PREFIX}$1"`);

  return JSON.parse(stringedJSON, (_, value) => {
    if (typeof value !== 'string' || !value.startsWith(NUMBER_DISCRIMINATION_PREFIX)) {
      return value;
    }

    value = value.slice('uniqueprefix'.length);

    return new BigNumber(value);
  });
};

const getThreeRouteResponse = async (path: string) => {
  const response = await fetch(`${THREE_ROUTE_API_URL}${path}`, {
    headers: { Authorization: `Basic ${THREE_ROUTE_API_AUTH_TOKEN}` }
  });
  const rawJSON = await response.text();

  return jsonWithBigNumberParser(rawJSON);
};

export const getThreeRouteSwap = async (
  inputTokenSymbol: string,
  outputTokenSymbol: string,
  realAmount: BigNumber
): Promise<ThreeRouteSwapResponse> =>
  await getThreeRouteResponse(`/swap/${inputTokenSymbol}/${outputTokenSymbol}/${realAmount.toFixed()}`);

export const getThreeRouteTokens = async (): Promise<ThreeRouteToken[]> => await getThreeRouteResponse('/tokens');

export const getThreeRouteDexes = async (): Promise<ThreeRouteDex[]> => await getThreeRouteResponse('/dexes');

export const doThreeRouteSwap = async (
  tezos: TezosToolkit,
  accountPkh: string,
  receiver: string,
  inputToken: Token,
  outputToken: Token,
  threeRouteTokens: ThreeRouteToken[],
  swap: ThreeRouteSwapResponse,
  slippageTolerance: BigNumber
) => {
  const threeRouteContract = await getContract(tezos, THREE_ROUTE_CONTRACT_ADDRESS!);
  const [threeRouteInputToken, threeRouteOutputToken] = [inputToken, outputToken].map(token =>
    threeRouteTokens.find(threeRouteToken => threeRouteTokenMatches(threeRouteToken, token))
  );

  const hops = swap.chains
    .map(chain =>
      chain.hops.map(({ dex: dex_id, forward }, index) => ({
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        code: (index === FIRST_INDEX ? 1 : 0) + (forward ? 2 : 0),
        dex_id,
        amount_opt: index === FIRST_INDEX ? toAtomic(chain.input, inputToken) : null
      }))
    )
    .flat();
  const tezAmount = isTezosToken(inputToken) ? swap.input.toNumber() : ZERO_AMOUNT;

  return await withApproveApi(
    tezos,
    THREE_ROUTE_CONTRACT_ADDRESS!,
    inputToken,
    accountPkh,
    toAtomic(swap.input, inputToken),
    [
      threeRouteContract.methods
        .execute(
          threeRouteInputToken!.id,
          threeRouteOutputToken!.id,
          toAtomic(decreaseByPercentage(swap.output, slippageTolerance), outputToken).integerValue(
            BigNumber.ROUND_DOWN
          ),
          receiver,
          hops,
          THREE_ROUTE_APP_ID
        )
        .toTransferParams({ amount: tezAmount, mutez: false })
    ]
  );
};
