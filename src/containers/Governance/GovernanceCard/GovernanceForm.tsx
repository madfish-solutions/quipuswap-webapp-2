import React, { useContext, useState, useEffect } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Bage } from '@components/ui/Bage';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Back } from '@components/svg/Back';
import { Markdown } from '@components/ui/Markdown';
import DateIcon from '@icons/DateIcon.svg';

import s from './GovernanceCard.module.sass';

type GovernanceFormProps = {
  className?: string
  onClick?: () => void
  handleUnselect?: () => void
};

const convertDateToDDMMYYYY = (date:Date) => `${
  (date.getDate() > 9)
    ? date.getDate()
    : (`0${date.getDate()}`)
} 
  ${
  (date.getMonth() > 8)
    ? (date.getMonth() + 1)
    : (`0${date.getMonth() + 1}`)
} 
    ${date.getFullYear()}`;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const PROPOSAL_COST = '1000000';

export const GovernanceForm: React.FC<GovernanceFormProps> = ({
  className,
  handleUnselect,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [description, setDescription] = useState<string>(''); // TODO: change to form values
  const [forumLink, setForumLink] = useState<string>(''); // TODO: change to form values
  const [votingDates, setVotingDates] = useState<string>(''); // TODO: change to form values
  const [{ loadedDescription, isLoaded }, setLoadedDescription] = useState({ loadedDescription: '', isLoaded: false });
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
          <Button onClick={() => (handleUnselect ? handleUnselect() : null)} theme="quaternary" className={s.proposalHeader}>
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
                    <span>{convertDateToDDMMYYYY(new Date())}</span>
                    <span> - </span>
                    <span>{convertDateToDDMMYYYY(new Date(Date.now() + 3600000 * 24 * 4))}</span>
                  </h3>
                  <Bage
                    className={s.govBage}
                    text="ONGOING"
                    variant="primary"
                  />

                </div>
              </div>
              <div className={cx(s.govSubmitGroup, s.desktopBlock)}>
                <div>
                  Proposal Stake
                </div>
                <h3>
                  {PROPOSAL_COST}
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
          <Input
            EndAdornment={DateIcon}
            className={s.formInput}
            label="Voting period"
            id="votingperiod"
            value={votingDates}
            onChange={(e:any) => setVotingDates(e.target.value)}
          />

        </div>
        <div className={cx(s.mt40, s.govDescription)}>
          <Markdown>
            {!isLoaded ? 'Loading...' : loadedDescription}
          </Markdown>
        </div>
      </CardContent>
    </Card>
  );
};
