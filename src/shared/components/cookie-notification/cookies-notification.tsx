import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { useTranslation } from '@translation';

import styles from './cookies-notification.module.scss';
import { useCookiesNotification } from './use-cookies-notification';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  className?: string;
}

export const CookiesNotification: FC<Props> = observer(({ className }) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(styles.wrapper, modeClass[colorThemeMode], className);

  const { approvalValue, handleApproveClick } = useCookiesNotification();

  return (
    <>
      {!approvalValue ? (
        <div className={compoundClassName}>
          <div className={styles.root}>
            <p className={styles.text}>
              {t('common|Сookie Text')}{' '}
              <a href="https://quipuswap.com/privacy-policy" className={styles.link}>
                What for?
              </a>
            </p>
            <Button type="submit" className={styles.button} onClick={handleApproveClick}>
              {t('common|Accept')}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
});
