import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { networksStableTokens, TEZOS_TOKEN } from '@utils/defaults';
import { getTokenIdFromSlug, getTokenSlug } from '@utils/helpers';
import { BaseLayout } from '@layouts/BaseLayout';
import { SwapSend } from '@containers/SwapSend';
import { isValidTokenSlug } from '@utils/validators';
import { QSMainNet } from '@utils/types';

import s from '@styles/SwapLiquidity.module.sass';
import { fallbackToolkits, getContract, isTokenFa2 } from '@utils/dapp';

type SwapSendPageProps = {
  from: string;
  to: string;
};

const SwapSendPage: React.FC<SwapSendPageProps> = ({ from, to }) => {
  const { t } = useTranslation(['common', 'swap']);

  return (
    <BaseLayout
      title={t('swap|Swap page')}
      description={t('swap|Swap page description. Couple sentences...')}
      className={s.wrapper}
    >
      <SwapSend initialFrom={from} initialTo={to} />
    </BaseLayout>
  );
};

const defaultFromToken = getTokenSlug(TEZOS_TOKEN);

const getTokenNetworkName = async (address: string) => (await Promise.all(
  Object.entries(fallbackToolkits).map(async ([id, toolkit]) => {
    try {
      await getContract(toolkit, address);
      return id as QSMainNet;
      // eslint-disable-next-line no-empty
    } catch {
      return undefined;
    }
  }),
)).find((networkId) => networkId !== undefined);

export const getServerSideProps = async (props:any) => {
  const { locale, query } = props;
  const splitTokens: string[] = query['from-to'].split('-');
  const [fromNetwork, toNetwork] = await Promise.all(
    splitTokens.slice(0, 2).map(
      async (tokenSlug) => {
        if (!tokenSlug || (isValidTokenSlug(tokenSlug) !== true)) {
          return undefined;
        }

        if (tokenSlug === getTokenSlug(TEZOS_TOKEN)) {
          return 'any';
        }

        const {
          contractAddress: tokenAddress,
        } = getTokenIdFromSlug(tokenSlug);
        try {
          return await getTokenNetworkName(tokenAddress);
        } catch (e) {
          return 'any';
        }
      },
    ),
  );
  let network: QSMainNet | undefined;
  if (fromNetwork === toNetwork) {
    network = fromNetwork === 'any' ? 'mainnet' : fromNetwork;
  } else if (fromNetwork === 'any') {
    network = toNetwork as (QSMainNet | undefined);
  } else if (toNetwork === 'any') {
    network = fromNetwork as (QSMainNet | undefined);
  }
  const defaultToToken = getTokenSlug(networksStableTokens[network ?? 'mainnet']);
  let from = splitTokens[0];
  let to = splitTokens[1];
  if ((fromNetwork !== network) && (fromNetwork !== 'any')) {
    from = defaultFromToken;
  }
  if ((toNetwork !== network) && (toNetwork === 'any')) {
    to = defaultToToken;
  }
  network = network ?? 'mainnet';

  try {
    const {
      contractAddress: fromTokenAddress,
      fa2TokenId: fromTokenId,
    } = getTokenIdFromSlug(from);
    const { contractAddress: toTokenAddress, fa2TokenId: toTokenId } = getTokenIdFromSlug(to);

    const fromTokenIsFa2 = await isTokenFa2(
      fromTokenAddress,
      fallbackToolkits[network],
    );
    const toTokenIsFa2 = await isTokenFa2(
      toTokenAddress,
      fallbackToolkits[network],
    );
    if (fromTokenIsFa2 && (fromTokenId === undefined)) {
      from = `${fromTokenAddress}_0`;
    }
    if (!fromTokenIsFa2 && (fromTokenId !== undefined)) {
      from = fromTokenAddress;
    }
    if (toTokenIsFa2 && (toTokenId === undefined)) {
      to = `${toTokenAddress}_0`;
    }
    if (!toTokenIsFa2 && (toTokenId !== undefined)) {
      to = toTokenAddress;
    }
  } catch (e) {
    console.error(e);
  }

  if (from === to) {
    to = from === defaultFromToken ? defaultToToken : defaultFromToken;
  }

  if ((from !== splitTokens[0]) || (to !== splitTokens[1])) {
    return {
      redirect: {
        destination: `/swap/${from}-${to}`,
        permanent: true,
      },
    };
  }

  return ({
    props: {
      ...await serverSideTranslations(locale, ['common', 'swap']),
      from,
      to,
    },
  });
};

export default SwapSendPage;
