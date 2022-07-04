import { FC, FormEvent, Fragment } from 'react';

import { MAX_TOKEN_ID, MIN_TOKEN_ID, STEP } from '@config/constants';
import { Input, NumberInput, Tabs, TabsProps } from '@shared/components';
import { Search } from '@shared/svg';
import { i18n } from '@translation';

export interface TokensModalHeaderProps {
  tabsClassName?: string;
  inputsClassName?: string;
  tabsProps: TabsProps;
  search: string;
  tokenIdValue: string;
  handeTokensSearchChange: (value: FormEvent<HTMLInputElement>) => void;
  handleTokenIdChange: (value: FormEvent<HTMLInputElement>) => void;
  handleIncrement: () => void;
  handleDecrement: () => void;
}

export const TokensModalHeader: FC<TokensModalHeaderProps> = ({
  tabsClassName,
  inputsClassName,
  tabsProps,
  search,
  tokenIdValue,
  handeTokensSearchChange,
  handleTokenIdChange,
  handleIncrement,
  handleDecrement
}) => (
  <Fragment>
    <div className={tabsClassName}>
      <Tabs {...tabsProps} />
    </div>
    <div className={inputsClassName}>
      <Input
        value={search}
        onChange={handeTokensSearchChange}
        StartAdornment={Search}
        // className={styles.searchInput}
        placeholder={i18n.t('common|Search')}
        readOnly={false}
      />

      <NumberInput
        value={tokenIdValue}
        onChange={handleTokenIdChange}
        // className={styles.numberInput}
        placeholder={i18n.t('common|Token ID')}
        step={STEP}
        min={MIN_TOKEN_ID}
        max={MAX_TOKEN_ID}
        onIncrementClick={handleIncrement}
        onDecrementClick={handleDecrement}
      />
    </div>
  </Fragment>
);
