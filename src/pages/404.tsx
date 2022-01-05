import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { appi18n } from '@app.i18n';
import { BaseLayout } from '@components/common/BaseLayout';
import s from '@styles/SwapLiquidity.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const NotFound: FC = () => {
  const { t } = appi18n;
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <BaseLayout
      title={t('common|Page Not Found')}
      description={t('common|Page not found description. Couple sentences...')}
      className={cx(s.wrapper404, modeClass[colorThemeMode])}
    >
      <div className={s.statusCode}>404</div>
      <div className={s.status}>{t('common|Page Not Found')}!</div>
    </BaseLayout>
  );
};
