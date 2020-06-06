const puppeteer = require('puppeteer');

module.exports = (router) => {
  const browser = puppeteer.launch();
  router.use('/performance/browser', async (_, res) => res.send((await browser).wsEndpoint()));
};
