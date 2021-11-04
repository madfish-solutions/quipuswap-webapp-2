import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';
import { TokensLogos } from '@madfish-solutions/quipu-ui-kit';

import { getWhitelistedBakerName, prettyPrice } from '@utils/helpers';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { WhitelistedBaker, WhitelistedToken } from '@utils/types';

import { Tooltip } from '@components/ui/Tooltip';
import s from './ModalCell.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type BakerCellProps = {
  baker: WhitelistedBaker,
  tabIndex?: number,
  onClick?: () => void,
};
export const BakerCell: React.FC<BakerCellProps> = ({
  baker,
  onClick,
  tabIndex,
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compoundClassName = cx(
    modeClass[colorThemeMode],
    s.listItem,
  );

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyUp={(e) => {
        if (e.key === 'Enter' && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={compoundClassName}
    >
      <div className={s.bakerFlexCell}>
        <TokensLogos token1={{
          metadata:
            {
              thumbnailUri: baker.logo,
              name: getWhitelistedBakerName(baker),
              symbol: '',
            },
        } as WhitelistedToken}
        />
        <h6
          className={cx(s.h6, s.bakerName)}
          title={baker.name ?? baker.address}
        >
          {baker.name ?? baker.address}
        </h6>
      </div>
      <div className={s.bakerFlexCell}>
        <div className={s.bakerBlock}>
          <div className={s.caption}>
            {t('common|Fee')}
            <Tooltip sizeT="small" content="The fee this baker will charge on your baking reward." />
          </div>
          <div className={s.label1}>
            {prettyPrice(baker.fee * 100)}
            {' '}
            %
          </div>
        </div>
        <div className={s.bakerBlock}>
          <div className={s.caption}>
            {t('common|Space')}
            <Tooltip sizeT="small" content="The max amount you can delegate to a specific baker." />
          </div>
          <div>
            <span className={s.label1}>
              {prettyPrice((+baker.freeSpace.toString()) ?? 0, 3, 3)}
            </span>
            {' '}
            <span className={s.bodyTextLink1}>
              TEZ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
