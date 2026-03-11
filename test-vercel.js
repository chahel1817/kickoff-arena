const puppeteer = require('puppeteer');

(async () => {
    console.log("Starting browser...");
    const browser = await puppeteer.launch({
        headless: "new"
    });
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
    page.on('pageerror', error => console.error('BROWSER_PAGEERROR:', error.message));
    page.on('response', response => {
        if (!response.ok()) {
            console.log('BROWSER_API_ERROR:', response.status(), response.url());
        }
    });

    console.log("Navigating to https://kickoff-arena.vercel.app...");
    try {
        await page.goto('https://kickoff-arena.vercel.app', { waitUntil: 'networkidle2', timeout: 15000 });
    } catch (e) {
        console.error("Navigation error:", e.message);
    }

    const html = await page.content();
    console.log("HTML length:", html.length);
    const mainHTML = await page.$eval('main', el => el.innerHTML).catch(() => 'No <main> tag found');
    console.log("Main innerHTML:", mainHTML);

    await browser.close();
})();
