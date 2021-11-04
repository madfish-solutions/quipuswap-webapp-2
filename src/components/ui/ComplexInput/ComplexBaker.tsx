import React, { useContext, useRef } from 'react';
import cx from 'classnames';
import { Button } from '@madfish-solutions/quipu-ui-kit';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { WhitelistedBaker } from '@utils/types';
import { BakerLogo } from '@components/ui/BakerLogo';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { BakersModal } from '@components/modals/BakersModal';
import { Shevron } from '@components/svg/Shevron';

import s from './ComplexInput.module.sass';

type ComplexBakerProps = {
  className?: string,
  label?: string,
  error?: string,
  id?: string,
  handleChange?: (baker: WhitelistedBaker) => void
} & React.HTMLProps<HTMLInputElement>;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ComplexBaker: React.FC<ComplexBakerProps> = ({
  className,
  label,
  id,
  error,
  handleChange,
  value,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tokensModal, setTokensModal] = React.useState<boolean>(false);
  const [baker, setBaker] = React.useState<WhitelistedBaker>();
  const inputRef = useRef<HTMLInputElement>(null);

  const compoundClassName = cx(
    modeClass[colorThemeMode],
    { [s.error]: !!error },
    className,
  );

  return (
    <div
      className={compoundClassName}
    >
      <BakersModal
        isOpen={tokensModal}
        onRequestClose={() => setTokensModal(false)}
        onChange={(selectedBaker) => {
          setBaker(selectedBaker);
          if (handleChange) handleChange(selectedBaker);
          if (inputRef.current) {
            inputRef.current.value = selectedBaker.name;
          }
          setTokensModal(false);
        }}
      />
      {label && (
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
      )}
      <div className={s.background}>
        <Button
          onClick={() => setTokensModal(true)}
          theme="quaternary"
          className={s.shape}
        >
          <input {...props} ref={inputRef} value={value} hidden />
          <div className={s.bakerInner}>
            <BakerLogo baker={baker || {} as WhitelistedBaker} />
            <h6
              className={cx(s.token, s.bakerLabel)}
              title={baker ? baker.name : 'Choose Baker'}
            >
              {baker ? baker.name : 'Choose Baker'}
            </h6>
            <Shevron />
          </div>
        </Button>
      </div>
      <ComplexError error={error} />
    </div>
  );
};
