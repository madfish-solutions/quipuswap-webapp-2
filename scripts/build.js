const { copyFile } = require('fs/promises');
const {
  PUBLIC,
  PUBLIC_DIR_PATH,
  ROBOTS_TXT,
  ROBOTS_TXT_DEV,
  ROBOTS_TXT_PROD,
  SITEMAP,
  SITEMAP_PROD
} = require('./const.js');

console.log('___ PUBLIC BUILD: ___', PUBLIC);

const copyRobotsTxt = async () => {
  try {
    const fileName = PUBLIC ? ROBOTS_TXT_PROD : ROBOTS_TXT_DEV;
    await copyFile(`${PUBLIC_DIR_PATH}/${fileName}`, `${PUBLIC_DIR_PATH}/${ROBOTS_TXT}`);
    console.log(`${ROBOTS_TXT} was created from ${fileName}`);
  } catch (error) {
    console.error(`Failed to create ${ROBOTS_TXT}`, error);
  }
};

const copySitemap = async () => {
  if (!PUBLIC) {
    console.error(`Skip to copy ${SITEMAP}`);
    return;
  }
  try {
    await copyFile(`${PUBLIC_DIR_PATH}/${SITEMAP_PROD}`, `${PUBLIC_DIR_PATH}/${SITEMAP}`);
    console.log(`${SITEMAP} was created from ${SITEMAP_PROD}`);
  } catch (error) {
    console.error(`Failed to create ${SITEMAP}`, error);
  }
};

void copyRobotsTxt();
void copySitemap();
