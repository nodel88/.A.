const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(err.message);
  });

  const filePath = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(filePath, { waitUntil: 'networkidle' });

  await page.waitForTimeout(2000);

  // Check basic elements
  const title = await page.title();
  console.log('Page title:', title);

  const username = await page.$('#username');
  const hasUsername = username !== null;
  console.log('Has username element:', hasUsername);

  const gameCards = await page.$$('.game-card');
  console.log('Game cards count:', gameCards.length);

  const playBtns = await page.$$('.play-btn');
  console.log('Play buttons count:', playBtns.length);

  if (errors.length > 0) {
    console.log('\nConsole Errors:');
    errors.forEach(e => console.log('  -', e));
  } else {
    console.log('\nNo console errors detected!');
  }

  await browser.close();

  if (errors.length > 0) {
    process.exit(1);
  }
})();
