import React, { FC, HTMLProps, useContext, useEffect, useRef, useState } from 'react';

import { Shevron, BakerLogo, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { BakersModal } from '@components/modals/BakersModal';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { getWhitelistedBakerName, isBackerNotEmpty, isExist } from '@utils/helpers';
import { isEmptyString } from '@utils/helpers/strings';
import { Nullable, WhitelistedBaker } from '@utils/types';

import { Button } from '../elements/button';
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

const DEFAULT_BUTTON_LABEL = 'Choose Baker';

export const ComplexBaker: FC<ComplexBakerProps> = ({ className, label, id, error, handleChange, value, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tokensModal, setTokensModal] = useState<boolean>(false);
  const [baker, setBaker] = useState<Nullable<WhitelistedBaker>>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isExist(value) || (typeof value === 'string' && isEmptyString(value))) {
      setBaker(null);
    }
  }, [value]);

  const compoundClassName = cx(modeClass[colorThemeMode], { [s.error]: !!error }, className);
  const buttonText = getWhitelistedBakerName(baker) ?? DEFAULT_BUTTON_LABEL;

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
            inputRef.current.value = isBackerNotEmpty(selectedBaker) ? selectedBaker.name : '';
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
              bakerName={baker && isBackerNotEmpty(baker) ? baker.name : ''}
              bakerIcon={baker && isBackerNotEmpty(baker) ? baker.logo : ''}
            />
            <h6 className={cx(s.token, s.bakerLabel)} title={buttonText}>
              {buttonText}
            </h6>
            <Shevron />
          </div>
        </Button>
      </div>
      <ComplexError error={error} />
    </div>
  );
};
