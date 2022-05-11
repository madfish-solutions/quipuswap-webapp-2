import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { useTranslation } from '@translation';

import styles from './cookies-notification.module.scss';
import { useCookiesNotificationViewModel } from './use-cookies-notification.vm';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const CookiesNotification: FC = observer(() => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(styles.wrapper, modeClass[colorThemeMode]);

  const { approvalValue, handleApproveClick } = useCookiesNotificationViewModel();

  return !approvalValue ? (
    <div className={compoundClassName}>
      <div className={styles.root}>
        <p className={styles.text}>
          {t('common|Сookie Text')}{' '}
          <Link to={AppRootRoutes.PrivacyPolicy} className={styles.link}>
            What for?
          </Link>
        </p>
        <Button className={styles.button} onClick={handleApproveClick} data-test-id="acceptCookieButton">
          {t('common|Accept')}
        </Button>
      </div>
    </div>
  ) : null;
});
