import React, { FC, HTMLProps, useContext, useRef, useState } from 'react';

import { Button, Shevron, BakerLogo, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { BakersModal } from '@components/modals/BakersModal';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { isFullBaker, WhitelistedBaker } from '@utils/types';

import s from './ComplexInput.module.sass';

interface ComplexBakerProps extends HTMLProps<HTMLInputElement> {
  className?: string;
  label?: string;
  error?: string;
  id?: string;
  handleChange?: (baker: WhitelistedBaker) => void;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const ComplexBaker: FC<ComplexBakerProps> = ({ className, label, id, error, handleChange, value, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tokensModal, setTokensModal] = useState<boolean>(false);
  const [baker, setBaker] = useState<WhitelistedBaker>();
  const inputRef = useRef<HTMLInputElement>(null);

  const compoundClassName = cx(modeClass[colorThemeMode], { [s.error]: !!error }, className);

  return (
    <div className={compoundClassName}>
      <BakersModal
        isOpen={tokensModal}
        onRequestClose={() => setTokensModal(false)}
        onChange={selectedBaker => {
          setBaker(selectedBaker);
          if (handleChange) {
            handleChange(selectedBaker);
          }
          if (inputRef.current) {
            inputRef.current.value = isFullBaker(selectedBaker) ? selectedBaker.name : '';
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
        <Button onClick={() => setTokensModal(true)} theme="quaternary" className={s.shape}>
          <input {...props} ref={inputRef} value={value} hidden />
          <div className={s.bakerInner}>
            <BakerLogo
              bakerName={baker && isFullBaker(baker) ? baker.name : ''}
              bakerIcon={baker && isFullBaker(baker) ? baker.logo : ''}
            />
            <h6 className={cx(s.token, s.bakerLabel)} title={baker && isFullBaker(baker) ? baker.name : 'Choose Baker'}>
              {baker && isFullBaker(baker) ? baker.name : 'Choose Baker'}
            </h6>
            <Shevron />
          </div>
        </Button>
      </div>
      <ComplexError error={error} />
    </div>
  );
};
