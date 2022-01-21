import React, { useContext, useLayoutEffect, useRef } from 'react';

import { Madfish, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ConnectWalletButton } from '@components/common/ConnectWalletButton';
import { NetworkSelect } from '@components/ui/components';
import { Button } from '@components/ui/elements/button';

import { Navigation } from '../Navigation';
import { QPToken } from '../QPToken';
import { Socials } from '../Socials';
import { fixNetworkSelector, getSecondElement, NETWORK_SELECTOR_VALUE_CONTAINER } from './sidebar.helpels';
import s from './Sidebar.module.sass';

interface SidebarProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const sidebarDiv = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const { current: sidebarEl } = sidebarDiv;
    const networkSelector = getSecondElement(NETWORK_SELECTOR_VALUE_CONTAINER);

    const observer = new ResizeObserver(entries => {
      const { target: sidebar } = entries[0];
      fixNetworkSelector(sidebar as HTMLDivElement, networkSelector);
    });

    observer.observe(sidebarEl!);

    return () => {
      observer.unobserve(sidebarEl!);
    };
  }, []);

  return (
    <div ref={sidebarDiv} className={cx(s.root, modeClass[colorThemeMode], className)}>
      <div className={s.wallet}>
        <ConnectWalletButton className={s.button} />
        <NetworkSelect className={cx(s.button, s.select)} />
        <Button external href="https://quipuswap.com/" theme="secondary" className={s.button}>
          {t('common|Old version')}
        </Button>
      </div>
      <Navigation className={s.navigation} iconId="desktop" />
      <footer className={s.footer}>
        <QPToken className={s.token} id="desktop" />
        <Socials className={s.socials} id="desktop" />
        <Button href="https://www.madfish.solutions/" external theme="clean" className={s.madfish}>
          <Madfish />
        </Button>
      </footer>
    </div>
  );
};
