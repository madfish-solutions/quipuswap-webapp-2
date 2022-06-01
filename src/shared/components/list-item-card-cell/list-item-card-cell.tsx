import { CardCell, Tooltip } from '@shared/components';
import { CFC } from '@shared/types';

interface Props {
  cellName: string;
  tooltip?: string;
  cellNameClassName: string;
  cardCellClassName: string;
}

export const ListItemCardCell: CFC<Props> = ({
  cellName,
  tooltip,
  cellNameClassName,
  cardCellClassName,
  children,
  ...props
}) => {
  return (
    <CardCell
      header={
        <>
          <span className={cellNameClassName} data-test-id="cellName">
            {cellName}
          </span>
          {tooltip && <Tooltip content={tooltip} />}
        </>
      }
      className={cardCellClassName}
      {...props}
    >
      {children}
    </CardCell>
  );
};
