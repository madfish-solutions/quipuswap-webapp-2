import React, {
  useMemo, useState, useEffect, useRef,
  useCallback,
} from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';
import {
  estimateSwap, findDex, swap, batchify, TransferParams,
} from '@quipuswap/sdk';
import { withTypes, Field, FormSpy } from 'react-final-form';
import { useTranslation } from 'next-i18next';

import { useExchangeRates } from '@hooks/useExchangeRate';
import { WhitelistedToken } from '@utils/types';
import {
  useAccountPkh,
  useTezos,
  getUserBalance,
  useNetwork,
  estimateTezToToken,
} from '@utils/dapp';
import { validateMinMax } from '@utils/validators';
import {
  getWhitelistedTokenSymbol,
  isTokenEqual,
  parseDecimals,
  slippageToBignum,
} from '@utils/helpers';
import {
  FACTORIES, FEE_RATE, TEZOS_TOKEN,
} from '@utils/defaults';
import { Tabs } from '@components/ui/Tabs';
import { Card } from '@components/ui/Card';
import { ComplexRecipient } from '@components/ui/ComplexInput';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/Button';
import { Tooltip } from '@components/ui/Tooltip';
import { CardCell } from '@components/ui/Card/CardCell';
import { StickyBlock } from '@components/common/StickyBlock';
import { Slippage } from '@components/common/Slippage';
import { Route } from '@components/common/Route';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Transactions } from '@components/svg/Transactions';
import { SwapIcon } from '@components/svg/Swap';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';

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

const fallbackTokensData : TokenDataType = {
  token: {
    address: 'tez',
    type: 'fa1.2',
    decimals: 6,
    id: null,
  },
  balance: '0',
};

type FormValues = {
  balance1: number
  balance2: number
  recipient: string
  lastChange: string
  slippage: string
};

type HeaderProps = {
  debounce:number,
  save:any,
  values:FormValues,
  form:any,
  tabsState:any,
  token1:WhitelistedToken,
  setToken1:(token:WhitelistedToken) => void,
  token2:WhitelistedToken,
  setToken2:(token:WhitelistedToken) => void,
  tokensData:TokenDataMap,
  handleSwapTokens:() => void,
  handleTokenChange:(token: WhitelistedToken, tokenNumber: 'first' | 'second') => void,
  currentTab:any
};

const tokenDataToToken = (tokenData:TokenDataType) : WhitelistedToken => ({
  contractAddress: tokenData.token.address,
  fa2TokenId: tokenData.token.id,
} as WhitelistedToken);

type QSMainNet = 'mainnet' | 'florencenet';

