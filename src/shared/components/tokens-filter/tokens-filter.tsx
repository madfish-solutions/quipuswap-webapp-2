import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';
import { isNull } from '@shared/helpers';
import { TokensModal } from '@shared/modals/tokens-modal';
import { FilterIcon } from '@shared/svg';
import { useTranslation } from '@translation';

import { Button } from '../button';
import { TokensLogos } from '../tokens-logo';
import styles from './tokens-filter.module.scss';
import { useTokensFilterViewModel } from './tokens-filter.vm';

interface Props {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const TokensFilter: FC<Props> = observer(({ className }) => {
  const { t } = useTranslation();
  const { tokens, handleSelectTokensClick } = useTokensFilterViewModel();
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <>
      <TokensModal />
      <div className={cx(className, modeClass[colorThemeMode], styles.button)}>
        <Button className={styles.innerButton} onClick={handleSelectTokensClick}>
          <FilterIcon className={styles.filterIcon} />
          <span>{t('common|tokensFilter')}</span>
        </Button>
        {!isNull(tokens) && <TokensLogos tokens={tokens} />}
      </div>
    </>
  );
});
