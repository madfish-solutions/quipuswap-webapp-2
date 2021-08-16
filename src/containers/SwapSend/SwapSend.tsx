import React, {
  useMemo, useState, useEffect, useRef,
} from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import {
  swap, batchify,
} from '@quipuswap/sdk';
import { withTypes, Field, FormSpy } from 'react-final-form';
import { useTranslation } from 'next-i18next';

import { useConnectModalsState } from '@hooks/useConnectModalsState';
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
  composeValidators, isAddress, validateBalance, validateMinMax,
} from '@utils/validators';
import {
  getWhitelistedTokenSymbol,
  isTokenEqual,
  localSearchToken,
  parseDecimals,
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
import { useRouter } from 'next/router';

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
  handleSubmit:() => void,
  debounce:number,
  save:any,
  values:any,
  form:any,
  tabsState:any,
  setTabsState: (state:string) => void,
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
  handleSubmit,
}) => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const { openConnectWalletModal } = useConnectModalsState();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [formValues, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const [lastChange, setLastChange] = useState<'balance1' | 'balance2'>('balance1');

  useEffect(() => {
    form.mutators.setValue('balance1', undefined);
    form.mutators.setValue('balance2', undefined);
  }, [networkId]);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const handleInputChange = async (val: FormValues) => {
    const currentTokenA = tokenDataToToken(tokensData.first);
    const currentTokenB = tokenDataToToken(tokensData.second);
    const isTokensSame = isTokenEqual(currentTokenA, currentTokenB);
    const isValuesSame = val[lastChange] === formValues[lastChange];
    if (isTokensSame || (isValuesSame) || token1 === undefined || token2 === undefined) return;
    if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) return;
    const rate = (+tokensData.first.exchangeRate) / (+tokensData.second.exchangeRate);
    const retValue = lastChange === 'balance1' ? (val.balance1) * rate : (val.balance2) / rate;
    const decimals = lastChange === 'balance1' ? token1.metadata.decimals : token2.metadata.decimals;

    form.mutators.setValue(
      lastChange === 'balance1' ? 'balance2' : 'balance1',
      parseDecimals(
        retValue.toString(),
        0,
        Infinity,
        decimals,
      ),
    );
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
    if (!accountPkh) {
      openConnectWalletModal(); return;
    }
    handleSubmit();
  };

  const blackListedTokens = useMemo(
    () => [...(token1 ? [token1] : []), ...(token2 ? [token2] : [])],
    [token1, token2],
  );

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
        validate={composeValidators(
          validateMinMax(0, Infinity),
          validateBalance(+tokensData.first.balance),
        )}
        parse={(v) => token1?.metadata && parseDecimals(v, 0, Infinity, token1.metadata.decimals)}
        name="balance1"
      >
        {({ input, meta }) => (
          <TokenSelect
            {...input}
            blackListedTokens={blackListedTokens}
            onFocus={() => setLastChange('balance1')}
            token={token1}
            setToken={setToken1}
            handleBalance={(value) => {
              if (token1) {
                form.mutators.setValue(
                  'balance1',
                  +parseDecimals(value, 0, Infinity, token1.metadata.decimals),
                );
              }
            }}
            handleChange={(token) => handleTokenChange(token, 'first')}
            balance={tokensData.first.balance}
            exchangeRate={tokensData.first.exchangeRate}
            id="swap-send-from"
            label="From"
            className={s.input}
            error={((lastChange === 'balance1' && meta.touched && meta.error) || meta.submitError)}
          />
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
        validate={composeValidators(
          validateMinMax(0, Infinity),
          validateBalance(+tokensData.second.balance),
        )}
        parse={(v) => parseDecimals(v, 0, Infinity)}
        name="balance2"
      >
        {({ input, meta }) => (
          <TokenSelect
            {...input}
            blackListedTokens={blackListedTokens}
            onFocus={() => setLastChange('balance2')}
            token={token2}
            setToken={setToken2}
            handleBalance={(value) => {
              if (token2) {
                form.mutators.setValue(
                  'balance2',
                  +parseDecimals(
                    value,
                    0,
                    Infinity,
                    token2 ? token2.metadata.decimals : undefined,
                  ),
                );
              }
            }}
            handleChange={(token) => handleTokenChange(token, 'second')}
            balance={tokensData.second.balance}
            exchangeRate={tokensData.second.exchangeRate}
            id="swap-send-to"
            label="To"
            className={cx(s.input, s.mb24)}
            error={((lastChange === 'balance2' && meta.touched && meta.error) || meta.submitError)}
          />
        )}
      </Field>
      <Field
        validate={isAddress}
        name="recipient"
      >
        {({ input, meta }) => {
          if (currentTab.id === 'send') {
            return (
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
                error={((meta.touched && meta.error) || meta.submitError)}
              />
            );
          }
          return '';
        }}
      </Field>
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
                  currency={token2 ? getWhitelistedTokenSymbol(token2) : ''}
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
      first: fallbackTokensData,
      second: fallbackTokensData,
    },
  );

  const { Form } = withTypes<FormValues>();
  const [[token1, token2], setTokens] = useState<WhitelistedToken[]>([]);

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
        onSubmit={(values: FormValues) => {
          if (!tezos) return;
          const asyncFunc = async () => {
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
          <AutoSave
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