const Header:React.FC<HeaderProps> = ({
  debounce,
  save,
  values,
  form,
  tabsState,
  token1,
  token2,
  setToken1,
  setToken2,
  tokensData,
  handleSwapTokens,
  handleTokenChange,
  currentTab,
}) => {
  const { t } = useTranslation(['common', 'swap']);
  const tezos = useTezos();
  const router = useRouter();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');
  const [fee, setFee] = useState<number>(0);
  const [estimatedOutputValue, setEstimatedOutputValue] = useState<string>('');
  const [swapParams, setSwapParams] = useState<TransferParams[]>([]);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const handleInputChange = async (val: FormValues) => {
    const currentTokenA = tokenDataToToken(tokensData.first);
    const currentTokenB = tokenDataToToken(tokensData.second);
    const isTokensSame = isTokenEqual(currentTokenA, currentTokenB);
    const isValuesSame = val[lastChange] === formValues[lastChange];
    if (isTokensSame || (isValuesSame)) return;
    if (tezos) {
      try {
        const fromAsset = tokensData.first.token.address === 'tez' ? 'tez' : {
          contract: tokensData.first.token.address,
          id: tokensData.first.token.id ? tokensData.first.token.id : undefined,
        };
        const toAsset = tokensData.second.token.address === 'tez' ? 'tez' : {
          contract: tokensData.second.token.address,
          id: tokensData.second.token.id ? tokensData.second.token.id : undefined,
        };
        const decimals1 = lastChange === 'balance1'
          ? tokensData.first.token.decimals
          : tokensData.second.token.decimals;
        const decimals2 = lastChange !== 'balance1'
          ? tokensData.first.token.decimals
          : tokensData.second.token.decimals;
        const inputWrapper = lastChange === 'balance1' ? val.balance1 : val.balance2;
        const inputValueInner = new BigNumber(inputWrapper * (10 ** decimals1)).integerValue();
        const valuesInner = lastChange === 'balance1' ? { inputValue: inputValueInner } : { outputValue: inputValueInner };
        // only on testnet and xtz => token
        if (networkId === 'florencenet') {
          try {
            const token = {
              contract: tokensData.second.token.address,
              id: tokensData.second.token.id ?? undefined,
            };
            const dexAddress = await findDex(tezos, FACTORIES[networkId], token);
            const amount = estimateTezToToken(
              tezos,
              new BigNumber(inputWrapper),
              dexAddress.storage.storage,
              tokensData.second.token,
            );
            form.mutators.setValue(lastChange === 'balance1' ? 'balance2' : 'balance1', amount);
          } catch (e) {
            console.error(e);
          }
        } else {
          try {
            const estimateValue = await estimateSwap(
              tezos,
              FACTORIES[networkId],
              fromAsset,
              toAsset,
              valuesInner,
            );
            setEstimatedOutputValue(estimateValue.toString());
            const retValue = estimateValue.div(
              new BigNumber(10)
                .pow(
                  new BigNumber(decimals2),
                ),
            ).toString();
            form.mutators.setValue(lastChange === 'balance1' ? 'balance2' : 'balance1', retValue);
          } catch (e) {
            console.error(e);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const loadFee = useCallback(async () => {
    const retValue = new BigNumber(estimatedOutputValue).div(
      new BigNumber(10)
        .pow(
          new BigNumber(6),
        ),
    ).toString();
    if (retValue === 'NaN') return;
    setFee((+retValue) * (+FEE_RATE));
  }, [estimatedOutputValue]);

  const asyncGetSwapParams = async () => {
    if (!tezos) return;
    try {
      const fromAsset = tokensData.first.token.address === 'tez' ? 'tez' : {
        contract: tokensData.first.token.address,
        id: tokensData.first.token.id ? tokensData.first.token.id : undefined,
      };
      const toAsset = tokensData.second.token.address === 'tez' ? 'tez' : {
        contract: tokensData.second.token.address,
        id: tokensData.second.token.id ? tokensData.second.token.id : undefined,
      };
      const paramsValue = await swap(
        tezos,
        FACTORIES[networkId],
        fromAsset,
        toAsset,
        5,
      );
      console.log(paramsValue);
      setSwapParams(paramsValue);
    } catch (e) {
      console.error(e);
    }
  };

  const saveFunc = async () => {
    if (promise) {
      await promise;
    }
    setVal(values);
    setSubm(true);
    handleInputChange(values);
    asyncGetSwapParams();
    promise = save(values);
    await promise;
    setSubm(false);
  };

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(saveFunc, debounce);
    loadFee();
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [values, token1, token2]);

  const handleSwapSubmit = async () => {
    if (!tezos) return;
    try {
      const op = await batchify(
        tezos.wallet.batch([]),
        swapParams,
      ).send();
      await op.confirmation();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Card
        header={{
          content: (
            <Tabs
              values={TabsContent}
              activeId={tabsState}
              setActiveId={(val) => router.replace(`/${val}`)}
              className={s.tabs}
            />
          ),
          button: (
            <Button
              theme="quaternary"
            >
              <Transactions />
            </Button>
          ),
          className: s.header,
        }}
        contentClassName={s.content}
      >
        <Field
          validate={validateMinMax(0, Infinity)}
          parse={(value) => parseDecimals(value, 0, Infinity)}
          name="balance1"
        >
          {({ input }) => (
            <>
              <TokenSelect
                {...input}
                onFocus={() => setLastChange('balance1')}
                token={token1}
                setToken={setToken1}
                handleBalance={(value) => {
                  setLastChange('balance1');
                  form.mutators.setValue(
                    'balance1',
                    value,
                  );
                }}
                handleChange={(token) => handleTokenChange(token, 'first')}
                balance={tokensData.first.balance}
                exchangeRate={tokensData.first.exchangeRate}
                id="swap-send-from"
                label="From"
                className={s.input}
              />
            </>
          )}
        </Field>
        <Button
          theme="quaternary"
          className={s.iconButton}
          onClick={() => {
            form.mutators.setValue(
              'balance1',
              values.balance2,
            );
            handleSwapTokens();
          }}
        >
          <SwapIcon />
        </Button>
        <Field
          validate={validateMinMax(0, Infinity)}
          parse={(value) => parseDecimals(value, 0, Infinity)}
          name="balance2"
        >
          {({ input }) => (
            <>
              <TokenSelect
                {...input}
                onFocus={() => setLastChange('balance2')}
                token={token2}
                setToken={setToken2}
                handleBalance={(value) => {
                  setLastChange('balance2');
                  form.mutators.setValue(
                    'balance2',
                    value,
                  );
                }}
                handleChange={(token) => handleTokenChange(token, 'second')}
                balance={tokensData.second.balance}
                exchangeRate={tokensData.second.exchangeRate}
                id="swap-send-to"
                label="To"
                className={cx(s.input, s.mb24)}
              />
            </>
          )}
        </Field>
        {currentTab.id === 'send' && (
        <Field name="recipient">
          {({ input }) => (
            <>
              <ComplexRecipient
                {...input}
                handleInput={(value) => {
                  form.mutators.setValue(
                    'recipient',
                    value,
                  );
                }}
                label="Recipient address"
                id="swap-send-recipient"
                className={cx(s.input, s.mb24)}
              />
            </>
          )}
        </Field>
        )}
        <Field initialValue="0.5 %" name="slippage">
          {({ input }) => {
            const slippagePercent = (
              (
                (values.balance2 ?? 0) * (+slippageToBignum(values.slippage))
              ).toFixed(tokensData.second.token.decimals)).toString();
            const minimumReceived = (values.balance2 ?? 0) - (+slippagePercent);
            return (
              <>
                <Slippage handleChange={(value) => input.onChange(value)} />
                <div className={s.receive}>
                  <span className={s.receiveLabel}>
                    Minimum received:
                  </span>
                  <CurrencyAmount
                    amount={minimumReceived.toString()}
                    currency={getWhitelistedTokenSymbol(token2)}
                  />
                </div>
              </>
            );
          }}

        </Field>
        <Button onClick={handleSwapSubmit} className={s.button}>
          {currentTab.label}
        </Button>
      </Card>
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
            <CurrencyAmount amount="1" currency={getWhitelistedTokenSymbol(token1)} />
            <span className={s.equal}>=</span>
            <CurrencyAmount
              amount={`${(+(tokensData.first.exchangeRate ?? 1)) / (+(tokensData.second.exchangeRate ?? 1))}`}
              currency={getWhitelistedTokenSymbol(token2)}
              dollarEquivalent={`${tokensData.first.exchangeRate}`}
            />
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
            <CurrencyAmount amount="1" currency={getWhitelistedTokenSymbol(token2)} />
            <span className={s.equal}>=</span>
            <CurrencyAmount
              amount={`${(+(tokensData.second.exchangeRate ?? 1)) / (+(tokensData.first.exchangeRate ?? 1))}`}
              currency={getWhitelistedTokenSymbol(token1)}
              dollarEquivalent={`${tokensData.second.exchangeRate}`}
            />
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
          {/* TODO: find how to calculate */}
          {/* depends on token amount and token pool */}
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
          <CurrencyAmount amount={fee.toString()} currency="XTZ" />
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
            routes={
              // swapParams
              //   .map((x, i) => ({
              //     id: i,
              //     name: getWhitelistedTokenSymbol(
              //       tokens.find((y) => x.to === y.contractAddress) ?? TEZOS_TOKEN,
              //     ),
              //     link: `https://analytics.quipuswap.com/tokens/${x.to}`,
              //   }))
              //  generates ERROR state - TEZ or TEZ -> TEZ
                [{
                  id: 0,
                  name: getWhitelistedTokenSymbol(token1),
                  link: `https://analytics.quipuswap.com/tokens/${tokensData.first.token.address}`,
                },
                ...(tokensData.first.token.address !== 'tez' && tokensData.second.token.address !== 'tez' ? [{
                  id: 1,
                  name: 'XTZ',
                  link: 'https://analytics.quipuswap.com/tokens/tez',
                }] : []),
                {
                  id: 2,
                  name: getWhitelistedTokenSymbol(token2),
                  link: `https://analytics.quipuswap.com/tokens/${tokensData.second.token.address}`,
                }]
              }
          />
        </CardCell>
        {swapParams.length > 0 && (
        <Button
          className={s.detailsButton}
          theme="inverse"
          href={`https://analytics.quipuswap.com/pairs/${swapParams.find((x) => x.parameter?.entrypoint === 'tokenToTezPayment')?.to}`}
        >
          View Pair Analytics
          <ExternalLink className={s.linkIcon} />
        </Button>
        )}
      </Card>
    </>
  );
};

const AutoSave = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={Header} />
);

export const SwapSend: React.FC<SwapSendProps> = ({
  className,
}) => {
  const tezos = useTezos();
  const router = useRouter();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [tabsState, setTabsState] = useState(router.pathname.slice(1));

  const [tokensData, setTokensData] = useState<TokenDataMap>(
    {
      first: fallbackTokensData,
      second: fallbackTokensData,
    },
  );

  const { Form } = withTypes<FormValues>();
  const [token1, setToken1] = useState<WhitelistedToken>(TEZOS_TOKEN);
  const [token2, setToken2] = useState<WhitelistedToken>(TEZOS_TOKEN);

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
    }) => (
      token.contractAddress === TEZOS_TOKEN.contractAddress && el.tokenAddress === undefined ? el
        : el.tokenAddress === token.contractAddress
      && (token.fa2TokenId ? el.tokenId === token.fa2TokenId : true)
    ));

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
    setToken1(token2);
    setToken2(token1);
    setTokensData({ first: tokensData.second, second: tokensData.first });
  };

  useEffect(() => {
    if (exchangeRates && tezos && accountPkh && !initialLoad) {
      setInitialLoad(true);
      if (!tokensData.first.exchangeRate) {
        handleTokenChange(
          {
            contractAddress: tokensData.first.token.address,
            type: tokensData.first.token.type,
            metadata:
            {
              decimals: tokensData.first.token.decimals,
            },
          } as WhitelistedToken, 'first',
        );
      }
      if (!tokensData.second.exchangeRate) {
        handleTokenChange(
          {
            contractAddress: tokensData.second.token.address,
            type: tokensData.second.token.type,
            metadata:
          {
            decimals: tokensData.second.token.decimals,
          },
          } as WhitelistedToken, 'second',
        );
      }
    }
  }, [exchangeRates, tezos, accountPkh]);

  return (
    <StickyBlock className={className}>
      <Form
        onSubmit={() => {}}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({ form }) => (
          <AutoSave
            form={form}
            debounce={1000}
            save={() => {}}
            setTabsState={setTabsState}
            tabsState={tabsState}
            token1={token1}
            token2={token2}
            setToken1={setToken1}
            setToken2={setToken2}
            tokensData={tokensData}
            handleSwapTokens={handleSwapTokens}
            handleTokenChange={handleTokenChange}
            currentTab={currentTab}
          />
        )}
      />
    </StickyBlock>
  );
};
