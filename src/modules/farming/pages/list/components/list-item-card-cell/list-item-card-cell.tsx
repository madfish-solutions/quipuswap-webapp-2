import { FC } from 'react';

import { CardCell, Tooltip } from '@shared/components';

interface Props {
  cellName: string;
  tooltip: string;
  cellNameClassName: string;
  cardCellClassName: string;
}

export const ListItemCardCell: FC<Props> = ({ cellName, tooltip, cellNameClassName, cardCellClassName, children }) => {
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
