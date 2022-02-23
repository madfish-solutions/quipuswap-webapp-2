import { DashPlug } from '@components/ui/dash-plug';
import { isNull } from '@utils/helpers';
import { Nullable } from '@utils/types';

interface Props<T> {
  isLoading: boolean;
  data: Nullable<T>;
  children: (data: T) => JSX.Element;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const StateData = <T extends unknown>({ isLoading, data, children }: Props<T>) =>
  isNull(data) ? <DashPlug animation={isLoading} /> : children(data);
