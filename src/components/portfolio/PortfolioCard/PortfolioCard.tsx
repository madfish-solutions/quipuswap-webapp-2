import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Bage } from '@components/ui/Bage';
import { Button } from '@components/ui/Button';

import s from './PortfolioCard.module.sass';

export type PortfolioCardProps = {
  name: React.ReactNode
  workDates: Date[]
  status: 'PENDING' | 'ON-GOING' | 'APPROVED' | 'ACTIVATED' | 'FAILED'
  description: string
  shortDescription: React.ReactNode
  remaining: Date
  voted: string
  support: string
  reject: string
  votes: string
  claimable: string
  currency: string
  id:string
  author:string
  className?: string
  onClick?: () => void
  handleUnselect?: () => void
};

const timeDiffCalc = (dateFuture:number, dateNow:number) => {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  return { days, hours, minutes };
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  name,
  status = 'PENDING',
  shortDescription,
  remaining,
  voted,
  support,
  reject,
  votes,
  claimable,
  currency,
  className,
  onClick,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { days, hours, minutes } = timeDiffCalc(Date.now(), remaining.getTime());
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
      <CardHeader
        header={{
          content: (
            <div className={s.govHeader}>
              <div className={s.govName}>
                {name}
              </div>
              <Bage
                className={s.govBage}
                text={status}
              />
            </div>
          ),
          button: (
            <Button onClick={() => (onClick ? onClick() : null)} className={s.govButton}>
              View Details
            </Button>
          ),
        }}
        className={s.govHeaderWrapper}
      />
      <CardContent className={s.govContent}>

        <div className={s.govDescription}>
          {shortDescription}
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
        <Button onClick={() => (onClick ? onClick() : null)} className={s.govButtonButtom}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
