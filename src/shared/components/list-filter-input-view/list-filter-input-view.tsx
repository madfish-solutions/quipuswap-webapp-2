import { FC, FormEvent } from 'react';

import { MAX_TOKEN_ID, MIN_TOKEN_ID, STEP } from '@config/constants';
import { Search } from '@shared/svg';

import { Input } from '../input';
import { ListFilterBaseView, ListFilterBaseViewProps } from '../list-filter-base-view';
import styles from '../list-filter-base-view/list-filter-base-view.module.scss';
import { NumberInput } from '../number-input';

interface InputPlaceholder {
  inputPlaceholderTranslation: string;
  numberInputPlaceholderTranslation: string;
}

interface InputDTI {
  searchInputDTI: string;
  numberInputDTI: string;
}

export interface ListFilterInputViewProps extends Omit<ListFilterBaseViewProps, 'leftSide' | 'rightSide'> {
  search: string;
  tokenIdValue: string;
  onSearchChange: (event: FormEvent<HTMLInputElement>) => void;
  onTokenIdChange: (event: FormEvent<HTMLInputElement>) => void;
  handleIncrement: () => void;
  handleDecrement: () => void;
  translation: InputPlaceholder;
  inputDTI: InputDTI;
}

export const ListFilterInputView: FC<ListFilterInputViewProps> = ({
  search,
  tokenIdValue,
  inputDTI,
  translation,
  onSearchChange,
  onTokenIdChange,
  handleIncrement,
  handleDecrement,
  ...props
}) => {
  const { inputPlaceholderTranslation, numberInputPlaceholderTranslation } = translation;
  const { searchInputDTI, numberInputDTI } = inputDTI;

  return (
    <ListFilterBaseView
      leftSide={
        <>
          <Input
            value={search}
            onChange={onSearchChange}
            className={styles.searchInput}
            StartAdornment={Search}
            placeholder={inputPlaceholderTranslation}
            readOnly={false}
            data-test-id={searchInputDTI}
          />

          <NumberInput
            value={tokenIdValue}
            onChange={onTokenIdChange}
            className={styles.numberInput}
            placeholder={numberInputPlaceholderTranslation}
            step={STEP}
            min={MIN_TOKEN_ID}
            max={MAX_TOKEN_ID}
            onIncrementClick={handleIncrement}
            onDecrementClick={handleDecrement}
            data-test-id={numberInputDTI}
          />
        </>
      }
      {...props}
    />
  );
};
