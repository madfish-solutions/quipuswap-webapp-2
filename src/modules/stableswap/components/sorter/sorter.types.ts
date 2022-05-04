export enum SortField {
  ID = 'ID',
  TVL = 'TVL'
}

export interface SortFieldItem {
  label: string;
  field: SortField;
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}
