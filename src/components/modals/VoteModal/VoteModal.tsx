import React, {
  useContext, useEffect, useRef, useState, useCallback,
} from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { Field, FormSpy, withTypes } from 'react-final-form';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import {
  batchify, fromOpOpts, Token, withTokenApprove,
} from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';

import useUpdateToast from '@hooks/useUpdateToast';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import { useExchangeRates } from '@hooks/useExchangeRate';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { STABLE_TOKEN, STABLE_TOKEN_GRANADA } from '@utils/defaults';
import { TokenDataMap, WhitelistedToken } from '@utils/types';
import {
  useAccountPkh, useGovernanceContract, useNetwork, useOnBlock, useTezos,
} from '@utils/dapp';
import {
  fallbackTokenToTokenData, handleTokenChange, parseDecimals, toDecimals,
} from '@utils/helpers';
import {
  composeValidators, required, validateBalance, validateMinMax,
} from '@utils/validators';
import { Radio } from '@components/ui/Radio';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { ComplexInput } from '@components/ui/ComplexInput';
import Vote from '@icons/Vote.svg';
import For from '@icons/For.svg';
import ForInactive from '@icons/ForInactive.svg';
import NotFor from '@icons/NotFor.svg';
import NotForInactive from '@icons/NotForInactive.svg';

import s from './VoteModal.module.sass';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type VoteModalProps = {
  onChange: (token: WhitelistedToken) => void
} & ReactModal.Props;

type HeaderProps = {
  debounce:number,
  save:any,
  values:FormValues,
  form:any,
  tokensData: TokenDataMap,
};

type FormValues = {
  balance:string
  voteFor:boolean
  voteAgainst:boolean
};

type SubmitType = {
  tezos: TezosToolkit,
  fromAsset: Token
  accountPkh: string,
  govContract: any,
  proposalId: number,
  voteFor: boolean,
  voteAmount: BigNumber
  handleErrorToast: (error:any) => void
  handleSuccessToast: () => void
};

const submitProposal = async ({
  tezos,
  fromAsset,
  accountPkh,
  govContract,
  proposalId,
  voteFor,
  voteAmount,
  handleSuccessToast,
  handleErrorToast,
}: SubmitType) => {
  try {
    const govParams = await withTokenApprove(
      tezos,
      fromAsset,
      accountPkh,
      govContract.address,
      0,
      [
        govContract.methods
          .vote(proposalId, voteFor ? 'for' : 'against', voteAmount)
          .toTransferParams(fromOpOpts(undefined, undefined)),
      ],
    );
    const op = await batchify(
      tezos.wallet.batch([]),
      govParams,
    ).send();
    await op.confirmation();
    handleSuccessToast();
  } catch (e) {
    handleErrorToast(e);
  }
};

const Header:React.FC<HeaderProps> = ({
  debounce, save, values, form, tokensData,
}) => {
  const accountPkh = useAccountPkh();
  const [, setVal] = useState(values);
  const [, setSubm] = useState<boolean>(false);
  const { t } = useTranslation(['vote']);

  const timeout = useRef(setTimeout(() => {}, 0));
  let promise:any;

  const saveFunc = async () => {
    if (promise) {
      await promise;
    }
    setVal(values);
    setSubm(true);
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
  }, [values]);

  return (
    <div className={s.inputs}>
      <Vote className={s.icon} />
      <div className={s.tac}>
        {t('vote|Stake your QUIPU to vote for or against the governance proposal. During the voting process, all tokens will be frozen. You may claim your QUIPU back only after the voting is finished.')}
      </div>
      <Field
        name="balance"
        validate={composeValidators(
          required,
          validateMinMax(0, Infinity),
          accountPkh
            ? validateBalance(new BigNumber(tokensData.first.balance))
            : () => undefined,
        )}
        parse={(v) => parseDecimals(v, 0, Infinity, tokensData.first.token.decimals)}
      >
        {({ input, meta }) => (
          <ComplexInput
            withoutSelect
            balance={tokensData.first.balance}
            token1={{} as WhitelistedToken}
            id="voteModal-1"
            label="Votes"
            className={cx(s.input, s.mb24)}
            handleBalance={(value) => {
              form.mutators.setValue(
                'balance',
                +value,
              );
            }}
            noDollar
            {...input}
            error={(meta.touched && meta.error) || meta.submitError}
          />
        )}
      </Field>
      <Field
        name="voteFor"
        initialValue="true"
        type="radio"
      >
        {() => (
          <Radio
            onClick={() => {
              form.mutators.setValue(
                'voteAgainst',
                false,
              );
              form.mutators.setValue(
                'voteFor',
                true,
              );
            }}
            active={values.voteFor ?? false}
            label="For"
            icon={values.voteFor ? <For /> : <ForInactive />}
          />
        )}
      </Field>
      <Field
        name="voteAgainst"
        type="radio"
      >
        {() => (
          <Radio
            onClick={() => {
              form.mutators.setValue(
                'voteFor',
                false,
              );
              form.mutators.setValue(
                'voteAgainst',
                true,
              );
            }}
            active={values.voteAgainst ?? false}
            label="Against"
            icon={values.voteAgainst ? <NotFor /> : <NotForInactive />}
            className={s.mtop16}
          />
        )}
      </Field>
    </div>
  );
};

