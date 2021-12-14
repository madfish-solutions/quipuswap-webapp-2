import React from 'react';

import { Button } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { SocialLinksData } from './content';
import s from './Socials.module.sass';

type SocialsProps = {
  id?: string;
  className?: string;
};

export const Socials: React.FC<SocialsProps> = ({ id, className }) => (
  <div className={cx(s.root, className)}>
    {SocialLinksData.map(({ id: socialId, href, label, Icon }) => (
      <Button key={socialId} theme="quaternary" href={href} external title={label} className={s.link}>
        <Icon className={s.icon} id={id} />
      </Button>
    ))}
  </div>
);
