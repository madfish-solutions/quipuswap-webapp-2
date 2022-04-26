import { FC, HTMLProps, useContext, useEffect, useRef, useState } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { BakerLogo } from '@shared/elements';
import { isEmptyString, isExist } from '@shared/helpers';
import { getWhitelistedBakerName, isBackerNotEmpty } from '@shared/helpers/bakers';
import { BakersModal } from '@shared/modals';
import { Shevron } from '@shared/svg';
import { Nullable, WhitelistedBaker } from '@shared/types';

import { Button } from '../button';
import { ComplexError } from './ComplexError';
import s from './ComplexInput.module.scss';

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
        <Button
          onClick={() => setTokensModal(true)}
          theme="quaternary"
          className={s.shape}
          data-test-id="chooseBakerButton"
        >
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
