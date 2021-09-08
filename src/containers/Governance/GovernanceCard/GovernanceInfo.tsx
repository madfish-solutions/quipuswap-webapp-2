import React, { useContext, useState, useEffect } from 'react';
import cx from 'classnames';
import moment from 'moment';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { shortize } from '@utils/helpers';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Bage } from '@components/ui/Bage';
import { Button } from '@components/ui/Button';
import { Back } from '@components/svg/Back';
import { Markdown } from '@components/ui/Markdown';
import { CardCell } from '@components/ui/Card/CardCell';
import { VoteCell } from '@components/ui/Modal/ModalCell/VoteCell';
import { VoteModal } from '@components/modals/VoteModal';
import { useTranslation } from 'next-i18next';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import DonutChart from '@components/ui/DonutChart';
import { ExternalLink } from '@components/svg/ExternalLink';
import For from '@icons/For.svg';

import s from './GovernanceCard.module.sass';

import { GovernanceCardProps } from './GovernanceCard';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const votesData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((x) => ({
  id: x,
  address: 'tz1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  value: '10.00%',
  votes: '1000000',
  for: Math.random() > 0.5,
}));

export const GovernanceInfo: React.FC<GovernanceCardProps> = ({
  name,
  workDates,
  status = 'PENDING',
  description,
  voted,
  votes,
  currency,
  className,
  author,
}) => {
  const { t } = useTranslation(['common', 'governance']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const [{ loadedDescription, isLoaded }, setDescription] = useState({ loadedDescription: '', isLoaded: false });
  const [voteModal, setVoteModal] = useState<boolean>(false);

  useEffect(() => {
    const loadDescription = () => {
      fetch(description).then((x) => x.text()).then((x) => {
        setDescription({ loadedDescription: x, isLoaded: true });
      });
    };
    loadDescription();
  }, []);

  const totalVotes = 155000;
  const totalVetos = 120000;

  const compountClassName = cx(
    modeClass[colorThemeMode],
    s.fullWidth,
    s.mb24i,
    s.govBody,
    className,
  );
  return (
    <>
      <VoteModal
        isOpen={voteModal}
        onRequestClose={() => setVoteModal(false)}
        onChange={() => setVoteModal(false)}
      />
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
              <div className={s.govHeader}>
                <div className={s.govName}>
                  {name}
                </div>
                <div className={s.govGroup}>
                  <div className={s.govDates}>
                    <span>{moment(workDates[0]).format('DD MMM YYYY')}</span>
                    <span> - </span>
                    <span>{moment(workDates[1]).format('DD MMM YYYY')}</span>
                  </div>
                  <Bage
                    className={s.govBage}
                    text={status}
                    variant={status === 'PENDING' || status === 'FAILED' ? 'inverse' : 'primary'}
                  />

                </div>
              </div>
            ),
            button: (
              <Button onClick={() => setVoteModal(true)} className={s.govButton}>
                Vote
              </Button>

            ),
          }}
          className={s.proposalHeader}
        />
        <CardContent className={s.govContent}>
          <div className={s.govDescription}>
            <Markdown markdown={!isLoaded ? 'Loading...' : loadedDescription} />
          </div>
          <Button onClick={() => setVoteModal(true)} className={s.govButtonButtom}>
            Vote
          </Button>
        </CardContent>
      </Card>
      <div className={cx(modeClass[colorThemeMode], s.proposalSidebar)}>
        <div className={s.sticky}>
          <Card className={s.proposalDetails}>
            <CardHeader header={{
              content: <h5>Details</h5>,
            }}
            />
            <CardContent className={s.content}>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance:IPFS')}
                className={s.cell}
              >
                <div className={s.cellDate}>
                  <Button theme="underlined">
                    #Qmexv71
                  </Button>
                </div>
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance:Start Date')}
                className={s.cell}
              >
                <div className={s.cellDate}>
                  {moment(workDates[0]).format('DD MMM YYYY')}
                </div>
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance:End Date')}
                className={s.cell}
              >
                <div className={s.cellDate}>
                  {moment(workDates[1]).format('DD MMM YYYY')}
                </div>
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance:Author')}
                className={s.cell}
              >
                <div className={s.cellDate}>
                  <Button href={`https://tzkt.io/${author}`} theme="underlined">
                    {shortize(author)}
                  </Button>
                </div>
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance:Participants')}
                className={s.cell}
              >
                <div className={s.cellDate}>
                  <CurrencyAmount amount="1000000" />
                </div>
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance:Quorum')}
                className={s.cell}
              >
                <div className={s.cellAmount}>
                  <CurrencyAmount amount="1000000" currency={currency} />
                </div>
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance:Total Votes')}
                className={s.cell}
              >
                <div className={s.cellAmount}>
                  <CurrencyAmount amount={voted} currency={currency} />
                </div>
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance:Your Votes')}
                className={s.cell}
              >
                <div className={s.cellAmount}>
                  <CurrencyAmount amount={votes} currency={currency} />
                </div>
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance:Option')}
                className={s.cell}
              >
                <div className={s.cellDate}>
                  For
                  {' '}
                  <For className={s.voteIcon} />
                </div>
              </CardCell>
              <DonutChart votes={totalVotes} vetos={totalVetos} />
            </CardContent>
          </Card>
          <Card className={cx(s.proposalDetails)}>
            <CardHeader header={{
              content: <h5>Votes</h5>,
            }}
            />
            <CardContent className={s.proposalVotes}>
              {votesData.map((x) => <VoteCell key={x.id} vote={x} currency={currency} />)}
            </CardContent>
          </Card>
          <Card className={s.proposalDetails}>
            <CardHeader header={{
              content: <h5>References</h5>,
            }}
            />
            <CardContent className={s.content}>
              <CardCell
                className={s.cell}
                header={(
                  <Button
                    className={s.detailsButton}
                    theme="inverse"
                  >
                    The proposal on forum
                    <ExternalLink className={s.linkIcon} />
                  </Button>
             )}
              />
              <CardCell
                className={s.cell}
                header={(
                  <Button
                    className={s.detailsButton}
                    theme="inverse"
                  >
                    The QIP on Github
                    <ExternalLink className={s.linkIcon} />
                  </Button>
              )}
              />
              <CardCell
                className={s.cell}
                header={(
                  <Button
                    className={s.detailsButton}
                    theme="inverse"
                  >
                    Governance FAQs
                    <ExternalLink className={s.linkIcon} />
                  </Button>
              )}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
