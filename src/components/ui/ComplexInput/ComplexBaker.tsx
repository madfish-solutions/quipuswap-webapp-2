import React, { useContext, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { getWhitelistedBakerName } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
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
  const { t } = useTranslation(['common']);
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
              title={baker ? getWhitelistedBakerName(baker) : t('common|Choose Baker')}
            >
              {baker ? getWhitelistedBakerName(baker) : t('common|Choose Baker')}
            </h6>
            <Shevron />
          </div>
        </Button>
      </div>
      <ComplexError error={error} />
    </div>
  );
};
