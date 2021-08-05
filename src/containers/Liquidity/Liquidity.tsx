import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { withTypes, Field, FormSpy } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import {
  addLiquidity, batchify, estimateSwap, findDex, Token,
} from '@quipuswap/sdk';

import {
  getUserBalance, useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { WhitelistedToken } from '@utils/types';
import { validateMinMax } from '@utils/validators';
import { getWhitelistedTokenSymbol, isTokenEqual, parseDecimals } from '@utils/helpers';
import { Tooltip } from '@components/ui/Tooltip';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { ComplexInput } from '@components/ui/ComplexInput';
import { CardCell } from '@components/ui/Card/CardCell';
import { Switcher } from '@components/ui/Switcher';
import { StickyBlock } from '@components/common/StickyBlock';
import { Slippage } from '@components/common/Slippage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Transactions } from '@components/svg/Transactions';
import { ArrowDown } from '@components/svg/ArrowDown';
import { Plus } from '@components/svg/Plus';
import { ExternalLink } from '@components/svg/ExternalLink';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';

import s from '@styles/CommonContainer.module.sass';

const TabsContent = [
  {
    id: 'add',
    label: 'Add',
  },
  {
    id: 'remove',
    label: 'Remove',
  },
];

type LiquidityProps = {
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
  switcher: boolean
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
  token1:WhitelistedToken,
  setToken1:(token:WhitelistedToken) => void,
  token2:WhitelistedToken,
  setToken2:(token:WhitelistedToken) => void,
  tokensData:TokenDataMap,
  handleTokenChange:(token: WhitelistedToken, tokenNumber: 'first' | 'second') => void,
  currentTab:any,
  setTabsState:(val:any) => void
};

const tokenDataToToken = (tokenData:TokenDataType) : WhitelistedToken => ({
  contractAddress: tokenData.token.address,
  fa2TokenId: tokenData.token.id,
} as WhitelistedToken);

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
  token1,
  token2,
  setToken1,
  setToken2,
  tokensData,
  handleTokenChange,
  currentTab,
  setTabsState,
}) => {
  const tezos = useTezos();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');

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

    const tezInWithFee = mutezAmount.times(997);
    const numerator = tezInWithFee.times(dexStorage.token_pool);
    const denominator = new BigNumber(dexStorage.tez_pool)
      .times(1000)
      .plus(tezInWithFee);
    const tokensOut = numerator.idiv(denominator);
    const na = fromNat(tokensOut, token);

    return na;
  };

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
            console.error(e);
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
      // const fromAsset = isTez(tokensData.first) ? 'tez' : {
      //   contract: tokensData.first.token.address,
      //   id: tokensData.first.token.id ? tokensData.first.token.id : undefined,
      // };
      const toAsset = isTez(tokensData.second) ? 'tez' : {
        contract: tokensData.second.token.address,
        id: tokensData.second.token.id ? tokensData.second.token.id : undefined,
      };
      const inputValue = isTez(tokensData.first)
        ? tezos!!.format('tz', 'mutez', values.balance1) as any
        : toNat(values.balance1, tokensData.first.token.decimals);

      const dex = await findDex(tezos, FACTORIES[networkId], toAsset as Token);
      const addLiquidityParams = await addLiquidity(
        tezos,
        dex,
        { tezValue: inputValue },
      );
      const op = await batchify(
        tezos.wallet.batch([]),
        addLiquidityParams,
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
      {currentTab.id === 'remove' && (
      <Field
        name="tokenPair"
      >
        {({ input }) => (
          <>
            <ComplexInput
              {...input}
              token1={TEZOS_TOKEN}
              handleBalance={(value) => {
                form.mutators.setValue(
                  'tokenPair',
                  +value,
                );
              }}
              id="liquidity-remove-input"
              label="Select LP"
              className={s.input}
              mode="votes"
            />
            <ArrowDown className={s.iconButton} />
          </>
        )}
      </Field>
      )}
      <Field
        name="balance1"
        validate={validateMinMax(0, Infinity)}
        parse={(value) => parseDecimals(value, 0, Infinity)}
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
                if (!values.switcher) {
                  form.mutators.setValue(
                    'balance2',
                    +value,
                  );
                }
              }}
              handleChange={(token) => handleTokenChange(token, 'first')}
              balance={tokensData.first.balance}
              exchangeRate={tokensData.first.exchangeRate}
              id="liquidity-token-1"
              label={currentTab.id === 'remove' ? 'Output' : 'Input'}
              className={s.input}
              readOnly={currentTab.id === 'remove'}
            />
            <OnChange name="balance1">
              {(value:string) => {
                setLastChange('balance1');
                if (!values.switcher) {
                  form.mutators.setValue(
                    'balance2',
                    +value,
                  );
                }
              }}
            </OnChange>
          </>
        )}

      </Field>
      <Plus className={s.iconButton} />
      <Field
        name="balance2"
        validate={validateMinMax(0, Infinity)}
        parse={(value) => parseDecimals(value, 0, Infinity)}
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
                if (!values.switcher) {
                  form.mutators.setValue(
                    'balance1',
                    +value,
                  );
                }
              }}
              handleChange={(token) => handleTokenChange(token, 'second')}
              balance={tokensData.second.balance}
              exchangeRate={tokensData.second.exchangeRate}
              id="liquidity-token-2"
              label={currentTab.id === 'remove' ? 'Output' : 'Input'}
              className={cx(s.input, s.mb24)}
              readOnly={currentTab.id === 'remove'}
            />
            <OnChange name="balance2">
              {(value:string) => {
                setLastChange('balance2');
                if (!values.switcher) {
                  form.mutators.setValue(
                    'token1',
                    value,
                  );
                }
              }}
            </OnChange>
          </>
        )}
      </Field>

      <Slippage handleChange={() => {}} />

      {currentTab.id === 'add' && (
      <>
        {!values.switcher ? (
          <Field name="token2">
            {({ input }) => (
              <div className={cx(s.receive, s.mb24)}>
                <span className={s.receiveLabel}>
                  Max invested XTZ/QPLP:
                </span>
                <CurrencyAmount amount={input.value} />
              </div>

            )}

          </Field>
        )
          : (
            <>
              <div className={s.receive}>
                <span className={s.receiveLabel}>
                  Max invested:
                </span>
                <CurrencyAmount
                  currency={getWhitelistedTokenSymbol(token1)}
                  amount={values.balance1}
                />
              </div>
              <div className={cx(s.receive, s.mb24)}>
                <span className={s.receiveLabel}>
                  Max invested:
                </span>
                <CurrencyAmount
                  currency={getWhitelistedTokenSymbol(token2)}
                  amount={values.balance2}
                />
              </div>
            </>
          )}

        {currentTab.id === 'remove' && (
        <>
          <div className={s.receive}>
            <span className={s.receiveLabel}>
              Minimum received:
            </span>
            <CurrencyAmount
              currency={getWhitelistedTokenSymbol(token1)}
              amount={values.balance1}
            />
          </div>
          <div className={s.receive}>
            <span className={s.receiveLabel}>
              Minimum received:
            </span>
            <CurrencyAmount
              currency={getWhitelistedTokenSymbol(token2)}
              amount={values.balance2}
            />
          </div>
        </>
        )}
        <Button className={s.button}>
          {currentTab.id === 'add' ? 'Add' : 'Remove & Unvote'}
        </Button>

        <Field name="switcher">
          {({ input }) => (

            <div className={s.switcher}>
              <Switcher
                isActive={input.value}
                onChange={() => {
                  if (input.value) {
                    form.mutators.setValue(
                      lastChange === 'balance1' ? 'balance2' : 'balance1',
                      values[lastChange !== 'balance1' ? 'balance2' : 'balance1'],
                    );
                  }
                  input.onChange(!input.value);
                }}
                className={s.switcherInput}
              />
              Rebalance Liquidity
              <Tooltip content="Token prices in a pool may change significantly within seconds. Slippage tolerance defines the difference between the expected and current exchange rate that you find acceptable. The higher the slippage tolerance, the more likely a transaction will go through." />
            </div>
          )}
        </Field>
      </>
      )}

      <Button onClick={handleSwapSubmit} className={s.button}>
        {currentTab.label}
      </Button>
    </Card>
  );
};

