/* eslint-disable @typescript-eslint/no-type-alias */
import { en as enLocal } from './locales';
type Params = Record<string, number | string>;

export type FileName = keyof typeof enLocal;

type Values = typeof enLocal[FileName];

type KeysOfUnion<T> = T extends T ? keyof T : never;

export type Key = KeysOfUnion<Values>;

export type TFunction = (localText: `${FileName}|${Key}`, params: Params) => string;

const t = (localText: `${FileName}|${Key}`, params?: Record<string, number | string>) => {
  const [file, key] = localText.split('|') as [FileName, Key];
  if (!key) {
    return file as string;
  }

  const local = enLocal[file];

  const text = local[key as never] as string;

  if (!text) {
    // eslint-disable-next-line no-console
    console.error(`File ${file} does not have key ${key}`);
  }

  if (!params || !text) {
    return text ?? key ?? localText;
  }

  const textParts = text.split('{{');

  const parsedParts = [];

  for (let index = 0; index < textParts.length; index++) {
    if (index === 0) {
      parsedParts.push(textParts[index]);
      continue;
    }
    const part = textParts[index];

    const [paramKey, rest] = part.split('}}');

    const value = params[paramKey.trim()];

    if (value) {
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
