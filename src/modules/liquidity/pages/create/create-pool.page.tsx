import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { AppRootRoutes } from '@app.router';
import { Button, Card, PageTitle, TestnetAlert } from '@shared/components';
import { ArrowDown } from '@shared/svg';

import { CreatePoolOption } from './components';
import styles from './create-pool.module.scss';
import { useCreatePoolViewModel } from './use-create-pool.vm';

export const CreatePoolPage: FC = observer(() => {
  const { back, cardContentClassName, createPool, createPoolOptionsProps } = useCreatePoolViewModel();

  return (
    <>
      <TestnetAlert />

      <PageTitle>{createPool}</PageTitle>

      <Card
        contentClassName={cardContentClassName}
        header={{
          content: (
            <div className={styles.headerContent}>
              <Button
                href={AppRootRoutes.Liquidity}
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
        {createPoolOptionsProps.map(props => (
          <CreatePoolOption key={props.href} {...props} />
        ))}
      </Card>
    </>
  );
});
