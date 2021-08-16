import { useRouter } from 'next/router';
import React, {
  useMemo, useState, useEffect,
} from 'react';
import BigNumber from 'bignumber.js';
import {
  swap, batchify,
} from '@quipuswap/sdk';
import { withTypes } from 'react-final-form';
import { useTranslation } from 'next-i18next';

import { useExchangeRates } from '@hooks/useExchangeRate';
import { WhitelistedToken } from '@utils/types';
import {
  useAccountPkh,
  useTezos,
  getUserBalance,
  useNetwork,
  useTokens,
  useSearchCustomTokens,
} from '@utils/dapp';
import {
  localSearchToken,
  slippageToNum,
} from '@utils/helpers';
import {
  FACTORIES, STABLE_TOKEN, TEZOS_TOKEN,
} from '@utils/defaults';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Tooltip } from '@components/ui/Tooltip';
import { CardCell } from '@components/ui/Card/CardCell';
import { StickyBlock } from '@components/common/StickyBlock';
import { Route } from '@components/common/Route';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';
import { SwapForm, SwapFormValues } from './SwapForm';

const TabsContent = [
  {
    id: 'swap',
    label: 'Swap',
  },
  {
    id: 'send',
    label: 'Send',
  },
];

type SwapSendProps = {
  className?: string
};

type TokenDataType = {
  token: {
    address: string,
    type: 'fa1.2' | 'fa2',
    id?: number | null
    decimals: number,
  },
  balance: string,
  exchangeRate?: string
};

type TokenDataMap = {
  first: TokenDataType,
  second: TokenDataType
};

const fallbackTokenToTokenData = (token:WhitelistedToken):TokenDataType => ({
  token: {
    address: token.contractAddress,
    type: token.type,
    id: token.fa2TokenId,
    decimals: token.metadata.decimals,
  },
  balance: '0',
});

const toNat = (amount: any, decimals: number) => new BigNumber(amount)
  .times(10 ** decimals)
  .integerValue(BigNumber.ROUND_DOWN);

const isTez = (tokensData:TokenDataType) => tokensData.token.address === 'tez';

type QSMainNet = 'mainnet' | 'florencenet';

