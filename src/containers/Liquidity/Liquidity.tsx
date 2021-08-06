import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { withTypes, Field, FormSpy } from 'react-final-form';
import {
  addLiquidity,
  batchify,
  estimateSharesInTez,
  estimateSharesInToken,
  estimateSwap,
  estimateTezInShares,
  estimateTokenInShares,
  findDex,
  FoundDex,
  getLiquidityShare,
  removeLiquidity,
  Token,
  TransferParams,
} from '@quipuswap/sdk';

import {
  getUserBalance,
  useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';
import { validateMinMax } from '@utils/validators';
import {
  getWhitelistedTokenSymbol, isTokenEqual, parseDecimals, slippageToBignum, slippageToNum,
} from '@utils/helpers';
import { Tooltip } from '@components/ui/Tooltip';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { ComplexInput } from '@components/ui/ComplexInput';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { Switcher } from '@components/ui/Switcher';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { StickyBlock } from '@components/common/StickyBlock';
import { Slippage } from '@components/common/Slippage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Transactions } from '@components/svg/Transactions';
import { ArrowDown } from '@components/svg/ArrowDown';
import { Plus } from '@components/svg/Plus';
import { ExternalLink } from '@components/svg/ExternalLink';

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
  balance3: number
  balanceA: number
  balanceB: number
  balanceTotalA: number
  balanceTotalB: number
  lpBalance: string
  frozenBalance: string
  lastChange: string
  estimateLP: string
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
  tokenPair: WhitelistedTokenPair,
  setTokenPair: (pair:WhitelistedTokenPair) => void,
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
  tokenPair,
  setToken1,
  setToken2,
  setTokenPair,
  tokensData,
  handleTokenChange,
  currentTab,
  setTabsState,
}) => {
  const { t } = useTranslation(['common', 'liquidity']);
  const tezos = useTezos();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const accountPkh = useAccountPkh();
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');
  const [removeLiquidityParams, setRemoveLiquidityParams] = useState<TransferParams[]>([]);
  const [poolShare, setPoolShare] = useState<
  { unfrozen:BigNumber, frozen:BigNumber, total:BigNumber }
  >();

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const handleInputChange = async (val: FormValues) => {
    const currentTokenA = tokenDataToToken(tokensData.first);
    const currentTokenB = tokenDataToToken(tokensData.second);
    const isTokensSame = isTokenEqual(currentTokenA, currentTokenB);
    const isValuesSame = val[lastChange] === formValues[lastChange];
    if (tezos) {
      if (currentTab.id === 'remove') {
        console.log('rem');
      } else if (!val.switcher) {
        if (isTokensSame || (isValuesSame)) return;
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
            );
            form.mutators.setValue(lastChange === 'balance1' ? 'balance2' : 'balance1', retValue.toString());
            const getInputValue = (token:TokenDataType, balance:string) => (isTez(token)
              ? tezos!!.format('tz', 'mutez', balance) as any
              : toNat(balance, token.token.decimals));

            const getMethod = async (
              token:TokenDataType,
              dex:FoundDex,
              value:BigNumber,
            ) => (isTez(token)
              ? estimateSharesInTez(dex.storage, getInputValue(token, value.toString()))
              : estimateSharesInToken(dex.storage, getInputValue(token, value.toString())));
            const dex = await findDex(tezos, FACTORIES[networkId], toAsset as Token);
            const sharesA = await getMethod(tokensData.first, dex, new BigNumber(values.balance1));
            const sharesB = await getMethod(
              tokensData.second,
              dex,
              lastChange === 'balance2' ? new BigNumber(values.balance2) : estimatedOutputValue.integerValue(),
            );

            const lp1 = sharesA.div(
              new BigNumber(10)
                .pow(
                  new BigNumber(tokensData.first.token.decimals),
                ),
            ).toString();
            const lp2 = sharesB.div(
              new BigNumber(10)
                .pow(
                  new BigNumber(tokensData.second.token.decimals),
                ),
            ).toString();

            form.mutators.setValue(
              'estimateLP',
              lp1 + lp2,
            );
          } catch (e) {
            console.error(e);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  async function asyncFindPairDex(
    pair:WhitelistedTokenPair,
  ) : Promise<WhitelistedTokenPair | undefined> {
    if (!tezos || !accountPkh || !networkId) return undefined;
    try {
      const secondAsset = {
        contract: pair.token2.contractAddress,
        id: pair.token2.fa2TokenId,
      };
      const dex = await findDex(tezos, FACTORIES[networkId], secondAsset);
      const share = await getLiquidityShare(tezos, dex, accountPkh!!);

      // const lpTokenValue = share.total;
      const frozenBalance = share.frozen.div(
        new BigNumber(10)
          .pow(
            // new BigNumber(pair.token2.metadata.decimals),
            // NOT WORKING - CURRENT XTZ DECIMALS EQUALS 6!
            // CURRENT METHOD ONLY WORKS FOR XTZ -> TOKEN, so decimals = 6
            new BigNumber(6),
          ),
      ).toString();
      const totalBalance = share.total.div(
        new BigNumber(10)
          .pow(
            // new BigNumber(pair.token2.metadata.decimals),
            new BigNumber(6),
          ),
      ).toString();
      const res = {
        ...pair, frozenBalance, balance: totalBalance, dex,
      };
      setTokenPair(res);
      return res;
    } catch (err) {
      console.error(err);
    }
    return undefined;
  }

  const asyncGetShares = async (shares:any) => {
    console.log(shares);
    // if (!tezos || !tokenPair.dex) return;
    if (!tezos) return;
    let tokenPairValue = tokenPair;
    if (currentTab.id !== 'remove') {
      const attempt = await asyncFindPairDex({ token1, token2, dex: '' });
      if (attempt) {
        tokenPairValue = attempt;
      }
    }
    try {
      const getMethod = async (
        token:WhitelistedToken,
        dex:FoundDex,
        value:BigNumber,
      ) => (token.contractAddress === 'tez'
        ? estimateTezInShares(dex.storage, value.toString())
        : estimateTokenInShares(dex.storage, value.toString()));
      // const balance = new BigNumber(values.balance3 * (10 ** decimals1));
      const balance = new BigNumber(
        (values.balance3 ?? 0) * (10 ** 6), // ONLY WORKS FOR XTZ LPs!
      );
      const sharesA = await getMethod(
        tokenPairValue.token1,
        tokenPairValue.dex,
        balance.integerValue(),
      );
      const sharesB = await getMethod(
        tokenPairValue.token2,
        tokenPairValue.dex,
        balance.integerValue(),
      );
      const bal1 = sharesA.div(
        new BigNumber(10)
          .pow(
            new BigNumber(6),
          ),
      ).toString();
      const bal2 = sharesB.div(
        new BigNumber(10)
          .pow(
            new BigNumber(6),
          ),
      ).toString();

      form.mutators.setValue(
        'balanceA',
        +bal1,
      );

      form.mutators.setValue(
        'balanceB',
        +bal2,
      );

      const balanceAB = shares;
      const sharesTotalA = await getMethod(
        tokenPairValue.token1,
        tokenPairValue.dex,
        balanceAB.integerValue(),
      );
      const sharesTotalB = await getMethod(
        tokenPairValue.token2,
        tokenPairValue.dex,
        balanceAB.integerValue(),
      );
      const balA1 = sharesTotalA.div(
        new BigNumber(10)
          .pow(
            new BigNumber(6),
          ),
      ).toString();
      const balA2 = sharesTotalB.div(
        new BigNumber(10)
          .pow(
            new BigNumber(6),
          ),
      ).toString();

      form.mutators.setValue(
        'balanceTotalA',
        +balA1,
      );

      form.mutators.setValue(
        'balanceTotalB',
        +balA2,
      );
    } catch (err) {
      console.error(err);
    }
  };

  const asyncGetLiquidityShare = async () => {
    if (!tezos || !accountPkh) return;
    try {
      const account = accountPkh;
      const slippageTolerance = slippageToNum(values.slippage) / 100;

      const toAsset = {
        contract: token2.contractAddress,
        id: token2.fa2TokenId,
      };
      const dex = await findDex(tezos, FACTORIES[networkId], toAsset);
      const share = await getLiquidityShare(tezos, dex, account);

      const lpTokenValue = share.total;
      const paramsValue = await removeLiquidity(
        tezos,
        dex,
        lpTokenValue,
        slippageTolerance,
      );
      console.log(share);
      console.log(paramsValue);
      setPoolShare(share);
      setRemoveLiquidityParams(paramsValue);
      asyncGetShares(share.total);
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
    asyncGetLiquidityShare();
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
  }, [values.balance1, values.balance2, values.balance3, values.slippage, token1, token2]);

  const handleAddLiquidity = async () => {
    if (!tezos) return;
    try {
      const toAsset = isTez(tokensData.second) ? 'tez' : {
        contract: tokensData.second.token.address,
        id: tokensData.second.token.id ? tokensData.second.token.id : undefined,
      };
      const dex = await findDex(tezos, FACTORIES[networkId], toAsset as Token);

      const addLiquidityParams = await addLiquidity(
        tezos,
        dex,
        // { tezValue: values.balance1, tokenValue: values.balance2 },
        { tezValue: values.balance1 },
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

  const handleRemoveLiquidity = async () => {
    if (!tezos) return;
    try {
      const op = await batchify(
        tezos.wallet.batch([]),
        removeLiquidityParams,
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
          name="balance3"
        >
          {({ input }) => (
            <>
              <PositionSelect
                {...input}
                tokenPair={tokenPair}
                setTokenPair={(pair) => {
                  asyncFindPairDex(pair);
                }}
                handleBalance={(value) => {
                  form.mutators.setValue(
                    'balance3',
                    +value,
                  );
                }}
                balance={tokenPair.balance}
                frozenBalance={tokenPair.frozenBalance}
                id="liquidity-remove-input"
                label="Select LP"
                className={s.input}
              />
              <ArrowDown className={s.iconButton} />
            </>
          )}
        </Field>
        )}
        {currentTab.id === 'remove' && (
          <Field
            name="balanceA"
          >
            {({ input }) => (
              <ComplexInput
                {...input}
                token1={tokenPair.token1}
                handleBalance={() => {}}
                balance={tokensData.first.balance}
                id="liquidity-token-1"
                label="Output"
                className={cx(s.input, s.mb24)}
                readOnly
              />

            )}
          </Field>
        )}
        {currentTab.id !== 'remove' && (
        <Field
          name="balance1"
          validate={validateMinMax(0, Infinity)}
          parse={(value) => parseDecimals(value, 0, Infinity)}
        >
          {({ input }) => (
            <TokenSelect
              {...input}
              onFocus={() => setLastChange('balance1')}
              token={token1}
              setToken={setToken1}
              handleBalance={(value) => {
                setLastChange('balance1');
                form.mutators.setValue(
                  'balance1',
                  +value,
                );
              }}
              handleChange={(token) => handleTokenChange(token, 'first')}
              balance={tokensData.first.balance}
              exchangeRate={tokensData.first.exchangeRate}
              id="liquidity-token-1"
              label="Input"
              className={s.input}
            />
          )}
        </Field>
        )}
        <Plus className={s.iconButton} />
        {currentTab.id === 'remove' && (
          <Field
            name="balanceB"
            validate={validateMinMax(0, Infinity)}
            parse={(value) => parseDecimals(value, 0, Infinity)}
          >
            {({ input }) => (
              <ComplexInput
                {...input}
                token1={tokenPair.token2}
                handleBalance={() => {}}
                balance={tokensData.second.balance}
                id="liquidity-token-2"
                label="Output"
                className={cx(s.input, s.mb24)}
                readOnly
              />
            )}

          </Field>
        )}
        {currentTab.id !== 'remove' && (
        <Field
          name="balance2"
          validate={validateMinMax(0, Infinity)}
          parse={(value) => parseDecimals(value, 0, Infinity)}
        >
          {({ input }) => (
            <TokenSelect
              {...input}
              onFocus={() => setLastChange('balance2')}
              token={token2}
              setToken={setToken2}
              handleBalance={(value) => {
                setLastChange('balance2');
                form.mutators.setValue(
                  'balance2',
                  +value,
                );
              }}
              handleChange={(token) => handleTokenChange(token, 'second')}
              balance={tokensData.second.balance}
              exchangeRate={tokensData.second.exchangeRate}
              id="liquidity-token-2"
              label="Input"
              className={cx(s.input, s.mb24)}
            />
          )}
        </Field>
        )}

        <Field initialValue="0.5 %" name="slippage">
          {({ input }) => {
            const slippagePercent = (
              (
                (values.balance2 ?? 0) * (+slippageToBignum(values.slippage))
              ).toFixed(tokensData.second.token.decimals)).toString();
            const minimumReceivedA = (values.balanceA ?? 0) - (+slippagePercent);
            const minimumReceivedB = (values.balanceB ?? 0) - (+slippagePercent);
            const maxInvestedA = (values.balance1 ?? 0) - (+slippagePercent);
            const maxInvestedB = (values.balance2 ?? 0) - (+slippagePercent);
            return (
              <>
                <Slippage handleChange={(value) => input.onChange(value)} />
                {currentTab.id === 'add' && (
                <>
                  {!values.switcher ? (
                    <div className={cx(s.receive, s.mb24)}>
                      <span className={s.receiveLabel}>
                        Max invested:
                      </span>
                      <CurrencyAmount
                        currency={`${getWhitelistedTokenSymbol(token1)}/${getWhitelistedTokenSymbol(token2)}`}
                        amount={values.estimateLP}
                      />
                    </div>
                  )
                    : (
                      <>
                        <div className={s.receive}>
                          <span className={s.receiveLabel}>
                            Max invested:
                          </span>
                          <CurrencyAmount
                            currency={getWhitelistedTokenSymbol(token1)}
                            amount={maxInvestedA.toString()}
                          />
                        </div>
                        <div className={cx(s.receive, s.mb24)}>
                          <span className={s.receiveLabel}>
                            Max invested:
                          </span>
                          <CurrencyAmount
                            currency={getWhitelistedTokenSymbol(token2)}
                            amount={maxInvestedB.toString()}
                          />
                        </div>
                      </>
                    )}
                </>
                )}

                {currentTab.id === 'remove' && (
                <>
                  <div className={s.receive}>
                    <span className={s.receiveLabel}>
                      Minimum received:
                    </span>
                    <CurrencyAmount
                      currency={getWhitelistedTokenSymbol(tokenPair.token1)}
                      amount={minimumReceivedA.toString()}
                    />
                  </div>
                  <div className={s.receive}>
                    <span className={s.receiveLabel}>
                      Minimum received:
                    </span>
                    <CurrencyAmount
                      currency={getWhitelistedTokenSymbol(tokenPair.token2)}
                      amount={minimumReceivedB.toString()}
                    />
                  </div>
                  <Button onClick={handleRemoveLiquidity} className={s.button}>
                    Remove & Unvote
                  </Button>
                </>
                )}
              </>
            );
          }}

        </Field>
        {currentTab.id === 'add' && (
        <>
          <Field name="switcher">
            {({ input }) => (

              <div className={s.switcher}>
                <Switcher
                  {...input}
                  isActive={input.value}
                  className={s.switcherInput}
                />
                Rebalance Liquidity
                <Tooltip content="Token prices in a pool may change significantly within seconds. Slippage tolerance defines the difference between the expected and current exchange rate that you find acceptable. The higher the slippage tolerance, the more likely a transaction will go through." />
              </div>
            )}
          </Field>
          <Button onClick={handleAddLiquidity} className={s.button}>
            {currentTab.label}
          </Button>
        </>
        )}

      </Card>
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
              {t('liquidity:Token A Locked')}
              <Tooltip
                sizeT="small"
                content={t('liquidity:The amount of token A that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.')}
              />
            </>
      )}
          className={s.cell}
        >
          <CurrencyAmount
            amount={(values.balanceTotalA ?? 0).toString()}
            currency={getWhitelistedTokenSymbol(tokenPair.token1)}
          />
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
          <CurrencyAmount
            amount={(values.balanceTotalB ?? 0).toString()}
            currency={getWhitelistedTokenSymbol(tokenPair.token2)}
          />
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
          <CurrencyAmount amount={(poolShare?.total.toString()) ?? '0'} />
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
          <CurrencyAmount amount={(poolShare?.frozen.toString()) ?? '0'} />
        </CardCell>
        <div className={s.detailsButtons}>
          <Button
            className={s.detailsButton}
            theme="inverse"
            href={`https://analytics.quipuswap.com/pairs/${removeLiquidityParams.find((x) => x.parameter?.entrypoint === 'divestLiquidity')?.to}`}
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
    </>
  );
};

const AutoSave = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={Header} />
);

const fallbackTokenPair : WhitelistedTokenPair = {
  token1: TEZOS_TOKEN,
  token2: TEZOS_TOKEN,
  dex: null,
};

export const Liquidity: React.FC<LiquidityProps> = ({
  className,
}) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const exchangeRates = useExchangeRates();
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
  const [
    tokenPair,
    setTokenPair,
  ] = useState<WhitelistedTokenPair>(fallbackTokenPair);

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
            tokenPair={tokenPair}
            setToken1={setToken1}
            setToken2={setToken2}
            setTokenPair={setTokenPair}
            tokensData={tokensData}
            handleTokenChange={handleTokenChange}
            currentTab={currentTab}
          />
        )}
      />
    </StickyBlock>

  );
};
