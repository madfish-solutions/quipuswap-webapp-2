import { I18n } from 'i18n';
import path from 'path';

const i18n = new I18n();

i18n.configure({
  locales: ['en', 'de', 'fr'],
  directory: path.join(__dirname, 'locales')
})

// export const useTranslation = () => {
//   const t = i18n;

//   console.log(i18n.__('hello'));

//   return { t };
// };
