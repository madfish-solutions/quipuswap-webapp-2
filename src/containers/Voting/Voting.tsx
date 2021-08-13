import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { withTypes, Field, FormSpy } from 'react-final-form';
import {
  batchify,
  estimateReward,
  findDex,
  getLiquidityShare,
  Token,
  TransferParams,
  vetoCurrentBaker,
  voteForBaker,
} from '@quipuswap/sdk';

import {
  useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
// import { useExchangeRates } from '@hooks/useExchangeRate';
import { WhitelistedBaker, WhitelistedTokenPair } from '@utils/types';
import { Tooltip } from '@components/ui/Tooltip';
import { FACTORIES, TEZOS_TOKEN } from '@utils/defaults';
import { ComplexBaker } from '@components/ui/ComplexInput';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { StickyBlock } from '@components/common/StickyBlock';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Transactions } from '@components/svg/Transactions';
import { ArrowDown } from '@components/svg/ArrowDown';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';

const TabsContent = [
  {
    id: 'vote',
    label: 'Vote',
  },
  {
    id: 'veto',
    label: 'Veto',
  },
];

type VotingProps = {
  className?: string
};

type FormValues = {
  voteBalance: number
  vetoBalance: number
};

type HeaderProps = {
  debounce:number,
  save:any,
  values:FormValues,
  form:any,
  tabsState:any,
  tokenPair: WhitelistedTokenPair,
  setTokenPair: (pair:WhitelistedTokenPair) => void,
  baker: WhitelistedBaker,
  setBaker: (baker:WhitelistedBaker) => void,
  currentTab:any,
  setTabsState:(val:any) => void
};

type QSMainNet = 'mainnet' | 'florencenet';

