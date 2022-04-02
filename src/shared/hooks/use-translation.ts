/* eslint-disable @typescript-eslint/no-explicit-any */
export type TFunction = (text: string, option?: any) => string;

const t: TFunction = (text: string, option) => text;

export const useTranslation = (options?: string | string[]) => {
  return {
    t
  };
};

export const i18n = {
  t
};
