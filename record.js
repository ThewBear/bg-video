const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    recordVideo: {
      dir: ".",
      size: { width: 1920, height: 1080 },
    },

    viewport: { width: 1920, height: 1080 },
  });
  await page.goto(`file:${path.join(__dirname, "scene.html")}`);
  //   await page.screenshot({ path: `example.png` });
  await page.waitForTimeout(70 * 1000);
  await browser.close();
})();
