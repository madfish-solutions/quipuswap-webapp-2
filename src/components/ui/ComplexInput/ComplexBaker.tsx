import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { WhitelistedBaker } from '@utils/types';
import { BakersModal } from '@components/modals/BakersModal';
import { Button } from '@components/ui/Button';
import { Shevron } from '@components/svg/Shevron';
import Token from '@icons/Token.svg';
import s from './ComplexInput.module.sass';

type ComplexBakerProps = {
  className?: string,
  label?:string,
  error?:string,
  id?:string,
  handleChange?: (baker:WhitelistedBaker) => void
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ComplexBaker: React.FC<ComplexBakerProps> = ({
  className,
  label,
  id,
  handleChange,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tokensModal, setTokensModal] = React.useState<boolean>(false);
  const [baker, setBaker] = React.useState<WhitelistedBaker>();

  const compoundClassName = cx(
    modeClass[colorThemeMode],
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
          setTokensModal(false);
        }}
      />
      {label && (
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
      )}
      <div className={s.background}>
        <div className={s.shape}>
          {/* TODO: add hidden input w/ selected baker */}
          <Button onClick={() => setTokensModal(true)} theme="quaternary" className={s.baker}>
            <Token />
            <h6 className={cx(s.token)}>
              {baker ? baker.name : 'BAKER NAME'}
            </h6>
            <Shevron />
          </Button>
        </div>
      </div>
    </div>
  );
};
