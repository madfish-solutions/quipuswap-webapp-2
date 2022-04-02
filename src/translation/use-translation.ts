/* eslint-disable @typescript-eslint/no-type-alias */
import { en as enLocal } from './locales';

export type TFunction = (localText: `${FileName}|${string}`, params: Record<string, number | string>) => string;

export type FileName = keyof typeof enLocal;

type Values = typeof enLocal[FileName];

type Key = keyof Values; //TODO: try to get real keys of obj

const t = (localText: `${FileName}|${string}` | string, params?: Record<string, number | string>) => {
  const [file, key] = localText.split('|') as [FileName, Key];
  if (!key) {
    return file as string;
  }

  const local = enLocal[file];

  const text = local[key] as string;

  if (!params) {
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
