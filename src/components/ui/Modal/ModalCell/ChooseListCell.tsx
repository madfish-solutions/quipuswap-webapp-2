import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { WhitelistedTokenList } from '@utils/types';
import { shortize } from '@utils/helpers';
import { MAINNET_TOKENS, CUSTOM_SAVED_TOKEN_LIST_KEY, TESTNET_TOKENS } from '@utils/defaults';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Switcher } from '@components/ui/Switcher';
import { ListLogo } from '@components/ui/ListLogo';
import { Button } from '@components/ui/Button';
import { DeleteList } from '@components/svg/DeleteList';
import { WarnList } from '@components/svg/WarnList';

import s from './ModalCell.module.sass';

type ChooseListCellProps = {
  tokenList: WhitelistedTokenList,
  isActive: boolean,
  onChange?: (state:boolean) => void
  tabIndex?: number
  onRemove?: () => void
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ChooseListCell: React.FC<ChooseListCellProps> = ({
  tokenList,
  isActive,
  onChange = () => {},
  tabIndex,
  onRemove = () => {},
}) => {
  const initialList = [...(TESTNET_TOKENS.split(' ')), ...(MAINNET_TOKENS.split(' ')), CUSTOM_SAVED_TOKEN_LIST_KEY];
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation('common');
  return (
    <div tabIndex={tabIndex} className={cx(modeClass[colorThemeMode], s.listItem, s.splitRow)}>
      <div className={s.joinRow}>
        <ListLogo
          list={tokenList}
        />
        <div className={s.mleft8}>
          <h6>
            {tokenList?.name.length > 20 ? shortize(tokenList?.name, 20) : tokenList?.name}
          </h6>
          <span className={s.caption}>
            {t('common|Tokens Count')}
            :
            {' '}
            {tokenList.tokens.length}
          </span>
        </div>
      </div>

      {tokenList.error && !initialList.some((list) => list === tokenList.url) ? (
        <div className={s.joinRow}>
          <Button theme="quaternary" onClick={onRemove}>
            <DeleteList />
          </Button>
          <Button className={s.mleft8} theme="quaternary">
            <WarnList />
          </Button>
        </div>
      ) : (
        <Switcher
          isActive={isActive}
          onChange={onChange}
        />
      )}
    </div>
  );
};
