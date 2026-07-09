const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('response', async response => {
    if (response.status() === 500) {
      console.log('500 ERROR URL:', response.url());
      console.log('500 ERROR BODY:', await response.text());
    }
  });
  
  await page.goto('http://localhost:5174');
  await page.waitForTimeout(2000); 
  await browser.close();
})();
