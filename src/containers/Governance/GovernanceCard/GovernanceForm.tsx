import React, {
  useContext, useState, useEffect, useCallback,
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

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useConnectModalsState } from '@hooks/useConnectModalsState';
import {
  getContract, useAccountPkh, useNetwork, useTezos,
} from '@utils/dapp';
import {
  GOVERNANCE_CONTRACT, GOVERNANCE_TOKEN_MAINNET, GOVERNANCE_TOKEN_TESTNET,
} from '@utils/defaults';
import { prettyPrice } from '@utils/helpers';
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

const PROPOSAL_COST = 1000000;

const initialDates = [moment(Date.now()), moment(Date.now() + 48 * 3600000)];

type SubmitType = {
  tezos: TezosToolkit,
  fromAsset: Token
  accountPkh: string,
  govContract: any,
  ipfsLink: string,
  forumLink: string,
  votingPeriod: number,
  deferral: number
};

const submitProposal = async ({
  tezos,
  fromAsset,
  accountPkh,
  govContract,
  ipfsLink,
  forumLink,
  votingPeriod,
  deferral,
}: SubmitType) => {
  const govParams = await withTokenApprove(
    tezos,
    fromAsset,
    accountPkh,
    govContract.address,
    0,
    [
      govContract.methods
        .new_proposal(ipfsLink, forumLink, votingPeriod, deferral)
        .toTransferParams(fromOpOpts(undefined, undefined)),
    ],
  );
  const op = await batchify(
    tezos.wallet.batch([]),
    govParams,
  ).send();
  await op.confirmation();
// TODO:
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
  const tezos = useTezos();
  const network = useNetwork();
  const accountPkh = useAccountPkh();

  const {
    openConnectWalletModal,
  } = useConnectModalsState();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [description, setDescription] = useState<string>('');
  const [forumLink, setForumLink] = useState<string>('');
  const [govContract, setGovContract] = useState<any>();
  const [[votingStart, votingEnd], setVotingDates] = useState<Moment[]>(initialDates);
  const [votingInput, setVotingInput] = useState<any>(initialDates);
  const [{ loadedDescription, isLoaded }, setLoadedDescription] = useState({ loadedDescription: '', isLoaded: false });
  const [isPicker, showPicker] = useState<boolean>(false);
  useEffect(() => {
    const loadDescription = () => {
      fetch('https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-1155.md').then((x) => x.text()).then((x) => {
        setLoadedDescription({ loadedDescription: x, isLoaded: true });
      });
    };
    if (description !== '' && description.startsWith('https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md')) { loadDescription(); }
  }, [description]);

  // new_proposal
  // ipfs link: ipfs://QmR5bRvdgRhmeDNKtEKeC4raj9MSLgKXaCzkA86t78mQGe/QS2_MAINNET_TOKENS

  useEffect(() => {
    const loadDex = async () => {
      if (!tezos) return;
      if (!network) return;
      const contract = await getContract(tezos, GOVERNANCE_CONTRACT);
      console.log(contract);
      setGovContract(contract);
    };
    loadDex();
  }, [tezos, network]);

  const handleSubmit = useCallback(() => {
    if (!tezos) return;
    if (!govContract) return;
    if (!accountPkh) {
      openConnectWalletModal(); return;
    }
    const fromAsset = network.type === 'test' ? GOVERNANCE_TOKEN_TESTNET : GOVERNANCE_TOKEN_MAINNET;
    submitProposal({
      tezos,
      accountPkh,
      fromAsset,
      govContract,
      ipfsLink: ASCIItoHex(description),
      forumLink: ASCIItoHex(forumLink),
      deferral: votingStart.toDate().getTime() - Date.now(),
      votingPeriod: votingEnd.toDate().getTime() - Date.now(),
    });
  }, [tezos, accountPkh, network]);

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
          <Button href="/governance" theme="quaternary" className={s.proposalHeader}>
            <Back className={s.proposalBackIcon} />
            Back
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
                  Submit proposal
                </h3>
              </div>
              <div className={cx(s.govSubmitGroup, s.desktopBlock)}>
                <div>
                  Proposal Stake
                </div>
                <h3 className={s.submitCost}>
                  {prettyPrice(PROPOSAL_COST)}
                  {' '}
                  <span className={s.submitCurrency}>QPSP</span>
                </h3>
              </div>

            </div>
          ),
          button: (
            <Button onClick={handleSubmit} className={s.govButton}>
              Submit
            </Button>

          ),
        }}
        className={cx(s.proposalHeader, s.formHeader)}
      />
      <CardContent className={s.govContent}>
        {/* TODO: here inputs */}
        <div className={s.formHeaderMob}>
          <div className={s.submitFlex}>
            <div className={s.submitHeader}>
              <h3 className={s.govName}>
                Submit proposal
              </h3>
            </div>
          </div>
        </div>
        <div className={s.formInputs}>
          <Input
            className={s.formInput}
            label="QIP Link"
            id="qipLink"
            value={description}
            onChange={(e:any) => setDescription(e.target.value)}
          />
          <Input
            className={s.formInput}
            label="Forum link"
            id="forumlink"
            value={forumLink}
            onChange={(e:any) => setForumLink(e.target.value)}
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
                  // console.log(startDate, endDate);
                  let res:Moment[] = [];
                  if (startDate) res = [startDate];
                  if (endDate) res = [...res, endDate];
                  setVotingDates(res);

                  // showPicker(false);
                }}
                onFocusChange={(focusedInput) => {
                  console.log('focusedInput', focusedInput);
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
            label="Voting period"
            id="votingperiod"
            value={`${votingStart.format('DD/MM/YYYY')} - ${votingEnd.format('DD/MM/YYYY')}`}
            readOnly
            onClick={() => {
              if (!isPicker) {
                setVotingInput('startDate');
                // setVotingDates(initialDates);
                // setVotingInput('endDate')
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
            Proposal Stake
          </div>
          <h3 className={s.submitCost}>
            {prettyPrice(PROPOSAL_COST)}
            {' '}
            <span className={s.submitCurrency}>QPSP</span>
          </h3>
        </div>
        <Button className={s.govButtonBottom}>
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};
