/* eslint-disable @typescript-eslint/no-type-alias */
import { isExist } from '@shared/helpers';

import { en as enLocal } from './locales';
import { Localisation, Split } from './types';

export type FileName = keyof typeof enLocal;

const LEFT_SEPARATOR = '{{';
const RIGHT_SEPARATOR = '}}';

export type TFunction = Localisation<typeof enLocal, typeof LEFT_SEPARATOR, typeof RIGHT_SEPARATOR>['translation'];

const FIRST_INDEX = 0;

const t: TFunction = (localText, params) => {
  const [file, key] = localText.split('|') as Split<typeof localText, '|'>;
  if (!key) {
    return file as string;
  }
  //@ts-ignore
  const local = enLocal[file];

  const text = local[key as never] as string;

  if (!text) {
    // eslint-disable-next-line no-console
    console.error(`Json in file "${file}" does not have key "${key}"`);
  }

  if (!params || !text) {
    return text ?? key ?? localText;
  }

  const textParts = text.split(LEFT_SEPARATOR);

  const parsedParts = [];

  for (let index = 0; index < textParts.length; index++) {
    if (index === FIRST_INDEX) {
      parsedParts.push(textParts[index]);
      continue;
    }
    const part = textParts[index];

    const [paramKey, rest] = part.split(RIGHT_SEPARATOR);

    //@ts-ignore
    const value = params[paramKey.trim()];

    if (isExist(value)) {
      parsedParts.push(value);
    }

    parsedParts.push(rest);
  }

  return parsedParts.join('');
};

export const useTranslation = (scopes?: Array<string> | string) => {
  return {
    t
  };
};

export const i18n = { t };
