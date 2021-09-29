import { useTranslation } from 'next-i18next';
import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { getUniqueKey, shortize } from '@utils/helpers';
import { Button } from '@components/ui/Button';
import { ExternalLink } from '@components/svg/ExternalLink';
import For from '@icons/For.svg';
import NotFor from '@icons/NotFor.svg';

import BigNumber from 'bignumber.js';
import s from './ModalCell.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type VoteCellProps = {
  vote?: any,
  value?: any,
  currency?: string
};

export const VoteCell: React.FC<VoteCellProps> = ({
  vote,
  value,
  currency = '',
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(
    modeClass[colorThemeMode],
    s.listItem,
    s.splitRow,
  );
  return (
    <div className={compoundClassName}>
      <div>
        <Button
          external
          href={`https://tzkt.io/${vote.address}`}
          theme="colored"
          className={cx(s.joinRow, s.centerRow)}
          icon={
            <ExternalLink id={`${getUniqueKey()}`} className={s.mleft8} />
          }
        >
          {shortize(vote.address, 10)}
        </Button>
        <div className={s.voteFlexCell}>
          <div className={s.bakerBlock}>
            <div className={s.caption}>
              {t('common|Value')}
              :
            </div>
            <div className={s.label1}>
              {new BigNumber(vote.value)
                .dividedBy(new BigNumber(value))
                .multipliedBy(100)
                .toString()}
              {' '}
              <span className={s.captionText}>%</span>
            </div>
          </div>
          <div className={s.bakerBlock}>
            <div className={s.caption}>
              {t('common|Votes')}
              :
            </div>
            <div>
              <span className={s.label1}>{vote.value}</span>
              {' '}
              <span className={s.bodyTextLink1}>
                {currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {vote.for ? (<For />) : <NotFor />}
    </div>
  );
};
