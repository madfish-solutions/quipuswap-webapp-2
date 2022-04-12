/* eslint-disable @typescript-eslint/no-type-alias */
import { isExist } from '@shared/helpers';

import { en as enLocal } from './locales';
type Params = Record<string, number | string>;

export type FileName = keyof typeof enLocal;

type Values = typeof enLocal[FileName];

type KeysOfUnion<T> = T extends T ? keyof T : never;

export type Key = KeysOfUnion<Values>;

type StringKey<Type> = string & keyof Type;

type LocalisationText<
  Local,
  _FileName extends string & keyof Local,
  _Key extends string & keyof Local[_FileName]
> = Local[_FileName][_Key] extends string ? `${_FileName}|${_Key}` : never;

type Localisation<Local> = {
  translation<_Key extends string & keyof Local>(
    localText: LocalisationText<Local, _Key, StringKey<Local[_Key]>>,
    params?: Params
  ): string;
};

export type TFunction = Localisation<typeof enLocal>['translation'];

const FIRST_INDEX = 0;

const t: TFunction = (localText, params?) => {
  const [file, key] = localText.split('|') as [FileName, Key];
  if (!key) {
    return file as string;
  }

  const local = enLocal[file];

  const text = local[key as never] as string;

  if (!text) {
    // eslint-disable-next-line no-console
    console.error(`Json in file "${file}" does not have key "${key}"`);
  }

  if (!params || !text) {
    return text ?? key ?? localText;
  }

  const textParts = text.split('{{');

  const parsedParts = [];

  for (let index = 0; index < textParts.length; index++) {
    if (index === FIRST_INDEX) {
      parsedParts.push(textParts[index]);
      continue;
    }
    const part = textParts[index];

    const [paramKey, rest] = part.split('}}');

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
