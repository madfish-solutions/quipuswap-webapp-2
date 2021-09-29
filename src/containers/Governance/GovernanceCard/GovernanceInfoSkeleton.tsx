import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Skeleton } from '@components/ui/Skeleton';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Back } from '@components/svg/Back';
import { CardCell } from '@components/ui/Card/CardCell';

import s from './GovernanceCard.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const GovernanceInfoSkeleton: React.FC<{
  className?: string
}> = ({
  className,
}) => {
  const { t } = useTranslation(['common', 'governance']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    modeClass[colorThemeMode],
    s.fullWidth,
    s.mb24i,
    s.govBody,
    className,
  );
  //   <Skeleton className={s.loadingLogo} />
  return (
    <>
      <Card
        className={compoundClassName}
      >
        <CardHeader
          header={{
            content: (
              <Button
                href="/governance"
                theme="quaternary"
                className={s.proposalButton}
                control={
                  <Back className={s.proposalBackIcon} />
                }
              >
                Back
              </Button>
            ),
          }}
        />
        <CardHeader
          header={{
            content: (
              <div className={s.govHeader}>
                <Skeleton className={cx(s.govNameSkel, s.govName)} />
                <div className={s.govGroup}>
                  <Skeleton className={cx(s.govNameSkel, s.govDates)} />
                  <Skeleton className={cx(s.govNameSkel, s.govBage)} />
                </div>
              </div>
            ),
            button: (
              <Button disabled className={s.govButton}>
                Vote
              </Button>

            ),
          }}
          className={s.proposalSubHeader}
        />
        <CardContent className={s.govContent}>
          <Skeleton className={cx(s.govDescription, s.govDescriptionSkeleton)} />
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
                header={t('governance|IPFS')}
                className={s.cell}
              >
                <Skeleton className={cx(s.cellSkel, s.cellDate)} />
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance|Start Date')}
                className={s.cell}
              >
                <Skeleton className={cx(s.cellSkel, s.cellDate)} />
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance|End Date')}
                className={s.cell}
              >
                <Skeleton className={cx(s.cellSkel, s.cellDate)} />
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance|Author')}
                className={s.cell}
              >
                <Skeleton className={cx(s.cellSkel, s.cellDate)} />
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance|Participants')}
                className={s.cell}
              >
                <Skeleton className={cx(s.cellSkel, s.cellDate)} />
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance|Quorum')}
                className={s.cell}
              >
                <Skeleton className={cx(s.cellSkel, s.cellDate)} />
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance|Total Votes')}
                className={s.cell}
              >
                <Skeleton className={cx(s.cellSkel, s.cellDate)} />
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance|Your Votes')}
                className={s.cell}
              >
                <Skeleton className={cx(s.cellSkel, s.cellDate)} />
              </CardCell>
              <CardCell
                headerClassName={s.cellHeader}
                header={t('governance|Option')}
                className={s.cell}
              >
                <Skeleton className={cx(s.cellSkel, s.cellDate)} />
              </CardCell>
              {/* <DonutChart votes={totalVotes} vetos={totalVetos} /> */}
            </CardContent>
          </Card>
          <Card className={s.proposalDetails}>
            <CardHeader header={{
              content: (<h5>{t('governance|Votes')}</h5>),
            }}
            />
            <CardContent className={s.proposalVotes}>
              <Skeleton className={cx(s.govDescription, s.govDetailsSkeleton)} />
            </CardContent>
          </Card>
          <Card className={s.proposalDetails}>
            <CardHeader header={{
              content: (<h5>{t('governance|References')}</h5>),
            }}
            />
            <CardContent className={s.content}>
              <Skeleton className={cx(s.govDescription, s.govDetailsSkeleton)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
