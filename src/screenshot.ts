import { chromium } from "@playwright/test";
import * as path from "path";
import { settings } from "./settings.js";

export async function takeScreenshot(html: string): Promise<string> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({
    width: settings.screenshot.width,
    height: settings.screenshot.height,
  });

  await page.setContent(html, { waitUntil: "networkidle" });

  const outputPath = path.join(process.cwd(), "screenshot.png");
  await page.screenshot({ path: outputPath, fullPage: false });

  await browser.close();

  console.info(`→ スクリーンショット保存: ${outputPath}`);
  return outputPath;
}
