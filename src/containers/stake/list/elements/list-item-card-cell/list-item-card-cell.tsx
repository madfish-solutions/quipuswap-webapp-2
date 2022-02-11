import { FC } from 'react';

import { CardCell } from '@quipuswap/ui-kit';

import { Tooltip } from '@components/ui/components/tooltip';

interface Props {
  cellName: string;
  tooltip: string;
  cellNameClassName: string;
  cardCellClassName: string;
}

export const ListItemCardCell: FC<Props> = ({
  cellName,
  tooltip,
  cellNameClassName,
  cardCellClassName,
  children
}) => {
  return (
    <CardCell
      header={
        <>
          <span className={cellNameClassName}>{cellName}</span>
          <Tooltip content={tooltip} />
        </>
      }
      className={cardCellClassName}
    >
      {children}
    </CardCell>
  );
};
