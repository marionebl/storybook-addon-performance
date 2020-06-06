/* eslint-disable @typescript-eslint/no-var-requires */
const pp = require('puppeteer-core');
const memo = require('memoize-one').default;

const configureFs = memo(
  () =>
    new Promise((resolve, reject) => {
      BrowserFS.configure(
        {
          fs: 'IndexedDB',
          options: {
            storeName: 'puppeteer-core'
          }
        },
        function (e) {
          if (e) {
            // An error happened!
            reject(e);
          }
          resolve();
        },
      );
    }),
);

const _connect = pp.connect.bind(pp);
pp.connect = async (...args) => {
  await configureFs();
  return _connect(...args);
};

module.exports = pp;
