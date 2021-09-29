import React, {
  useContext, useState, useEffect, useCallback, useMemo,
} from 'react';
import cx from 'classnames';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import {
  DayPickerRangeController,
} from 'react-dates';
import moment, { Moment } from 'moment';
import { TezosToolkit } from '@taquito/taquito';
import {
  batchify, fromOpOpts, Token, withTokenApprove,
} from '@quipuswap/sdk';
import { useTranslation } from 'next-i18next';

import useUpdateToast from '@hooks/useUpdateToast';
import { useGovernance } from '@hooks/useGovernance';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import {
  getContract,
  useAccountPkh, useGovernanceContract, useNetwork, useTezos,
} from '@utils/dapp';
import {
  GOVERNANCE_CONTRACT_MAINNET,
  GOVERNANCE_CONTRACT_TESTNET,
  GOVERNANCE_TOKEN_MAINNET, GOVERNANCE_TOKEN_TESTNET, STABLE_TOKEN,
} from '@utils/defaults';
import { prepareIpfsLink } from '@utils/helpers';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Back } from '@components/svg/Back';
import { Markdown } from '@components/ui/Markdown';
import DateIcon from '@icons/DateIcon.svg';

import s from './GovernanceCard.module.sass';

type GovernanceFormProps = {
  className?: string
  onClick?: () => void
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const initialDates = [moment(Date.now()), moment(Date.now() + 48 * 3600000)];

type SubmitType = {
  tezos: TezosToolkit,
  fromAsset: Token
  accountPkh: string,
  govContract: any,
  ipfsLink: string,
  forumLink: string,
  githubLink: string,
  votingPeriod: number,
  deferral: number,
  handleErrorToast: (error:any) => void
  handleSuccessToast: () => void
};

const submitProposal = async ({
  tezos,
  fromAsset,
  accountPkh,
  govContract,
  ipfsLink,
  forumLink,
  githubLink,
  votingPeriod,
  deferral,
  handleErrorToast,
  handleSuccessToast,
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
          .new_proposal(ipfsLink, forumLink, githubLink, votingPeriod, deferral)
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

const ASCIItoHex = (str:string) => {
  const arr1 = [];
  for (let n = 0, l = str.length; n < l; n++) {
    const hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join('');
};

export const GovernanceForm: React.FC<GovernanceFormProps> = ({
  className,
}) => {
  const { t } = useTranslation(['common', 'governance']);
  const tezos = useTezos();
  const network = useNetwork();
  const accountPkh = useAccountPkh();
  const updateToast = useUpdateToast();
  const governanceContract = useGovernanceContract();
  const { totalSupply } = useGovernance();
  const {
    openConnectWalletModal,
  } = useConnectModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [govContract, setGovContract] = useState<any>();
  const [description, setDescription] = useState<string>('');
  const [forumLink, setForumLink] = useState<string>('');
  const [githubLink, setGithubLink] = useState<string>('');
  const [[votingStart, votingEnd], setVotingDates] = useState<Moment[]>(initialDates);
  const [votingInput, setVotingInput] = useState<any>(initialDates);
  const [{ loadedDescription, isLoaded }, setLoadedDescription] = useState({ loadedDescription: '', isLoaded: false });
  const [isPicker, showPicker] = useState<boolean>(false);

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
      render: t('governance|Proposal submitted!'),
    });
  }, [updateToast, t]);

  useEffect(() => {
    const loadDescription = () => {
      const url = prepareIpfsLink(description);
      if (!url) return;
      fetch(url).then((x) => x.text()).then((x) => {
        setLoadedDescription({ loadedDescription: x, isLoaded: true });
      });
    };
    if (description !== '' && description.startsWith('ipfs://')) { loadDescription(); }
  }, [description]);

  useEffect(() => {
    const loadDex = async () => {
      if (!tezos) return;
      if (!network) return;
      const contract = await getContract(tezos, network.id === 'mainnet' ? GOVERNANCE_CONTRACT_MAINNET : GOVERNANCE_CONTRACT_TESTNET);
      setGovContract(contract);
    };
    loadDex();
  }, [tezos, network]);

  const handleSubmit = useCallback(() => {
    if (!tezos) {
      updateToast({
        type: 'error',
        render: t('governance|Tezos not loaded'),
      });
      return;
    }
    if (!govContract) {
      updateToast({
        type: 'error',
        render: t('governance|Contract not loaded'),
      });
      return;
    }
    if (!accountPkh) {
      openConnectWalletModal(); return;
    }
    const fromAsset = network.type === 'test' ? GOVERNANCE_TOKEN_TESTNET : GOVERNANCE_TOKEN_MAINNET;
    handleLoader();
    const deferral = votingStart.toDate().getTime() - Date.now() < 0
      ? 0
      : Math.round((votingStart.toDate().getTime() - Date.now()) / 1000);
    const votingPeriod = Math.round((votingEnd.toDate().getTime() - Date.now()) / 1000);
    submitProposal({
      tezos,
      accountPkh,
      fromAsset,
      govContract,
      ipfsLink: ASCIItoHex(description),
      forumLink: ASCIItoHex(forumLink),
      githubLink: ASCIItoHex(githubLink),
      deferral,
      votingPeriod,
      handleErrorToast,
      handleSuccessToast,
    });
  }, [
    tezos,
    accountPkh,
    network,
    govContract,
    description,
    forumLink,
    githubLink,
    votingStart,
    votingEnd,
  ]);

  const PROPOSAL_COST = useMemo(() => (governanceContract && totalSupply
    ? governanceContract.proposal_config.proposal_stake
      .dividedBy(governanceContract.accuracy)
      .multipliedBy(totalSupply)
      .toString()
    : '—.—'),
  [governanceContract, totalSupply]);

  const compountClassName = cx(
    modeClass[colorThemeMode],
    s.fullWidth,
    s.mb24i,
    s.govBody,
    className,
  );
  return (
    <Card
      className={compountClassName}
    >
      <CardHeader header={{
        content: (
          <Button
            href="/governance"
            theme="quaternary"
            className={s.proposalButton}
            control={
              <Back className={s.proposalBackIcon} />
            }
          >
            {t('governance|Back')}
          </Button>
        ),
      }}
      />
      <CardHeader
        header={{
          content: (
            <div className={s.submitFlex}>
              <div className={s.submitHeader}>
                <h3 className={s.govName}>
                  {t('governance|Submit proposal')}
                </h3>
              </div>
              <div className={cx(s.govSubmitGroup, s.desktopBlock)}>
                <div>
                  {t('governance|Proposal Stake')}
                </div>
                <h3 className={s.submitCost}>
                  {PROPOSAL_COST}
                  {' '}
                  <span className={s.submitCurrency}>{STABLE_TOKEN.metadata.symbol}</span>
                </h3>
              </div>

            </div>
          ),
          button: (
            <Button onClick={handleSubmit} className={s.govButton}>
              {t('governance|Submit')}
            </Button>

          ),
        }}
        className={cx(s.proposalHeader, s.formHeader)}
      />
      <CardContent className={s.govContent}>
        <div className={s.formHeaderMob}>
          <div className={s.submitFlex}>
            <div className={s.submitHeader}>
              <h3 className={s.govName}>
                {t('governance|Submit proposal')}
              </h3>
            </div>
          </div>
        </div>
        <div className={s.formInputs}>
          <Input
            className={s.formInput}
            label={t('governance|QIP Link')}
            id="qipLink"
            value={description}
            onChange={(e:any) => setDescription(e.target.value)}
          />
          <Input
            className={s.formInput}
            label={t('governance|Forum link')}
            id="forumlink"
            value={forumLink}
            onChange={(e:any) => setForumLink(e.target.value)}
          />
          <Input
            className={s.formInput}
            label={t('governance|Github link')}
            id="githubLink"
            value={githubLink}
            onChange={(e:any) => setGithubLink(e.target.value)}
          />
          {isPicker && (
            <div className={s.floatingPicker}>
              <DayPickerRangeController
                startDate={votingStart}
                endDate={votingEnd}
                onDatesChange={(
                  {
                    startDate,
                    endDate,
                  },
                ) => {
                  let res:Moment[] = [];
                  if (startDate) res = [startDate];
                  if (endDate) res = [...res, endDate];
                  setVotingDates(res);
                }}
                onFocusChange={(focusedInput) => {
                  if (focusedInput === null) { showPicker(false); }
                  return setVotingInput(focusedInput);
                }}
                focusedInput={votingInput}
                initialVisibleMonth={null}
              />
            </div>
          )}
          <Input
            EndAdornment={DateIcon}
            className={s.formInput}
            label={t('governance|Voting period')}
            id="votingperiod"
            value={`${votingStart.format('DD/MM/YYYY')} - ${votingEnd ? votingEnd.format('DD/MM/YYYY') : initialDates[1].format('DD/MM/YYYY')}`}
            readOnly
            onClick={() => {
              if (!isPicker) {
                setVotingInput('startDate');
              }
              showPicker(!isPicker);
            }}
            onChange={(e:any) => setVotingDates(e.target.value)}
          />

        </div>
        {description && (
        <div className={cx(s.mt40, s.govDescription)}>
          <Markdown markdown={!isLoaded ? 'Loading...' : loadedDescription} />
        </div>
        )}
        <div className={cx(s.mobSubmitGroup)}>
          <div>
            {t('governance|Proposal Stake')}
          </div>
          <h3 className={s.submitCost}>
            {PROPOSAL_COST}
            {' '}
            <span className={s.submitCurrency}>{STABLE_TOKEN.metadata.symbol}</span>
          </h3>
        </div>
        <Button className={s.govButtonBottom}>
          {t('governance|Submit')}
        </Button>
      </CardContent>
    </Card>
  );
};
