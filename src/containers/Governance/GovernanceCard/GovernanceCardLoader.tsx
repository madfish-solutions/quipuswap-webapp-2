import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Button } from '@components/ui/Button';

import { Skeleton } from '@components/ui/Skeleton';
import { Loader } from '@components/ui/Loader';
import s from './GovernanceCard.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const GovernanceCardLoader: React.FC<{}> = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compountClassName = cx(
    modeClass[colorThemeMode],
    s.mb24i,
    s.govBody,
  );
  return (
    <Card
      className={compountClassName}
    >
      <CardHeader
        header={{
          content: (
            <div className={s.govHeader}>
              <Skeleton className={cx(s.govName, s.skeletonText)} />
              <Skeleton className={cx(s.govDates, s.skeletonText)} />
              <Skeleton className={cx(s.govBage, s.skeletonText)} />
            </div>
          ),
          button: (
            <Button className={s.govButton}>
              <Loader />
            </Button>
          ),
        }}
        className={s.govHeaderWrapper}
      />
      <CardContent className={s.govContent}>

        <Skeleton className={cx(s.govDescription, s.skeletonDescription)} />
        <div className={s.govBlocks}>
          <Skeleton className={cx(s.govBlock, s.skeletonBlock)} />
          <Skeleton className={cx(s.govBlock, s.skeletonBlock)} />
          <Skeleton className={cx(s.govBlock, s.skeletonBlock)} />
          <Skeleton className={cx(s.govBlock, s.skeletonBlock)} />
          <Skeleton className={cx(s.govBlock, s.skeletonBlock)} />
          <Skeleton className={cx(s.govBlock, s.skeletonBlock)} />
        </div>
        <Button className={s.govButtonBottom}>
          <Loader />
        </Button>
      </CardContent>
    </Card>
  );
};
