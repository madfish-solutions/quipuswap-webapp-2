import { FC } from 'react';

import { Switcher } from '../switcher';

export interface SwitcherLabelProps {
  value: boolean;
  onClick: (state: boolean) => void;
  disabled?: boolean;
  switcherDTI: string;
  switcherTranslationDTI: string;
  translation: string;
  translationClassName: string;
  className: string;
}

export const SwitcherLabel: FC<SwitcherLabelProps> = ({
  value,
  disabled,
  onClick,
  switcherDTI,
  switcherTranslationDTI,
  translation,
  translationClassName,
  className
}) => (
  <div className={className}>
    <Switcher value={value} disabled={disabled} onClick={onClick} data-test-id={switcherDTI} />
    <span className={translationClassName} data-test-id={switcherTranslationDTI}>
      {translation}
    </span>
  </div>
);
