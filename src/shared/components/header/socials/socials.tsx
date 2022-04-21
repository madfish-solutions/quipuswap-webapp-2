import { FC } from 'react';

import cx from 'classnames';

import { amplitudeService } from '../../../services';
import { Button } from '../../button';
import { SocialLinksData } from './content';
import styles from './socials.module.scss';

interface SocialsProps {
  id?: string;
  className?: string;
}

export const Socials: FC<SocialsProps> = ({ id, className }) => {
  const handleSocialClick = (label: string) => {
    amplitudeService.logEvent('SOCIAL_CLICK', { network: label });
  };

  return (
    <div className={cx(styles.root, className)}>
      {SocialLinksData.map(({ id: socialId, href, label, Icon }) => (
        <Button
          key={socialId}
          theme="quaternary"
          href={href}
          external
          title={label}
          className={styles.link}
          onClick={() => handleSocialClick(label)}
        >
          <Icon className={styles.icon} id={id} />
        </Button>
      ))}
    </div>
  );
};
