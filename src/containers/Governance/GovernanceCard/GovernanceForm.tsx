import React, { useContext, useState, useEffect } from 'react';
import cx from 'classnames';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import {
  DayPickerRangeController,
} from 'react-dates';
import moment, { Moment } from 'moment';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Bage } from '@components/ui/Bage';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Back } from '@components/svg/Back';
import { Markdown } from '@components/ui/Markdown';
import DateIcon from '@icons/DateIcon.svg';

import { prettyPrice } from '@utils/helpers';
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

export const GovernanceForm: React.FC<GovernanceFormProps> = ({
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [description, setDescription] = useState<string>('');
  const [forumLink, setForumLink] = useState<string>('');
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
                <div className={cx(s.govGroup, s.desktopFlex)}>
                  <h3 className={s.submitDates}>
                    <span>{moment().format('DD MMM YYYY')}</span>
                    <span> - </span>
                    <span>{moment().add(4, 'd').format('DD MMM YYYY')}</span>
                  </h3>
                  <Bage
                    className={s.govBage}
                    text="ON-GOING"
                    variant="primary"
                  />

                </div>
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
            <Button className={s.govButton}>
              Submit
            </Button>

          ),
        }}
        className={s.proposalHeader}
      />
      <CardContent className={s.govContent}>
        {/* TODO: here inputs */}
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
          {/* <div className={s.formInput}>
            <DateRangePicker
              startDateId="startDate"
              endDateId="endDate"
              startDate={votingStart}
              endDate={votingEnd}
              customInputIcon={<DateIcon />}
              inputIconPosition="after"
              customArrowIcon="-"
              onDatesChange={(
                {
                  startDate,
                  endDate,
                },
              ) => {
                let res:any[] = [];
                if (startDate) res = [startDate];
                if (endDate) res = [...res, endDate];
                setVotingDates(res);
              }}
              focusedInput={votingInput}
              onFocusChange={(focusedInput) => setVotingInput(focusedInput)}
            />

          </div> */}
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
        <div className={cx(s.mt40, s.govDescription)}>
          {description && (<Markdown markdown={!isLoaded ? 'Loading...' : loadedDescription} />)}
        </div>
        <Button className={s.govButtonButtom}>
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};
