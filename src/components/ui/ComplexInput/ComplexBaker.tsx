import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { WhitelistedBaker, WhitelistedToken } from '@utils/types';
import { getWhitelistedBakerName } from '@utils/helpers';
import { Button } from '@components/ui/Button';
import { TokensLogos } from '@components/ui/TokensLogos';
import { BakersModal } from '@components/modals/BakersModal';
import { Shevron } from '@components/svg/Shevron';

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
            <TokensLogos token1={
              {
                metadata:
                {
                  thumbnailUri: baker?.logo,
                  name: getWhitelistedBakerName((baker ?? { name: '' }) as WhitelistedBaker, 1000),
                  symbol: '',
                },
              } as WhitelistedToken
            }
            />
            <h6
              className={cx(s.token, s.bakerLabel)}
              title={baker ? baker.name : 'BAKER NAME'}
            >
              {baker ? baker.name : 'BAKER NAME'}
            </h6>
            <Shevron />
          </Button>
        </div>
      </div>
    </div>
  );
};
