import { FC } from 'react';

import cx from 'classnames';

import { Button } from '../../button';
import { SocialLinksData } from './content';
import styles from './socials.module.scss';

interface SocialsProps {
  id?: string;
  className?: string;
}

export const Socials: FC<SocialsProps> = ({ id, className }) => (
  <div className={cx(styles.root, className)}>
    {SocialLinksData.map(({ id: socialId, href, label, Icon }, index) => (
      <Button
        key={socialId}
        theme="quaternary"
        href={href}
        external
        title={label}
        className={styles.link}
        testId={`socialButton-${index}`}
      >
        <Icon className={styles.icon} id={id} />
      </Button>
    ))}
  </div>
);