const Header:React.FC<HeaderProps> = ({
  debounce,
  save,
  values,
  form,
  tabsState,
  tokenPair,
  setTokenPair,
  baker,
  setBaker,
  currentTab,
  setTabsState,
}) => {
  const { t } = useTranslation(['vote']);
  const tezos = useTezos();
  const networkId: QSMainNet = useNetwork().id as QSMainNet;
  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const accountPkh = useAccountPkh();
  // const [removeLiquidityParams, setRemoveLiquidityParams] = useState<TransferParams[]>([]);
  const [removeLiquidityParams] = useState<TransferParams[]>([]);
  // const [poolShare, setPoolShare] = useState<
  // { unfrozen:BigNumber, frozen:BigNumber, total:BigNumber }
  // >();

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  // const handleInputChange = async () => {
  //   if (tezos) {
  //     if (currentTab.id === 'remove') {
  //       console.log('rem');
  //     } else {
  //       try {
  //         // TODO
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   }
  // };

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

  const asyncGetLiquidityShare = async () => {
    if (!tezos || !accountPkh) return;
    try {
      const account = accountPkh;
      const toAsset = {
        contract: tokenPair.token2.contractAddress,
        id: tokenPair.token2.fa2TokenId,
      };
      const dex = await findDex(tezos, FACTORIES[networkId], toAsset);
      // const share = await getLiquidityShare(tezos, dex, account);

      // const lpTokenValue = share.total;
      // const paramsValue = await removeLiquidity(
      //   tezos,
      //   dex,
      //   lpTokenValue,
      //   slippageTolerance,
      // );
      // console.log(share);
      // console.log(paramsValue);
      // setPoolShare(share);
      // setRemoveLiquidityParams(paramsValue);
      // asyncGetShares(share.total);
      const rewards = estimateReward(tezos, dex, account);
      console.log(rewards);
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
    // handleInputChange(values);
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
  }, [values, tokenPair, baker]);

  const handleUnvote = async () => {
    if (!tezos) return;
    try {
      const toAsset = tokenPair.token2.contractAddress ? 'tez' : {
        contract: tokenPair.token2.contractAddress,
        id: tokenPair.token2.fa2TokenId,
      };
      const dex = await findDex(tezos, FACTORIES[networkId], toAsset as Token);

      const addLiquidityParams = await voteForBaker(
        tezos,
        dex,
        baker.address,
        0,
      );
      console.log(addLiquidityParams);
      const op = await batchify(
        tezos.wallet.batch([]),
        addLiquidityParams,
      ).send();
      await op.confirmation();
    } catch (e) {
      console.error(e);
    }
  };

  const handleVote = async () => {
    if (!tezos) return;
    try {
      const toAsset = tokenPair.token2.contractAddress ? 'tez' : {
        contract: tokenPair.token2.contractAddress,
        id: tokenPair.token2.fa2TokenId,
      };
      const dex = await findDex(tezos, FACTORIES[networkId], toAsset as Token);

      const addLiquidityParams = await voteForBaker(
        tezos,
        dex,
        baker.address,
        values.voteBalance,
      );
      console.log(addLiquidityParams);
      const op = await batchify(
        tezos.wallet.batch([]),
        addLiquidityParams,
      ).send();
      await op.confirmation();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveVeto = async () => {
    if (!tezos) return;
    try {
      const toAsset = tokenPair.token2.contractAddress ? 'tez' : {
        contract: tokenPair.token2.contractAddress,
        id: tokenPair.token2.fa2TokenId,
      };
      const dex = await findDex(tezos, FACTORIES[networkId], toAsset as Token);

      const addLiquidityParams = await vetoCurrentBaker(
        tezos,
        dex,
        0,
      );
      console.log(addLiquidityParams);
      const op = await batchify(
        tezos.wallet.batch([]),
        addLiquidityParams,
      ).send();
      await op.confirmation();
    } catch (e) {
      console.error(e);
    }
  };

  const handleVeto = async () => {
    if (!tezos) return;
    try {
      const toAsset = tokenPair.token2.contractAddress ? 'tez' : {
        contract: tokenPair.token2.contractAddress,
        id: tokenPair.token2.fa2TokenId,
      };
      const dex = await findDex(tezos, FACTORIES[networkId], toAsset as Token);

      const addLiquidityParams = await vetoCurrentBaker(
        tezos,
        dex,
        values.vetoBalance,
      );
      console.log(addLiquidityParams);
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
        {currentTab.id === 'vote' && (
        <Field
          name="voteBalance"
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
                    'voteBalance',
                    +value,
                  );
                }}
                balance={tokenPair.balance}
                frozenBalance={tokenPair.frozenBalance}
                id="vote-input"
                label="Select LP"
                className={s.input}
              />
              <ArrowDown className={s.iconButton} />
            </>
          )}
        </Field>
        )}
        {currentTab.id !== 'vote' && (
        <Field
          name="vetoBalance"
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
                    'vetoBalance',
                    +value,
                  );
                }}
                balance={tokenPair.balance}
                frozenBalance={tokenPair.frozenBalance}
                id="veto-input"
                label="Select LP"
                className={s.input}
              />
              <ArrowDown className={s.iconButton} />
            </>
          )}
        </Field>
        )}
        {currentTab.id === 'vote' && (
        <ComplexBaker
          handleChange={(b:WhitelistedBaker) => {
            setBaker(b);
          }}
          label="Baker"
          id="voting-baker"
        />
        )}
        {currentTab.id === 'vote' && (
        <div className={s.buttons}>
          <Button theme="secondary" onClick={handleUnvote} className={s.button}>
            Unvote
          </Button>
          <Button onClick={handleVote} className={s.button}>
            {currentTab.label}
          </Button>
        </div>
        )}

        {currentTab.id === 'veto' && (
        <div className={s.buttons}>
          <Button theme="secondary" onClick={handleRemoveVeto} className={s.button}>
            Remove veto
          </Button>
          <Button onClick={handleVeto} className={s.button}>
            {currentTab.label}
          </Button>
        </div>
        )}

      </Card>
      <Card
        header={{
          content: 'Voting Details',
        }}
        contentClassName={s.content}
      >
        <CardCell
          header={(
            <>
              {t('vote:Delegated To')}
              <Tooltip
                sizeT="small"
                content={t('vote:Current baker elected by simple majority of votes.')}
              />
            </>
          )}
          className={s.cell}
        >
          <Button theme="underlined">
            Everstake
          </Button>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('vote:Second Candidate')}
              <Tooltip
                sizeT="small"
                content={t('vote:The candidate who garnered second largest number of votes. If the current baker gets vetoed, the second candidate will assume his place.')}
              />
            </>
          )}
          className={s.cell}
        >
          <Button theme="underlined">
            Bake’n’Roll
          </Button>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('veto:Total Votes')}
              <Tooltip
                sizeT="small"
                content={t('vote:The total amount of votes cast to elect a baker in the pool.')}
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
              {t('veto:Total Vetos')}
              <Tooltip
                sizeT="small"
                content={t('vote:The total amount of shares cast so far to veto the current baker.')}
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
              {t('veto:Your Candidate')}
              <Tooltip
                sizeT="small"
                content={t('vote:The candidate you voted for.')}
              />
            </>
          )}
          className={s.cell}
        >
          <Button theme="underlined">
            Bake’n’Roll
          </Button>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('Votes To Veto Left')}
              <Tooltip
                sizeT="small"
                content={t('vote:This much more votes needed to veto a delegate.')}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="1000000" />
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
            View Delegation Analytics
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

const fallbackTokenPair = {
  token1: TEZOS_TOKEN,
  token2: TEZOS_TOKEN,
} as WhitelistedTokenPair;

export const Voting: React.FC<VotingProps> = ({
  className,
}) => {
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes

  const { Form } = withTypes<FormValues>();
  const [baker, setBaker] = useState<WhitelistedBaker>();
  const [
    tokenPair,
    setTokenPair,
  ] = useState<WhitelistedTokenPair>(fallbackTokenPair);

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

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
            tokenPair={tokenPair}
            setTokenPair={setTokenPair}
            baker={baker}
            setBaker={setBaker}
            currentTab={currentTab}
          />
        )}
      />
    </StickyBlock>
  );
};
