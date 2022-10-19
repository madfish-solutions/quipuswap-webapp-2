import { FC } from 'react';

import cx from 'classnames';

import { isNull } from '@shared/helpers';
import { TokensModal } from '@shared/modals/tokens-modal';
import { useTranslation } from '@translation';

import { Button } from '../button';
import { TokensLogos } from '../tokens-logo';
import styles from './tokens-filter.module.scss';
import { useTokensFilterViewModel } from './tokens-filter.vm';

interface Props {
  className?: string;
}

export const TokensFilter: FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const { tokens, handleSelectTokensClick } = useTokensFilterViewModel();

  return (
    <>
      <TokensModal />
      <div className={cx(className, styles.button)}>
        <Button onClick={handleSelectTokensClick} theme="inverse">
          <h6>{t('common|tokensFilter')}</h6>
        </Button>
        {!isNull(tokens) && <TokensLogos tokens={tokens} />}
      </div>
    </>
  );
};
