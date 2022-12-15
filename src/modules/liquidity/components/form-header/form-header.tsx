import { FC } from 'react';

import cx from 'classnames';

import { AppRootRoutes } from '@app.router';
import { Button } from '@shared/components';
import { ArrowDown } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './form-header.module.scss';

interface Props {
  className?: string;
  href?: string;
}

export const FormHeader: FC<Props> = ({ className, href = AppRootRoutes.Liquidity }) => {
  const { t } = useTranslation();

  return (
    <div className={cx(styles.root, className)}>
      <Button href={href} theme="quaternary" icon className={styles.arrowButton} data-test-id="backTTListButton">
        <ArrowDown className={styles.backArrow} />
      </Button>
      <span>{t('common|Back')}</span>
    </div>
  );
};
