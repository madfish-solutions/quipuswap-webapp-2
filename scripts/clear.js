/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const { unlink } = require('fs/promises');

const { PUBLIC_DIR_PATH, ROBOTS_TXT, SITEMAP } = require('./const.js');

const clear = async () => {
  try {
    // Delete
    await unlink(`${PUBLIC_DIR_PATH}/${ROBOTS_TXT}`);

    console.log(`${ROBOTS_TXT} was successfully deleted`);
  } catch (error) {
    console.log(`No file ${ROBOTS_TXT}`);
  }

  try {
    // Delete
    await unlink(`${PUBLIC_DIR_PATH}/${SITEMAP}`);

    console.log(`${SITEMAP} was successfully deleted`);
  } catch (error) {
    console.log(`No file ${SITEMAP}`);
  }

  console.log('Clearing finished');
};

void clear();
