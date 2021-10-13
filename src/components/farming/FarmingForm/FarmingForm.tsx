import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import cx from 'classnames';
import { Field, FormSpy } from 'react-final-form';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import {
  estimateTezInShares, estimateTokenInShares, findDex, FoundDex, getLiquidityShare,
} from '@quipuswap/sdk';

import {
  useAccountPkh, useNetwork, useOnBlock, useTezos,
} from '@utils/dapp';
import {
  composeValidators, required, validateBalance, validateMinMax,
} from '@utils/validators';
import { fromDecimals, getWhitelistedTokenAddress, parseDecimals } from '@utils/helpers';
import {
  FarmingFormValues, PoolShare, QSMainNet, WhitelistedFarm, WhitelistedToken, WhitelistedTokenPair,
} from '@utils/types';
import { FACTORIES } from '@utils/defaults';
import useUpdateToast from '@hooks/useUpdateToast';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { ComplexBaker, ComplexInput } from '@components/ui/ComplexInput';
import { StickyBlock } from '@components/common/StickyBlock';
import { FarmingDetails } from '@components/farming/FarmingDetails';
// import { Transactions } from '@components/svg/Transactions';

import s from './FarmingForm.module.sass';

type FarmingFormProps = {
  form:any
  farm: WhitelistedFarm
  amount: string
  balance?: string
  tokenPair: WhitelistedTokenPair
  values: FarmingFormValues
  save:any
  debounce:number
  currentTab: any
  tabsState: any
  setTabsState: (val: any) => void
  handleSubmit: () => void
};

export const TabsContent = [
  {
    id: 'stake',
    label: 'Stake',
  },
  {
    id: 'unstake',
    label: 'Unstake',
  },
];

