import React, { useCallback, useMemo } from 'react';

import { Props as SelectProps } from 'react-select';

import { ALL_NETWORKS, NETWORK } from '@app.config';
import { useChangeNetwork } from '@utils/dapp';
import { Nullable } from '@utils/types';

import { SelectUI } from '../../elements';

interface NetworkSelectProps extends Pick<SelectProps, 'menuPlacement'> {
  className?: string;
}

export const NetworkSelect: React.FC<NetworkSelectProps> = ({ menuPlacement, className }) => {
  const changeNetwork = useChangeNetwork();

  const selectValues = useMemo(() => ALL_NETWORKS.map(el => ({ value: el.id, label: el.name })), []);

  const handleSwitchNetwork = useCallback(
    ({ value, label }): Nullable<void> => {
      const selectedNetwork = ALL_NETWORKS.find(network => network.id === value && network.name === label);
      if (!selectedNetwork || selectedNetwork.disabled) {
        return null;
      }
      changeNetwork(selectedNetwork);
    },
    [changeNetwork]
  );

  return (
    <SelectUI
      options={selectValues}
      value={{ value: NETWORK.id, label: NETWORK.name }}
      onChange={handleSwitchNetwork}
      menuPlacement={menuPlacement}
      className={className}
    />
  );
};
