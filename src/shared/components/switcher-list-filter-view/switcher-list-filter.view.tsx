import { FC } from 'react';

import { Switcher } from '../switcher/switcher';

interface Props {
  value: boolean;
  onClick: (state: boolean) => void;
  disabled?: boolean;
  translation: string;
  translationClassName: string;
  className: string;
}

export const SwitcherListFilterView: FC<Props> = ({
  value,
  disabled,
  onClick,
  translation,
  translationClassName,
  className
}) => (
  <div className={className}>
    <Switcher value={value} disabled={disabled} onClick={onClick} data-test-id="stakedOnlySwitcher" />
    <span className={translationClassName} data-test-id="stakedOnlySwitcherTitle">
      {translation}
    </span>
  </div>
);
