import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { WhitelistedTokenList } from '@utils/types';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Switcher } from '@components/ui/Switcher';
import { ListLogo } from '@components/ui/ListLogo';

import s from './ModalCell.module.sass';

type ChooseListCellProps = {
  tokenList: WhitelistedTokenList,
  isActive: boolean,
  onChange: (state:boolean) => void
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ChooseListCell: React.FC<ChooseListCellProps> = ({
  tokenList,
  isActive,
  onChange,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation('common');
  return (
    <div className={cx(modeClass[colorThemeMode], s.listItem, s.splitRow)}>
      <div className={s.joinRow}>
        <ListLogo
          list={tokenList}
        />
        <div className={s.mleft8}>
          <h6>
            {tokenList?.name}
          </h6>
          <span className={s.caption}>
            {t('common:Tokens Count')}
            :
            {' '}
            {tokenList.tokens.length}
          </span>
        </div>
      </div>

      <Switcher
        isActive={isActive}
        onChange={onChange}
      />
    </div>
  );
};
