import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Back } from '@components/svg/Back';
import { CardCell } from '@components/ui/Card/CardCell';
import { useTranslation } from 'next-i18next';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { shortize } from '@utils/helpers';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from './PortfolioInfo.module.sass';
import { PortfolioDetailsProps } from '../PortfolioDetails';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PortfolioInfo: React.FC<PortfolioDetailsProps> = ({
  name,
  voted,
  votes,
  currency,
  className,
  author,
  handleUnselect,
}) => {
  const { t } = useTranslation(['common', 'Portfolio']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compountClassName = cx(
    modeClass[colorThemeMode],
    s.fullWidth,
    s.mb24i,
    s.govBody,
    className,
  );
  return (
    <>
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
              <div className={s.govHeader}>
                <div className={s.govName}>
                  {name}
                </div>

              </div>
            ),
            button: (
              <Button className={s.govButton}>
                Vote
              </Button>

            ),
          }}
          className={s.proposalHeader}
        />
        <CardContent className={s.govContent}>
          <Button className={s.govButtonButtom}>
            Vote
          </Button>
        </CardContent>
      </Card>
      <div className={cx(modeClass[colorThemeMode], s.proposalSidebar)}>
        <Card className={s.proposalDetails}>
          <CardHeader header={{
            content: <h5>Details</h5>,
          }}
          />
          <CardContent className={s.content}>
            <CardCell
              headerClassName={s.cellHeader}
              header={t('portfolio:IPFS')}
              className={s.cell}
            >
              <div className={s.cellDate}>
                <Button theme="underlined">
                  #Qmexv71
                </Button>
              </div>
            </CardCell>

            <CardCell
              headerClassName={s.cellHeader}
              header={t('portfolio:Author')}
              className={s.cell}
            >
              <div className={s.cellDate}>
                <Button href={`https://tzkt.io/${author}`} theme="underlined">
                  {shortize(author)}
                </Button>
              </div>
            </CardCell>
            <CardCell
              headerClassName={s.cellHeader}
              header={t('portfolio:Participants')}
              className={s.cell}
            >
              <div className={s.cellDate}>
                <CurrencyAmount amount="1000000" />
              </div>
            </CardCell>
            <CardCell
              headerClassName={s.cellHeader}
              header={t('portfolio:Quorum')}
              className={s.cell}
            >
              <div className={s.cellAmount}>
                <CurrencyAmount amount="1000000" currency={currency} />
              </div>
            </CardCell>
            <CardCell
              headerClassName={s.cellHeader}
              header={t('portfolio:Total Votes')}
              className={s.cell}
            >
              <div className={s.cellAmount}>
                <CurrencyAmount amount={voted} currency={currency} />
              </div>
            </CardCell>
            <CardCell
              headerClassName={s.cellHeader}
              header={t('portfolio:Your Votes')}
              className={s.cell}
            >
              <div className={s.cellAmount}>
                <CurrencyAmount amount={votes} currency={currency} />
              </div>
            </CardCell>
            <CardCell
              headerClassName={s.cellHeader}
              header={t('portfolio:Option')}
              className={s.cell}
            >
              <div className={s.cellDate}>
                For
                {' '}
              </div>
            </CardCell>
          </CardContent>
        </Card>
        <Card className={s.proposalDetails}>
          <CardHeader header={{
            content: <h5>References</h5>,
          }}
          />
          <CardContent className={s.content}>
            <CardCell
              className={s.cell}
              header={(
                <Button
                  className={s.detailsButton}
                  theme="inverse"
                >
                  The proposal on forum
                  <ExternalLink className={s.linkIcon} />
                </Button>
             )}
            />
            <CardCell
              className={s.cell}
              header={(
                <Button
                  className={s.detailsButton}
                  theme="inverse"
                >
                  The QIP on Github
                  <ExternalLink className={s.linkIcon} />
                </Button>
              )}
            />
            <CardCell
              className={s.cell}
              header={(
                <Button
                  className={s.detailsButton}
                  theme="inverse"
                >
                  Portfolio FAQs
                  <ExternalLink className={s.linkIcon} />
                </Button>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
