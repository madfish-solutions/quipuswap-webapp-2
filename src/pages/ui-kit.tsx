import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import cx from 'classnames';

import { BaseLayout } from '@layouts/BaseLayout';
import { Button } from '@components/ui/Button';
import { ColorModeSwitcher } from '@components/ui/ColorModeSwitcher';
import { Logo } from '@components/svg/Logo';
import { MenuClosed } from '@components/svg/MenuClosed';
import { MenuOpened } from '@components/svg/MenuOpened';

import s from '@styles/UiKit.module.sass';
import { Switcher } from '@components/ui/Switcher';
import { Input } from '@components/ui/Input';
import { Tabs } from '@components/ui/Tabs';
import Search from '@icons/Search.svg';
import Chevron from '@icons/Chevron.svg';

const TabsSmall = [
  {
    id: 'weekly',
    label: 'W',
  },
  {
    id: 'daily',
    label: 'D',
  },
];

const TabsMiddle = [
  {
    id: 'swap',
    label: 'Swap',
  },
  {
    id: 'send',
    label: 'Send',
  },
];

const TabsBig = [
  {
    id: 'first',
    label: 'First item',
  },
  {
    id: 'second',
    label: 'Second long item',
  },
  {
    id: 'third',
    label: 'SL',
  },
  {
    id: 'fourth',
    label: 'Middle',
  },
];

const UiKit: React.FC = () => {
  const { t } = useTranslation(['common', 'ui-kit']);

  const [activeSwitcher, setActiveSwitcher] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (state:any) => setInputValue(state.target.value);

  const [tabsSmallState, setTabsSmallState] = useState(TabsSmall[0].id);
  const [tabsMiddleState, setTabsMiddleState] = useState(TabsMiddle[0].id);
  const [tabsBigState, setTabsBigState] = useState(TabsBig[0].id);

  return (
    <BaseLayout
      title={t('ui-kit:Home page')}
      description={t('ui-kit:Home page description. Couple sentences...')}
    >
      <section className={s.section}>
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
      </section>
      <section className={s.section}>
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
      </section>
      <section className={s.section}>
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
      </section>
      <section className={s.section}>
        <h1 className={s.header}>Inputs</h1>
        <div className={s.inputsBlock}>
          <Input
            className={s.input}
            value={inputValue}
            onChange={handleInputChange}
          />
          <Input
            className={s.input}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Input placeholder"
          />
        </div>
        <div className={s.inputsBlock}>
          <Input
            className={s.input}
            value={inputValue}
            onChange={handleInputChange}
            label="Input label"
          />
          <Input
            className={s.input}
            value={inputValue}
            onChange={handleInputChange}
            label="Input label"
            placeholder="Input placeholder"
          />
        </div>
        <div className={s.inputsBlock}>
          <Input
            className={s.input}
            value={inputValue}
            readonly
            label="Readonly input"
            placeholder="Input placeholder"
          />
          <Input
            className={s.input}
            value={inputValue}
            disabled
            label="Disabled input"
            placeholder="Input placeholder"
          />
        </div>
        <div className={s.inputsBlock}>
          <Input
            error="Your password needs to be at least 8 characters long."
            className={s.input}
            value={inputValue}
            onChange={handleInputChange}
            label="Error input"
            placeholder="Input placeholder"
          />
        </div>
        <div className={s.inputsBlock}>
          <Input
            endAdornment={<Chevron />}
            className={s.input}
            value={inputValue}
            onChange={handleInputChange}
            label="End icon (dropdown) input"
            placeholder="Input placeholder"
          />
          <Input
            startAdornment={<Search />}
            className={s.input}
            value={inputValue}
            onChange={handleInputChange}
            label="Start icon input"
            placeholder="Input placeholder"
          />

        </div>
        <div className={s.inputsBlock}>
          <Input
            endAdornment={<Chevron />}
            className={s.input}
            value={inputValue}
            onChange={handleInputChange}
            label="From"
            placeholder="Input placeholder"
          />
          <Input
            startAdornment={<Search />}
            className={s.input}
            value={inputValue}
            onChange={handleInputChange}
            label="Vetos"
            placeholder="Input placeholder"
          />
        </div>
        {/* input with value and dropdown */}
        {/* input with value */}
        {/* input with icon */}
      </section>
      <section className={s.section}>
        <h1 className={s.header}>Toggle Color theme</h1>
        <ColorModeSwitcher />
      </section>
      <section className={s.section}>
        <h1 className={s.header}>Icons</h1>
        <div className={s.iconsBlock}>
          <Logo className={s.icon} />
          <MenuClosed className={s.icon} />
          <MenuOpened className={s.icon} />
        </div>
      </section>
      <section className={s.section}>
        <h1 className={s.header}>Switcher</h1>
        <Switcher
          isActive={activeSwitcher}
          onChange={(state) => setActiveSwitcher(state)}
          className={s.switcher}
        />
        <Switcher
          isActive={activeSwitcher}
          onChange={(state) => setActiveSwitcher(state)}
          disabled
          className={s.switcher}
        />
      </section>
      <section className={s.section}>
        <h1 className={s.header}>Tabs</h1>
        <Tabs
          values={TabsSmall}
          activeId={tabsSmallState}
          setActiveId={(id) => setTabsSmallState(id)}
          className={s.switcher}
        />
        <Tabs
          values={TabsMiddle}
          activeId={tabsMiddleState}
          setActiveId={(id) => setTabsMiddleState(id)}
          className={s.switcher}
        />
        <Tabs
          values={TabsBig}
          activeId={tabsBigState}
          setActiveId={(id) => setTabsBigState(id)}
          className={s.switcher}
        />
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
