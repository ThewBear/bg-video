const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const urls = {
  bg: `file:${path.join(__dirname, "scene.html")}`,
  trends: "https://trends.google.com/trends/hottrends/visualize?nrow=3&ncol=3",
};

(async () => {
  const browser = await chromium.launch();
  for (key of Object.keys(urls)) {
    const url = urls[key];
    const page = await browser.newPage({
      recordVideo: {
        dir: "videos",
        size: { width: 1920, height: 1080 },
      },

      viewport: { width: 1920, height: 1080 },
    });

    await page.goto(url);

    await page.waitForTimeout(60 * 1000);
    await page.close();
    const videoPath = await page.video().path();
    const ext = path.extname(videoPath);
    const dir = path.dirname(videoPath);
    fs.renameSync(videoPath, dir + "/" + key + ext);
  }

  await browser.close();
})();
