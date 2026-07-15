import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 500, height: 800 });
  await page.goto('http://localhost:5173/documentation');
  await page.waitForTimeout(2000);
  
  const hamburger = await page.$('#nav-hamburger');
  if (hamburger) {
    const isVisible = await page.evaluate(el => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        display: style.display,
        visibility: style.visibility,
        zIndex: style.zIndex,
        rect: rect
      };
    }, hamburger);
    console.log('Hamburger computed style:', isVisible);
    
    // Check what is at its center
    const center_x = isVisible.rect.left + isVisible.rect.width / 2;
    const center_y = isVisible.rect.top + isVisible.rect.height / 2;
    const elAtPoint = await page.evaluate((x, y) => {
      const el = document.elementFromPoint(x, y);
      return el ? el.className + ' (' + el.tagName + ')' : null;
    }, center_x, center_y);
    console.log('Element at point:', elAtPoint);
  } else {
    console.log('Hamburger not found');
  }
  
  await browser.close();
})();
