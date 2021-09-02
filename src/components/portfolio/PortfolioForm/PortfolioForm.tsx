import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Back } from '@components/svg/Back';

import s from './PortfolioForm.module.sass';

type PortfolioFormProps = {
  className?: string
  onClick?: () => void
  handleUnselect?: () => void
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const PROPOSAL_COST = '1000000';

export const PortfolioForm: React.FC<PortfolioFormProps> = ({
  className,
  handleUnselect,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compountClassName = cx(
    modeClass[colorThemeMode],
    s.fullWidth,
    s.mb24i,
    s.govBody,
    className,
  );
  return (
    <Card
      className={compountClassName}
    >
      <CardHeader header={{
        content: (
          <Button onClick={() => (handleUnselect ? handleUnselect() : null)} theme="quaternary" className={s.proposalHeader}>
            <Back className={s.proposalBackIcon} />
            Back
          </Button>
        ),
      }}
      />
      <CardHeader
        header={{
          content: (
            <div className={s.submitFlex}>
              <div className={s.submitHeader}>
                <h3 className={s.govName}>
                  Submit proposal
                </h3>
              </div>
              <div className={cx(s.govSubmitGroup, s.desktopBlock)}>
                <div>
                  Proposal Stake
                </div>
                <h3 className={s.submitCost}>
                  {PROPOSAL_COST}
                  {' '}
                  <span className={s.submitCurrency}>QPSP</span>
                </h3>
              </div>

            </div>
          ),
          button: (
            <Button className={s.govButton}>
              Submit
            </Button>

          ),
        }}
        className={s.proposalHeader}
      />
      <CardContent className={s.govContent}>
        <Button className={s.govButtonButtom}>
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};