export const SwapSend: React.FC<SwapSendProps> = ({
  className,
}) => {
  const tezos = useTezos();
  const { data: tokens } = useTokens();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
  const network = useNetwork();
  const searchCustomToken = useSearchCustomTokens();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [initialLoad, setInitialLoad] = useState<boolean>(false);

  const { t } = useTranslation(['common', 'swap']);
  const [tabsState, setTabsState] = useState(TabsContent[0].id);
  const router = useRouter();
  const { from, to } = router.query;

  const [tokensData, setTokensData] = useState<TokenDataMap>(
    {
      first: fallbackTokenToTokenData(TEZOS_TOKEN),
      second: fallbackTokenToTokenData(STABLE_TOKEN),
    },
  );

  const { Form } = withTypes<SwapFormValues>();
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([TEZOS_TOKEN, STABLE_TOKEN]);

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  const handleTokenChange = async (token: WhitelistedToken, tokenNumber: 'first' | 'second') => {
    if (!exchangeRates || !exchangeRates.find) return;
    let finalBalance = '0';
    if (tezos && accountPkh) {
      const balance = await getUserBalance(
        tezos,
        accountPkh,
        token.contractAddress,
        token.type,
        token.fa2TokenId,
      );
      if (balance) {
        finalBalance = balance.div(
          new BigNumber(10)
            .pow(
              new BigNumber(token.metadata.decimals),
            ),
        ).toString();
      }
    }

    const tokenExchangeRate = exchangeRates.find((el: {
      tokenAddress: string,
      tokenId?: number,
      exchangeRate: string
    }) => {
      const isTokenTez = token.contractAddress === TEZOS_TOKEN.contractAddress
      && el.tokenAddress === undefined;
      if (isTokenTez) return true;
      if (el.tokenAddress === token.contractAddress) {
        if (token.fa2TokenId && el.tokenId === token.fa2TokenId) return true;
        if (!token.fa2TokenId) return true;
      }
      return false;
    });

    setTokensData((prevState) => (
      {
        ...prevState,
        [tokenNumber]: {
          token: {
            address: token.contractAddress,
            type: token.type,
            id: token.fa2TokenId,
            decimals: token.metadata.decimals,
          },
          balance: finalBalance,
          exchangeRate: tokenExchangeRate?.exchangeRate ?? null,
        },
      }
    ));
  };

  const handleSwapTokens = () => {
    setTokens([token2, token1]);
    setTokensData({ first: tokensData.second, second: tokensData.first });
  };

  useEffect(() => {
    if (token1 && token2) {
      router.push(`/swap/${token1.contractAddress}/${token2.contractAddress}`, undefined, { shallow: true });
    } else if (token1) {
      router.push(`/swap/${token1.contractAddress}`, undefined, { shallow: true });
    }
  }, [token1, token2]);

  useEffect(() => {
    const asyncCall = async () => {
      setInitialLoad(true);
      const searchPart = async (typeStr:'from' | 'to', str:string | string[]):Promise<WhitelistedToken> => {
        const strStr = Array.isArray(str) ? str[0] : str;
        const inputValue = strStr.split('_')[0];
        const inputToken = strStr.split('_')[1] ?? '0';
        if (inputValue.toLowerCase() === 'tez') {
          return TEZOS_TOKEN;
        }
        const isTokens = tokens
          .filter(
            (token:any) => localSearchToken(
              token,
              network,
              inputValue,
              +inputToken,
            ),
          );
        if (isTokens.length === 0) {
          return await searchCustomToken(inputValue, +inputToken, true).then((x) => {
            if (x) {
              return x;
            }
            router.push('/swap', undefined, { shallow: true });
            return TEZOS_TOKEN;
          });
        }
        return isTokens[0];
      };
      let res:any[] = [];
      if (from) {
        if (to) {
          const resTo = await searchPart('to', to);
          res = [resTo];
          handleTokenChange(resTo, 'second');
        }
        const resFrom = await searchPart('from', from);
        res = [resFrom, ...res];
        setTokens(res);
        handleTokenChange(resFrom, 'first');
      }
    };
    if (tezos && !initialLoad) asyncCall();
  }, [tezos, initialLoad]);

  useEffect(() => {
    if (tezos && token1 && token2) {
      handleTokenChange(token1, 'first');
      handleTokenChange(token2, 'second');
    }
  }, [tezos, accountPkh, networkId]);

  useEffect(() => {
    setTokens([]);
  }, [networkId]);

  return (
    <StickyBlock className={className}>
      <Form
        onSubmit={(values: SwapFormValues) => {
          console.log(values, tezos);
          if (!tezos) return;
          const asyncFunc = async () => {
            console.log('call tez swap', tokensData);
            try {
              const fromAsset = isTez(tokensData.first) ? 'tez' : {
                contract: tokensData.first.token.address,
                id: tokensData.first.token.id ? tokensData.first.token.id : undefined,
              };
              const toAsset = isTez(tokensData.second) ? 'tez' : {
                contract: tokensData.second.token.address,
                id: tokensData.second.token.id ? tokensData.second.token.id : undefined,
              };
              const slippage = slippageToNum(values.slippage) / 100;
              const inputValue = isTez(tokensData.first)
                ? tezos!!.format('tz', 'mutez', values.balance1) as any
                : toNat(values.balance1, tokensData.first.token.decimals);
              const swapParams = await swap(
                tezos,
                FACTORIES[networkId],
                fromAsset,
                toAsset,
                inputValue,
                slippage,
                tabsState === 'send' ? values.recipient : undefined,
              );
              const op = await batchify(
                tezos.wallet.batch([]),
                swapParams,
              ).send();
              await op.confirmation();
            } catch (e) {
              console.error(e);
            }
          };
          asyncFunc();
        }}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({ handleSubmit, form }) => (
          <SwapForm
            handleSubmit={handleSubmit}
            form={form}
            debounce={1000}
            save={() => {}}
            setTabsState={setTabsState}
            tabsState={tabsState}
            token1={token1}
            token2={token2}
            setToken1={(token:WhitelistedToken) => setTokens([token, (token2 || undefined)])}
            setToken2={(token:WhitelistedToken) => setTokens([(token1 || undefined), token])}
            tokensData={tokensData}
            handleSwapTokens={handleSwapTokens}
            handleTokenChange={handleTokenChange}
            currentTab={currentTab}
          />
        )}
      />
      <Card
        header={{
          content: `${currentTab.label} Details`,
        }}
        contentClassName={s.content}
      >
        <CardCell
          header={(
            <>
              {t('common:Sell Price')}
              <Tooltip
                sizeT="small"
                content={t('common:The amount of token B you receive for 1 token A, according to the current exchange rate.')}
              />
            </>
        )}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount="1" currency="tez" />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount="100000.11" currency="QPSP" dollarEquivalent="400" />
          </div>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('common:Buy Price')}
              <Tooltip
                sizeT="small"
                content={t('common:The amount of token A you receive for 1 token B, according to the current exchange rate.')}
              />
            </>
        )}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount="1" currency="QPSP" />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount="1000000000.000011" currency="tez" dollarEquivalent="0.00004" />
          </div>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('common:Price impact')}
              <Tooltip
                sizeT="small"
                content={t('swap:The impact your transaction is expected to make on the exchange rate.')}
              />
            </>
        )}
          className={s.cell}
        >
          <CurrencyAmount amount="<0.01" currency="%" />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('common:Fee')}
              <Tooltip
                sizeT="small"
                content={t('swap:Expected fee for this transaction charged by the Tezos blockchain.')}
              />
            </>
        )}
          className={s.cell}
        >
          <CurrencyAmount amount="0.001" currency="XTZ" />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('common:Route')}
              <Tooltip
                sizeT="small"
                content={t("swap:When a direct swap is impossible (no liquidity pool for the pair exists yet) QuipuSwap's algorithm will conduct the swap in several transactions, picking the most beneficial chain of trades.")}
              />
            </>
        )}
          className={s.cell}
        >
          <Route
            routes={['qpsp', 'usd', 'xtz']}
          />
        </CardCell>
        <Button
          className={s.detailsButton}
          theme="inverse"
        >
          View Pair Analytics
          <ExternalLink className={s.linkIcon} />
        </Button>
      </Card>
    </StickyBlock>
  );
};
