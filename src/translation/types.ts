/* eslint-disable @typescript-eslint/no-type-alias */
type StringKey<Type> = string & keyof Type;

type TrimLeft<T extends string> = T extends ` ${infer Rest}` ? TrimLeft<Rest> : T;
type TrimRight<T extends string> = T extends `${infer Rest} ` ? TrimRight<Rest> : T;

export type Trim<T extends string> = TrimLeft<TrimRight<T>>;

type ArrayKeysToObject<T extends [...string[]]> = { [K in T[number]]: string | number };

export type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

//#region localisation key
type LocalisationKey<
  Local,
  _FileName extends StringKey<Local>,
  _Key extends StringKey<Local[_FileName]>
> = Local[_FileName][_Key] extends string ? `${_FileName}|${_Key}` : never;
//#endregion localisation key

//#region localisation params
type HasParams<
  Str extends string,
  LeftSeparator extends string,
  RightSeparator extends string
> = Str extends `${string}${LeftSeparator}${string}${RightSeparator}${string}` ? Str : '';

type ExtractTranslationParams<
  LocalisationText extends string,
  LeftSeparator extends string,
  RightSeparator extends string
> = string extends LocalisationText
  ? string[]
  : LocalisationText extends ''
  ? []
  : LocalisationText extends `${string}${LeftSeparator}${infer U}${RightSeparator}${infer Y}`
  ? [Trim<U>, ...ExtractTranslationParams<HasParams<Y, LeftSeparator, RightSeparator>, LeftSeparator, RightSeparator>]
  : [LocalisationText];

export type TranslationParamsInterfaceFactory<
  LocalisationText extends string,
  LeftSeparator extends string,
  RightSeparator extends string
> = ArrayKeysToObject<ExtractTranslationParams<LocalisationText, LeftSeparator, RightSeparator>>;

type LocalisationParams<
  Local,
  LeftSeparator extends string,
  RightSeparator extends string,
  _FileName extends StringKey<Local>,
  _Key extends StringKey<Local[_FileName]>
> = Local[_FileName][_Key] extends string
  ? TranslationParamsInterfaceFactory<Local[_FileName][_Key], LeftSeparator, RightSeparator>
  : never;
//#endregion localisation params

export type Localisation<Local, LeftSeparator extends string, RightSeparator extends string> = {
  translation<_FileName extends string & keyof Local, _Key extends StringKey<Local[_FileName]>>(
    localText: LocalisationKey<Local, _FileName, _Key>,
    params?: LocalisationParams<Local, LeftSeparator, RightSeparator, _FileName, _Key>
  ): string;
};
