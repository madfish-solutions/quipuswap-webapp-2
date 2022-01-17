import React, { useCallback, useMemo } from 'react';

import { SelectUI } from '@quipuswap/ui-kit';
import { Props as SelectProps } from 'react-select';

import { ALL_NETWORKS } from '@app.config';
import { useChangeNetwork, useNetwork } from '@utils/dapp';

interface NetworkSelectProps extends Pick<SelectProps, 'menuPlacement'> {
  className?: string;
}

export const NetworkSelect: React.FC<NetworkSelectProps> = ({ menuPlacement, className }) => {
  const net = useNetwork();
  const changeNetwork = useChangeNetwork();

  const selectValues = useMemo(() => ALL_NETWORKS.map(el => ({ value: el.id, label: el.name })), []);

  const handleSwitchNetwork = useCallback(
    ({ value, label }) => {
      const selectedNetwork = ALL_NETWORKS.find(network => network.id === value && network.name === label);
      if (!selectedNetwork || selectedNetwork.disabled) {
        return;
      }
      changeNetwork(selectedNetwork);
    },
    [changeNetwork]
  );

  return (
    <SelectUI
      options={selectValues}
      value={{ value: net.id, label: net.name }}
      onChange={handleSwitchNetwork}
      menuPlacement={menuPlacement}
      className={className}
    />
  );
};
