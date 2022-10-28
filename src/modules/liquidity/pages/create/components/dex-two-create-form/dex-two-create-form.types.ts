import { ComplexBakerProps, TokenInputProps } from '@shared/components';

export interface BakerProps extends ComplexBakerProps {
  shouldShowBakerInput: boolean;
}

interface CommonDataAbstraction {
  disabled: boolean;
  loading: boolean;
}

export interface PoolLinkExist {
  isPoolExist: true;
  existingPoolLink: string;
}

export interface PoolLinkNotExist {
  isPoolExist: false;
  existingPoolLink: null;
}

interface CommonDataPoolLinkExist extends CommonDataAbstraction, PoolLinkExist {}
interface CommonDataPoolLinkNotExist extends CommonDataAbstraction, PoolLinkNotExist {}

export type DexTwoCreateFormCommonData = CommonDataPoolLinkExist | CommonDataPoolLinkNotExist;

export interface DexTwoCreateFormProps {
  data: TokenInputProps[];
  bakerData: BakerProps;
  commonData: DexTwoCreateFormCommonData;
  onSubmit: () => void;
}
