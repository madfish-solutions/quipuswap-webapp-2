import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { AppRootRoutes } from '@app.router';
import { Button, Card, PageTitle, TestnetAlert } from '@shared/components';
import { ArrowDown } from '@shared/svg';

import styles from './create-pool.module.scss';
import { useCreatePoolViewModel } from './create-pool.vm';

export const CreatePoolPage: FC = observer(() => {
  const { translations, createRegularPoolIcon, createStablePoolIcon } = useCreatePoolViewModel();

  const { createPool, stablePool, regularPool, back } = translations;

  return (
    <>
      <TestnetAlert />

      <PageTitle>{createPool}</PageTitle>

      <Card
        contentClassName={styles.cardContent}
        header={{
          content: (
            <div className={styles.headerContent}>
              <Button
                href={AppRootRoutes.NewLiquidity}
                theme="quaternary"
                icon={<ArrowDown className={styles.backArrow} />}
                className={styles.arrowButton}
                data-test-id="backNewLiquidityButton"
              />
              <span>{back}</span>
            </div>
          )
        }}
      >
        <div className={styles.poolWrapper}>
          <img className={styles.img} src={createRegularPoolIcon} alt="Create regular pool icon" />
          <h2 className={styles.subtitle}>{regularPool}</h2>
          <Button className={styles.button}>{createPool}</Button>
        </div>
        <div className={styles.poolWrapper}>
          <img className={styles.img} src={createStablePoolIcon} alt="Create stable pool icon" />
          <h2 className={styles.subtitle}>{stablePool}</h2>
          <Button className={styles.button}>{createPool}</Button>
        </div>
      </Card>
    </>
  );
});
