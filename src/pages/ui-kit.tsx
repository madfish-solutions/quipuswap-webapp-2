import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import cx from 'classnames';

import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@components/ui/Container';
import { Button } from '@components/ui/Button';
import { ColorModeSwitcher } from '@components/ui/ColorModeSwitcher';
import { Logo } from '@components/svg/Logo';
import { MenuClosed } from '@components/svg/MenuClosed';
import { MenuOpened } from '@components/svg/MenuOpened';

import s from '@styles/UiKit.module.sass';
import {
  Card,
  CardContent,
  CardDivider,
  CardHeader,
  CardList,
  CardListItem,
} from '@components/ui/Card';
import { Popup } from '@components/ui/Popup';
import { Bage } from '@components/ui/Bage';

const UiKit: React.FC = () => {
  const { t } = useTranslation(['common', 'ui-kit']);
  const [showExamplePopup, setShowExamplePopup] = useState<boolean>(false);

  return (
    <BaseLayout
      title={t('ui-kit:Home page')}
      description={t('ui-kit:Home page description. Couple sentences...')}
    >
      <section className={s.section}>
        <Container>
          <h1 className={s.header}>Colors</h1>
          <h2 className={s.sectionHeader}>Brand colors</h2>
          <div className={s.colorsBlock}>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.brand01)} />
              <h3 className={s.blockHeader}>$brand-01</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.brand02)} />
              <h3 className={s.blockHeader}>$brand-02</h3>
            </div>
          </div>
          <h2 className={s.sectionHeader}>Typography</h2>
          <div className={s.colorsBlock}>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.text01)} />
              <h3 className={s.blockHeader}>$text-01</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.text02)} />
              <h3 className={s.blockHeader}>$text-02</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.text03)} />
              <h3 className={s.blockHeader}>$text-03</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.textInverse)} />
              <h3 className={s.blockHeader}>$text-inverse</h3>
            </div>
          </div>
          <h2 className={s.sectionHeader}>Surface / Background</h2>
          <div className={s.colorsBlock}>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.ui01)} />
              <h3 className={s.blockHeader}>$ui-01</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.ui02)} />
              <h3 className={s.blockHeader}>$ui-02</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.ui03)} />
              <h3 className={s.blockHeader}>$ui-03</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.ui04)} />
              <h3 className={s.blockHeader}>$ui-04</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.ui05)} />
              <h3 className={s.blockHeader}>$ui-05</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.ui06)} />
              <h3 className={s.blockHeader}>$ui-06</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.ui07)} />
              <h3 className={s.blockHeader}>$ui-07</h3>
            </div>
          </div>
          <h2 className={s.sectionHeader}>Hover state</h2>
          <div className={s.colorsBlock}>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.hoverPrimary01)} />
              <h3 className={s.blockHeader}>$hover-primary-01</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.hoverPrimary02)} />
              <h3 className={s.blockHeader}>$hover-primary-02</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.hoverLightRow)} />
              <h3 className={s.blockHeader}>$hover-light-row</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.hoverDarkRow)} />
              <h3 className={s.blockHeader}>$hover-dark-row</h3>
            </div>
          </div>
          <h2 className={s.sectionHeader}>Support</h2>
          <div className={s.colorsBlock}>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.supportSuccess)} />
              <h3 className={s.blockHeader}>$support-success</h3>
            </div>
            <div className={s.color}>
              <span className={cx(s.colorInner, s.supportError)} />
              <h3 className={s.blockHeader}>$support-error</h3>
            </div>
          </div>
        </Container>
      </section>
      <section className={s.section}>
        <Container>
          <h1 className={s.header}>Elevation</h1>
          <div className={s.elevationBlock}>
            <div className={s.elevation}>
              $elevation-01
            </div>
            <div className={cx(s.elevation, s.elevation02)}>
              $elevation-02
            </div>
            <div className={cx(s.elevation, s.elevation03)}>
              $elevation-03
            </div>
            <div className={cx(s.elevation, s.elevation04)}>
              $elevation-04
            </div>
            <div className={cx(s.elevation, s.elevation05)}>
              $elevation-05
            </div>
            <div className={cx(s.elevation, s.elevation06)}>
              $elevation-06
            </div>
          </div>
        </Container>
      </section>
      <section className={s.section}>
        <Container>
          <h1 className={s.header}>Buttons Light</h1>
          <div className={s.buttonsBlock}>
            <Button
              className={s.button}
            >
              Primary
            </Button>
            <Button
              className={s.button}
              disabled
            >
              Primary
            </Button>
          </div>
          <div className={s.buttonsBlock}>
            <Button
              className={s.button}
              theme="secondary"
            >
              Secondary
            </Button>
            <Button
              className={s.button}
              disabled
              theme="secondary"
            >
              Secondary
            </Button>
          </div>
          <div className={s.buttonsBlock}>
            <Button
              className={s.button}
              theme="tertiary"
            >
              Tertiary
            </Button>
            <Button
              className={s.button}
              disabled
              theme="tertiary"
            >
              Tertiary
            </Button>
          </div>
          <div className={s.buttonsBlock}>
            <Button
              className={s.button}
              theme="quaternary"
            >
              Quaternary
            </Button>
            <Button
              className={s.button}
              disabled
              theme="quaternary"
            >
              Quaternary
            </Button>
          </div>
        </Container>
      </section>
      <section className={s.section}>
        <Container>
          <h1 className={s.header}>Toggle Color theme</h1>
          <ColorModeSwitcher />
        </Container>
      </section>
      <section className={s.section}>
        <Container>
          <h1 className={s.header}>Bage for popupCells</h1>
          <div className={s.cardsBlock}>
            <Bage text="FA 2.0" />
            <Bage text="ID 0" />

          </div>
          <div className={s.cardsBlock}>
            <Bage text="some wide text" />
            <Bage text="a" />
          </div>
        </Container>
      </section>
      <section className={s.section}>
        <Container>
          <h1 className={s.header}>Popup</h1>
          <Button
            className={s.button}
            onClick={() => setShowExamplePopup(true)}
          >
            Show popup
          </Button>
          {showExamplePopup && (
          <Popup closeHandler={() => setShowExamplePopup(false)}>
            <Card className={s.card}>
              <CardHeader title="title & list of components" icon={<MenuOpened />} />
              <CardDivider />
              <CardContent>
                <CardList>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((x) => (
                    <CardListItem key={x}>
                      item
                      {' '}
                      {x}
                    </CardListItem>
                  ))}
                </CardList>
              </CardContent>
            </Card>
          </Popup>
          )}
        </Container>
      </section>
      <section className={s.section}>
        <Container>
          <h1 className={s.header}>Cards</h1>
          <div className={s.cardsBlock}>
            <Card className={s.card}>
              <CardHeader title="demo title" />
            </Card>
            <Card className={s.card}>
              <CardHeader
                title="title & icon"
                icon={<MenuOpened />}
              />
            </Card>
          </div>
          <div className={s.cardsBlock}>
            <Card className={s.card}>
              <CardHeader title="title & content" />
              <CardDivider />
              <CardContent>demo</CardContent>
            </Card>
            <Card className={s.card}>
              <CardHeader
                title="title & icon & demo content"
                icon={<MenuOpened />}
              />
              <CardDivider />
              <CardContent>
                demo
              </CardContent>
            </Card>
          </div>
          <div className={s.cardsBlock}>
            <Card className={s.card}>
              <CardHeader title="title & list content" />
              <CardDivider />
              <CardContent>
                <CardList>
                  <CardListItem>
                    item1
                  </CardListItem>
                  <CardListItem>
                    item2
                  </CardListItem>
                  <CardListItem>
                    item3
                  </CardListItem>
                </CardList>
              </CardContent>
            </Card>
          </div>
          <div className={s.cardsBlock}>
            <Card className={s.card}>
              <CardHeader title="title & list of components" />
              <CardDivider />
              <CardContent>
                <CardList>
                  <CardListItem>
                    item1
                  </CardListItem>
                  <CardListItem>
                    item2
                  </CardListItem>
                  <CardListItem>
                    item3
                  </CardListItem>
                </CardList>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
      <section className={s.section}>
        <Container>
          <h1 className={s.header}>Icons</h1>
          <div className={s.iconsBlock}>
            <Logo className={s.icon} />
            <MenuClosed className={s.icon} />
            <MenuOpened className={s.icon} />
          </div>
        </Container>
      </section>
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'ui-kit']),
  },
});

export default UiKit;
