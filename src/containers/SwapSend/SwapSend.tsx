import React, {
  useMemo, useState, useEffect, useRef,
} from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import {
  estimateSwap, findDex, swap, batchify,
} from '@quipuswap/sdk';
import { withTypes, Field, FormSpy } from 'react-final-form';
import { useTranslation } from 'next-i18next';

// import { usePrevious } from '@hooks/usePrevious';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { WhitelistedToken } from '@utils/types';
import {
  useAccountPkh,
  useTezos,
  getUserBalance,
  useNetwork,
} from '@utils/dapp';
import { validateMinMax } from '@utils/validators';
import {
  getWhitelistedTokenSymbol,
  // isPairEqual,
  isTokenEqual,
  parseNumber,
  slippageToBignum,
  slippageToNum,
} from '@utils/helpers';
import {
  FACTORIES, TEZOS_TOKEN,
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
  // token1: string
  // token2: string
  balance1: number
  balance2: number
  recipient: string
  lastChange: string
  slippage: string
};

type HeaderProps = {
  debounce:number,
  save:any,
  values:any,
  form:any,
  tabsState:any,
  setTabsState:any,
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

// const undefinedTokenDataToToken = (
//   tokenData:any,
//   key: any,
// ) : WhitelistedToken => ({
//   contractAddress: (tokenData && tokenData[key].token.address) ?? null,
//   fa2TokenId: (tokenData && tokenData[key].token.id) ?? null,
// } as WhitelistedToken);

const toNat = (amount: any, decimals: number) => new BigNumber(amount)
  .times(10 ** decimals)
  .integerValue(BigNumber.ROUND_DOWN);

const isTez = (tokensData:TokenDataType) => tokensData.token.address === 'tez';

type QSMainNet = 'mainnet' | 'florencenet';

const Header:React.FC<HeaderProps> = ({
  debounce,
  save,
  values,
  form,
  tabsState,
  setTabsState,
  token1,
  token2,
  setToken1,
  setToken2,
  tokensData,
  handleSwapTokens,
  handleTokenChange,
  currentTab,
}) => {
  const tezos = useTezos();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');
  // const prevTokens = usePrevious(tokensData);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const fromNat = (amount: any, token: any) => new BigNumber(amount).div(10 ** token.decimals);

  const estimateTezToToken = (
    tezAmount: BigNumber,
    dexStorage: any,
    token: any,
  ) => {
    if (!tezAmount) return new BigNumber(0);

    const mutezAmount = tezos!!.format('tz', 'mutez', tezAmount) as any;
    // const mutezAmount = tezAmount;

    const tezInWithFee = mutezAmount.times(997);
    const numerator = tezInWithFee.times(dexStorage.token_pool);
    const denominator = new BigNumber(dexStorage.tez_pool)
      .times(1000)
      .plus(tezInWithFee);
    const tokensOut = numerator.idiv(denominator);
    // console.log(
    //   // tezAmount.toString(),
    //   // mutezAmount.toString(),
    //   // tezInWithFee.toString(),
    //   // numerator.toString(),
    //   // denominator.toString(),
    //   tokensOut.toString(),
    //   // na.toString(),
    // );
    const na = fromNat(tokensOut, token);

    return na;
  };

  const handleInputChange = async (val: FormValues) => {
    const currentTokenA = tokenDataToToken(tokensData.first);
    const currentTokenB = tokenDataToToken(tokensData.second);
    // const prevTokenA = undefinedTokenDataToToken(prevTokens, 'first');
    // const prevTokenB = undefinedTokenDataToToken(prevTokens, 'second');

    const isTokensSame = isTokenEqual(currentTokenA, currentTokenB);
    // console.log(isTokensSame, currentTokenA, currentTokenB);
    // const isTokensPairSame = isPairEqual(currentTokenA, currentTokenB, prevTokenA, prevTokenB);
    // const isTokensPairSame = false;
    const isValuesSame = val[lastChange] === formValues[lastChange];

    // console.log(currentTokenA, currentTokenB, prevTokenA, prevTokenB);
    // console.log(currentTokenA, currentTokenB);
    // console.log(
    //   isTokensSame || (isValuesSame && isTokensPairSame),
    //   isTokensSame,
    //   isValuesSame,
    //   isTokensPairSame,
    // );
    // if (isTokensSame || (isValuesSame && isTokensPairSame)) return;
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
        const inputValueInner = new BigNumber(inputWrapper * (10 ** decimals1));
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
              new BigNumber(inputWrapper),
              dexAddress.storage.storage,
              tokensData.second.token,
            );
            form.mutators.setValue(lastChange === 'balance1' ? 'balance2' : 'balance1', amount);
          } catch (e) {
            // console.log(e);
          }
        } else {
          try {
            const estimatedOutputValue = await estimateSwap(
              tezos,
              FACTORIES[networkId],
              fromAsset,
              toAsset,
              valuesInner,
            );
            const retValue = estimatedOutputValue.div(
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

  const saveFunc = async () => {
    if (promise) {
      await promise;
    }
    setVal(values);
    setSubm(true);
    handleInputChange(values);
    promise = save(values);
    await promise;
    setSubm(false);
  };

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(saveFunc, debounce);
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [values, tokensData]);

  const handleSwapSubmit = async () => {
    if (!tezos) return;
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

  return (
    <Card
      header={{
        content: (
          <Tabs
            values={TabsContent}
            activeId={tabsState}
            setActiveId={(val) => setTabsState(val)}
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
        parse={(value) => value}
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
                form.mutators.setValue(
                  'balance1',
                  +value,
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
        parse={(value) => parseNumber(value, 0, Infinity)}
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
                form.mutators.setValue(
                  'balance2',
                  +value,
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
                  +value,
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
              values.balance2 * (+slippageToBignum(values.slippage))
            ).toFixed(tokensData.second.token.decimals)).toString();
          const minimumReceived = values.balance2 - (+slippagePercent);
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
  );
};

const AutoSave = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={Header} />
);

export const SwapSend: React.FC<SwapSendProps> = ({
  className,
}) => {
  const tezos = useTezos();
  // console.log(tezos, tezos?.signer);
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
  const [initialLoad, setInitialLoad] = useState<boolean>(false);

  const { t } = useTranslation(['common', 'swap']);
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes

  const [tokensData, setTokensData] = useState<TokenDataMap>(
    {
      first: fallbackTokensData,
      second: fallbackTokensData,
    },
  );

  // const [inputValue, setInputValue] = useState<string>(''); // TODO: Delete when lib added

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

    // console.log('setTokensData', token, tokenNumber);
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
    // handleTokenChange(token1, 'second');
    // handleTokenChange(token2, 'first');
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

  // useEffect(() => {
  //   const awFunc = async () => {
  //     if (tezos && accountPkh) {
  //       const amount = await tezos.tz.getBalance(accountPkh);
  //       setTokensData((prevState) => (
  //         {
  //           ...prevState,
  //           first: {
  //             ...fallbackTokensData,
  //             balance: mutezToTz(amount, tezos).toString(),
  //           },
  //         }
  //       ));
  //       // return mutezToTz(amount);
  //     }
  //   };
  //   if (tokensData.first.token.address === 'tez' && tezos && accountPkh) { awFunc(); }
  // }, [tezos, accountPkh]);

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
