import { char2Bytes } from '@taquito/utils';

export const prepareInputForSign = <Obj extends object>(input: Obj) => {
  const formattedInput = JSON.stringify(input);

  const bytes = char2Bytes(formattedInput);

  return '05' + '0100' + char2Bytes(bytes.length.toString()) + bytes;
};
