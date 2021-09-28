import React, { useContext } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { GovernanceCardProps } from '@utils/types';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Bage } from '@components/ui/Bage';
import { Button } from '@components/ui/Button';
import { Timeleft } from '@components/ui/Timeleft';

import s from './GovernanceCard.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const GovernanceCard: React.FC<GovernanceCardProps> = ({
  name,
  workDates,
  status = 'PENDING',
  shortDescription,
  voted,
  support,
  reject,
  votes,
  currency,
  className,
  onClick = () => {},
  href = '',
}) => {
  const { t } = useTranslation(['governance']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compountClassName = cx(
    modeClass[colorThemeMode],
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
          ),
          button: (
            <Button onClick={onClick} href={href} className={s.govButton}>
              {t('governance|View Details')}
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
              {t('governance|Remaining')}
            </div>
            <Timeleft className={s.govBlockLabel} remaining={workDates[1]} />
          </div>
          <div className={s.govBlock}>
            <div className={s.govBlockHeader}>
              {t('governance|Voted')}
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
              {t('governance|Support')}
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
              {t('governance|Reject')}
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
              {t('governance|Your Votes')}
            </div>
            <div className={s.govBlockLabel}>
              {status === 'pending' || status === 'voting' ? votes : '0'}
            </div>
          </div>
          <div className={s.govBlock}>
            <div className={s.govBlockHeader}>
              {t('governance|Claimable Votes')}
            </div>
            <div className={s.govBlockLabel}>
              {status === 'pending' || status === 'voting' ? '0' : votes}
            </div>
          </div>
        </div>
        <Button onClick={onClick} href={href} className={s.govButtonBottom}>
          {t('governance|View Details')}
        </Button>
      </CardContent>
    </Card>
  );
};