const AutoSave = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={Header} />
);

export const VoteModal: React.FC<VoteModalProps> = ({
  onChange,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation(['common', 'governance']);
  const updateToast = useUpdateToast();
  const {
    openConnectWalletModal,
  } = useConnectModalsState();
  const router = useRouter();
  const exchangeRates = useExchangeRates();
  const tezos = useTezos();
  const accountPkh = useAccountPkh();
  const network = useNetwork();
  const currentToken = network.id === 'granadanet' ? STABLE_TOKEN_GRANADA : STABLE_TOKEN;
  const { Form } = withTypes<FormValues>();
  const govContract = useGovernanceContract();
  const [tokensData, setTokensData] = useState<TokenDataMap>(
    {
      first: fallbackTokenToTokenData(currentToken),
      second: fallbackTokenToTokenData(STABLE_TOKEN),
    },
  );

  const handleErrorToast = useCallback((err) => {
    updateToast({
      type: 'error',
      render: `${err.name}: ${err.message}`,
    });
  }, [updateToast]);

  const handleLoader = useCallback(() => {
    updateToast({
      type: 'info',
      render: t('common|Loading'),
    });
  }, [updateToast, t]);

  const handleSuccessToast = useCallback(() => {
    updateToast({
      type: 'success',
      render: t('governance|Vote submitted!'),
    });
  }, [updateToast, t]);

  const handleTokenChangeWrapper = (
    token: WhitelistedToken,
    tokenNumber: 'first' | 'second',
  ) => handleTokenChange({
    token,
    tokenNumber,
    exchangeRates,
    tezos: tezos!,
    accountPkh: accountPkh!,
    setTokensData,
  });

  const getBalance = useCallback(() => {
    if (tezos) {
      handleTokenChangeWrapper(currentToken, 'first');
    }
  }, [tezos, accountPkh, network.id]);

  useEffect(() => {
    getBalance();
  }, [tezos, accountPkh, network.id]);

  useOnBlock(tezos, getBalance);

  const handleInput = () => {
    // TODO
  };

  return (
    <Form
      initialValues={{
        voteFor: true,
      }}
      onSubmit={(values) => {
        if (!tezos || !accountPkh) return;
        handleLoader();
        submitProposal({
          tezos,
          accountPkh,
          fromAsset: {
            contract: currentToken.contractAddress,
            id: 0,
          },
          govContract,
          proposalId: Number(router.query.proposal),
          voteFor: values.voteFor,
          voteAmount: toDecimals(new BigNumber(values.balance), tokensData.first.token.decimals),
          handleErrorToast,
          handleSuccessToast,
        });
      }}
      mutators={{
        setValue: ([field, value], state, { changeValue }) => {
          changeValue(state, field, () => value);
        },
      }}
      render={({ form, handleSubmit }) => (
        <Modal
          title={t('common:Vote')}
          header={(
            <AutoSave
              form={form}
              tokensData={tokensData}
              debounce={1000}
              save={handleInput}
            />
          )}
          className={themeClass[colorThemeMode]}
          cardClassName={cx(s.maxHeight)}
          contentClassName={cx(s.content, s.tokenModal)}
          {...props}
        >
          <Button
            className={s.button}
            onClick={() => {
              if (!tezos) return;
              if (!accountPkh) {
                openConnectWalletModal(); return;
              }
              handleSubmit();
            }}
          >
            {t('governance|Vote')}
          </Button>
        </Modal>

      )}
    />
  );
};
