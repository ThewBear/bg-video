const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const urls = {
  bg: `file:${path.join(__dirname, "scene.html")}`,
  trends: "https://trends.google.com/trends/hottrends/visualize?nrow=3&ncol=3",
};

(async () => {
  const browser = await chromium.launch();
  const videoPathsPromise = Object.keys(urls).map(async (key) => {
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
    return [await page.video().path(), key];
  });

  const videoPaths = await Promise.all(videoPathsPromise);

  await browser.close();

  videoPaths.forEach((videoPath) => {
    const ext = path.extname(videoPath[0]);
    const dir = path.dirname(videoPath[0]);
    fs.renameSync(videoPath[0], dir + "/" + videoPath[1] + ext);
  });
})();
