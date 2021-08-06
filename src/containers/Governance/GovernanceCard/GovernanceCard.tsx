import React, { useContext } from 'react';
import cx from 'classnames';

import { Card } from '@components/ui/Card';
import { Bage } from '@components/ui/Bage';
import { Button } from '@components/ui/Button';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import s from './GovernanceCard.module.sass';

export type GovernanceCardProps = {
  name: React.ReactNode
  workDates: Date[]
  status: 'PENDING' | 'ON-GOING' | 'APPROVED' | 'ACTIVATED' | 'FAILED'
  description: React.ReactNode
  remaining: Date
  voted: string
  support: string
  reject: string
  votes: string
  claimable: string
  currency: string
  id:string
  className?: string
};

const timeDiffCalc = (dateFuture:number, dateNow:number) => {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  console.log('calculated days', days);

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  console.log('calculated hours', hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  console.log('minutes', minutes);

  // let difference = '';
  // if (days > 0) {
  //   difference += (days === 1) ? `${days} day, ` : `${days} days, `;
  // }

  // difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;

  // difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;

  return { days, hours, minutes };
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const GovernanceCard: React.FC<GovernanceCardProps> = ({
  name,
  workDates,
  status = 'PENDING',
  description,
  remaining,
  voted,
  support,
  reject,
  votes,
  claimable,
  currency,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { days, hours, minutes } = timeDiffCalc(Date.now(), remaining.getTime());
  return (
    <Card
      className={cx(modeClass[colorThemeMode], s.fullWidth, s.mb24i, s.govBody, className)}
      contentClassName={s.govContent}
      header={{
        content: (
          <div className={s.govHeader}>
            <div>
              {name}
            </div>
            <div className={s.govDates}>
              <span>{workDates[0].toISOString()}</span>
              <span> - </span>
              <span>{workDates[1].toISOString()}</span>
            </div>
            <Bage
              className={s.govBage}
              text={status}
              variant={status === 'PENDING' || status === 'FAILED' ? 'inverse' : 'primary'}
            />
          </div>
        ),
        button: (
          <Button className={s.govButton}>
            View Details
          </Button>
        ),
        className: s.govHeaderWrapper,
      }}
    >
      <div className={s.govDescription}>
        {description}
      </div>
      <div className={s.govBlocks}>
        <div className={s.govBlock}>
          <div className={s.govBlockHeader}>
            Remaining
          </div>
          <div className={s.govBlockLabel}>
            {days}
            <span className={s.govBlockSpan}>D</span>
            {' '}
            {hours}
            <span className={s.govBlockSpan}>H</span>
            {' '}
            {minutes}
            <span className={s.govBlockSpan}>M</span>
          </div>
        </div>
        <div className={s.govBlock}>
          <div className={s.govBlockHeader}>
            Voted
          </div>
          <div className={s.govBlockLabel}>
            {voted}
            {' '}
            <span className={s.govBlockSpan}>
              {currency}
            </span>
          </div>
        </div>
        <div className={s.govBlock}>
          <div className={s.govBlockHeader}>
            Support
          </div>
          <div className={s.govBlockLabel}>
            {support}
            {' '}
            <span className={s.govBlockSpan}>
              {currency}
            </span>
          </div>
        </div>
        <div className={s.govBlock}>
          <div className={s.govBlockHeader}>
            Reject
          </div>
          <div className={s.govBlockLabel}>
            {reject}
            {' '}
            <span className={s.govBlockSpan}>
              {currency}
            </span>
          </div>
        </div>
        <div className={s.govBlock}>
          <div className={s.govBlockHeader}>
            Your Votes
          </div>
          <div className={s.govBlockLabel}>
            {votes}
          </div>
        </div>
        <div className={s.govBlock}>
          <div className={s.govBlockHeader}>
            Claimable Votes
          </div>
          <div className={s.govBlockLabel}>
            {claimable}
          </div>
        </div>
      </div>
    </Card>
  );
};