const AutoSave = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={Header} />
);

export const Liquidity: React.FC<LiquidityProps> = ({
  className,
}) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
  const { t } = useTranslation(['common', 'liquidity']);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
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
            handleTokenChange={handleTokenChange}
            currentTab={currentTab}
          />
        )}
      />
      <Card
        header={{
          content: `${currentTab.label} Liquidity Details`,
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
              {t('liquidity:Token A Locked')}
              <Tooltip
                sizeT="small"
                content={t('liquidity:The amount of token A that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.')}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="10000" currency="tez" />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('liquidity:Token B Locked')}
              <Tooltip
                sizeT="small"
                content={t('liquidity:The amount of token B that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.')}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="10000" currency="QPSP" />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('liquidity:Your Total LP')}
              <Tooltip
                sizeT="small"
                content={t("liquidity:Total amount of this pool's LP tokens you will own after adding liquidity. LP (Liquidity Pool) tokens represent your current share in a pool.")}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="1000000" />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('liquidity:Your Frozen LP')}
              <Tooltip
                sizeT="small"
                content={t('liquidity:Frozen LPs are LPs you own that are locked in a smart contract (for voting, farming, etc.) and can not be moved or withdrawn until you unlock them.')}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="100" />
        </CardCell>
        <div className={s.detailsButtons}>
          <Button
            className={s.detailsButton}
            theme="inverse"
          >
            View Pair Analytics
            <ExternalLink className={s.linkIcon} />
          </Button>
          <Button
            className={s.detailsButton}
            theme="inverse"
          >
            View Pair Contract
            <ExternalLink className={s.linkIcon} />
          </Button>
        </div>
      </Card>
    </StickyBlock>

  );
};
