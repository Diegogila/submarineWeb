const puppeteer = require('puppeteer');
const puppeteerConfig = {
    headless: true,
    ignoreDefaultArgs: ['--disable-extensions'],
    executablePath: '/bin/google-chrome-stable' // Ruta de ejecución de Chrome en WSL
  };

(async () => {
    const browser = await puppeteer.launch(puppeteerConfig);
    const page = await browser.newPage();
        await page.goto('https://www.anaseguros.com.mx/anaweb/');
        await page.screenshot({ path: 'screenshot.png' });
    await browser.close();
  })();