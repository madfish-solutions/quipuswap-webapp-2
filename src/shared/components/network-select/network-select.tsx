import { FC, useCallback, useMemo } from 'react';

import { Props as SelectProps } from 'react-select';

import { ALL_NETWORKS, NETWORK } from '@config/config';
import { useChangeNetwork } from '@providers/use-dapp';

import { amplitudeService } from '../../services';
import { SelectUI } from '../select-ui';

interface NetworkSelectProps extends Pick<SelectProps, 'menuPlacement'> {
  className?: string;
}

export const NetworkSelect: FC<NetworkSelectProps> = ({ menuPlacement, className }) => {
  const changeNetwork = useChangeNetwork();

  const selectValues = useMemo(() => ALL_NETWORKS.map(el => ({ value: el.id, label: el.name })), []);

  const handleSwitchNetwork = useCallback(
    //TODO: types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ value, label }: any): void => {
      const selectedNetwork = ALL_NETWORKS.find(network => network.id === value && network.name === label);
      amplitudeService.logEvent('SELECT_NETWORK', { selectedNetwork });
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
      value={{ value: NETWORK.id, label: NETWORK.name }}
      onChange={handleSwitchNetwork}
      menuPlacement={menuPlacement}
      className={className}
    />
  );
};