const RealForm:React.FC<FarmingFormProps> = ({
  tokenPair,
  form,
  values,
  save,
  debounce,
  handleSubmit,
  currentTab,
  setTabsState,
  tabsState,
  farm,
}) => {
  const { t } = useTranslation(['common', 'farms']);
  const tezos = useTezos();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const accountPkh = useAccountPkh();
  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const [dex, setDex] = useState<FoundDex>();
  const [, setOldDex] = useState<FoundDex>();
  const [poolShare, setPoolShare] = useState<PoolShare>();

  const {
    openConnectWalletModal,
    connectWalletModalOpen,
    closeConnectWalletModal,
  } = useConnectModalsState();

  const updateToast = useUpdateToast();
  const handleErrorToast = useCallback((err) => {
    updateToast({
      type: 'error',
      render: `${err.name}: ${err.message}`,
    });
  }, [updateToast]);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const handleInputChange = async () => {
    if (!tezos) return;
    if (tezos && tokenPair) {
      const toAsset = {
        contract: tokenPair.token2.contractAddress,
        id: tokenPair.token2.fa2TokenId ?? undefined,
      };
      try {
        const tempDex = await findDex(tezos, FACTORIES[networkId], toAsset);
        if (tempDex && tempDex !== dex) {
          setDex(tempDex);
        }
      } catch (e) {
        handleErrorToast(e);
      }
    }
  };

  const getDex = useCallback(async () => {
    if (!tezos || !tokenPair) return;
    setDex(undefined);
    setOldDex(undefined);
    const toAsset = {
      contract: tokenPair.token2.contractAddress,
      id: tokenPair.token2.fa2TokenId ?? undefined,
    };
    const dexbuf = await findDex(tezos, FACTORIES[networkId], toAsset);
    setDex(dexbuf);
    try {
      const getMethod = async (
        token:WhitelistedToken,
        foundDex:FoundDex,
        value:BigNumber,
      ) => (token.contractAddress === 'tez'
        ? estimateTezInShares(foundDex.storage, value.toString())
        : estimateTokenInShares(foundDex.storage, value.toString()));

      if (!accountPkh) return;
      const share = await getLiquidityShare(tezos, dexbuf, accountPkh);
      setPoolShare(share);
      const balanceAB = share.total;
      const sharesTotalA = await getMethod(
        tokenPair.token1,
        dexbuf,
        balanceAB.integerValue(),
      );
      const sharesTotalB = await getMethod(
        tokenPair.token2,
        dexbuf,
        balanceAB.integerValue(),
      );
      const balA1 = fromDecimals(sharesTotalA, 6).toString();
      const balA2 = fromDecimals(sharesTotalB, 6).toString();
      form.mutators.setValue(
        'balanceTotalA',
        balA1,
      );

      form.mutators.setValue(
        'balanceTotalB',
        balA2,
      );
    } catch (err) {
      handleErrorToast(err);
    }
  }, [tokenPair, tezos, networkId, accountPkh, form.mutators, handleErrorToast]);

  useEffect(() => {
    setPoolShare(undefined);
    form.mutators.setValue(
      'balanceTotalA',
      0,
    );

    form.mutators.setValue(
      'balanceTotalB',
      0,
    );
    getDex();
  }, [tokenPair, tezos, networkId, accountPkh, form.mutators, getDex]);

  const saveFunc = async () => {
    if (promise) {
      await promise;
    }
    setVal(values);
    setSubm(true);
    handleInputChange();
    promise = save(values);
    await promise;
    setSubm(false);
  };

  useEffect(() => {
    if (connectWalletModalOpen && accountPkh) {
      closeConnectWalletModal();
    }
    // eslint-disable-next-line
  }, [accountPkh, closeConnectWalletModal]);

  const handleSwapSubmit = async () => {
    if (!tezos) return;
    if (!accountPkh) {
      openConnectWalletModal(); return;
    }
    handleSubmit();
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
    // eslint-disable-next-line
  }, [
    values.selectedBaker,
    values.balance3,
    tokenPair,
    dex,
    currentTab]);

  useOnBlock(tezos, getDex);

  return (

    <StickyBlock>
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
          // button: (
          //   <Button
          //     theme="quaternary"
          //   >
          //     <Transactions />
          //   </Button>
          // ),
          className: s.header,
        }}
        contentClassName={s.content}
      >
        <Field
          name="balance3"
          validate={composeValidators(
            validateMinMax(0, Infinity),
            required,
            currentTab.id === 'stake'
              ? validateBalance(fromDecimals(new BigNumber(poolShare?.unfrozen ?? '0'), 6))
              : validateBalance(fromDecimals(farm.deposit, 6))
            ,
          )}
          parse={(v) => parseDecimals(v, 0, Infinity, 6)}
        >
          {({ input, meta }) => (
            <>
              <ComplexInput
                {...input}
                token1={tokenPair.token1}
                token2={tokenPair.token2}
                handleBalance={(value) => {
                  form.mutators.setValue(
                    'balance3',
                    +value,
                  );
                }}
                balance={
                  currentTab.id === 'stake'
                    ? fromDecimals(new BigNumber(poolShare?.unfrozen ?? '0'), 6).toString()
                    : fromDecimals(farm.deposit, 6).toString()
                }
                balanceLabel={t('farms|Available Balance')}
                id="voting-input"
                label={t('farms|Amount')}
                className={cx(s.input, s.mb24)}
                mode="farm"
                error={((meta.touched && meta.error) || meta.submitError)}
              />
            </>
          )}
        </Field>
        {currentTab.id === 'stake' && (
          <Field name="selectedBaker" validate={required}>
            {({ input, meta }) => (
              <ComplexBaker
                {...input}
                label="Baker"
                id="voting-baker"
                className={s.mt12}
                handleChange={(bakerObj) => {
                  input.onChange(bakerObj.address);
                }}
                error={(meta.touched && meta.error) || meta.submitError}
              />
            )}

          </Field>
        )}
        <div className={s.tradeControls}>
          <Button
            theme="underlined"
            className={s.tradeBtn}
            href={`/swap/${getWhitelistedTokenAddress(tokenPair.token1)}-${getWhitelistedTokenAddress(tokenPair.token2)}`}
          >
            {t('farms|Trade')}
          </Button>
          {currentTab.id === 'stake' ? (
            <Button
              theme="underlined"
              className={s.tradeBtn}
              href={`/liquidity/add/${getWhitelistedTokenAddress(tokenPair.token1)}-${getWhitelistedTokenAddress(tokenPair.token2)}`}
            >
              {t('farms|Invest')}
            </Button>
          ) : (
            <Button
              theme="underlined"
              className={s.tradeBtn}
              href={`/liquidity/remove/${getWhitelistedTokenAddress(tokenPair.token1)}-${getWhitelistedTokenAddress(tokenPair.token2)}`}
            >
              {t('farms|Divest')}
            </Button>
          )}
        </div>
        <div className={s.buttons}>
          <Button onClick={handleSwapSubmit} className={s.button}>
            {currentTab.label}
          </Button>
        </div>
      </Card>
      <FarmingDetails
        farm={farm}
        dex={dex}
      />
    </StickyBlock>
  );
};

export const FarmingForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
