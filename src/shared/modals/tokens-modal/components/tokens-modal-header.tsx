import { FC, FormEvent } from 'react';

import { MAX_TOKEN_ID, MIN_TOKEN_ID, STEP } from '@config/constants';
import { Input, NumberInput, Tabs as UntypedTabs, TabsProps } from '@shared/components';
import { Search } from '@shared/svg';
import { i18n } from '@translation';

import { TokensModalTab } from '../tokens-modal-tabs.service';

export interface TokensModalHeaderProps {
  tabsClassName?: string;
  inputsClassName?: string;
  tabsProps: TabsProps<TokensModalTab>;
  search: string;
  tokenIdValue: string;
  showTokenIdInput: boolean;
  handeTokensSearchChange: (value: FormEvent<HTMLInputElement>) => void;
  handleTokenIdChange: (value: FormEvent<HTMLInputElement>) => void;
  handleIncrement: () => void;
  handleDecrement: () => void;
}

const Tabs = UntypedTabs as FC<TabsProps<TokensModalTab>>;

export const TokensModalHeader: FC<TokensModalHeaderProps> = ({
  tabsClassName,
  inputsClassName,
  tabsProps,
  search,
  tokenIdValue,
  showTokenIdInput,
  handeTokensSearchChange,
  handleTokenIdChange,
  handleIncrement,
  handleDecrement
}) => (
  <>
    <div className={tabsClassName}>
      <Tabs {...tabsProps} />
    </div>
    <div className={inputsClassName}>
      <Input
        value={search}
        onChange={handeTokensSearchChange}
        StartAdornment={Search}
        placeholder={i18n.t('common|Search')}
        readOnly={false}
      />

      {showTokenIdInput && (
        <NumberInput
          value={tokenIdValue}
          onChange={handleTokenIdChange}
          placeholder={i18n.t('common|Token ID')}
          step={STEP}
          min={MIN_TOKEN_ID}
          max={MAX_TOKEN_ID}
          onIncrementClick={handleIncrement}
          onDecrementClick={handleDecrement}
        />
      )}
    </div>
  </>
);
