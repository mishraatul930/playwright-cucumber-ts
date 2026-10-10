import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, Browser } from '@playwright/test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as allure from 'allure-js-commons';
import { AllureCucumberTestRuntime } from 'allure-cucumberjs';
import { CustomWorld } from '../utils/world';

const { setGlobalTestRuntime } = require('allure-js-commons/sdk/runtime') as {
  setGlobalTestRuntime: (runtime: AllureCucumberTestRuntime) => void;
};

let browser: Browser;

BeforeAll(async () => {
  setGlobalTestRuntime(new AllureCucumberTestRuntime());
  const headed = process.env.HEADED === 'true';
  if (headed) {
    setDefaultTimeout(30_000);
  }
  browser = await chromium.launch({
    headless: !headed,
    slowMo: headed ? 500 : 0,
  });
});

AfterAll(async () => {
  await browser.close();
});

Before(async function (this: CustomWorld) {
  this.videoDir = await mkdtemp(join(tmpdir(), 'playwright-cucumber-video-'));
  this.context = await browser.newContext({
    recordVideo: { dir: this.videoDir },
  });
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld, scenario) {
  const page = this.page;
  const context = this.context;
  const video = page?.video();
  let pageClosed = false;
  let contextClosed = false;

  try {
    if (scenario.result?.status === Status.FAILED && page) {
      const screenshot = await page.screenshot();
      await allure.attachment('Failure screenshot', screenshot, {
        contentType: 'image/png',
        fileExtension: 'png',
      });
    }

    await page?.close();
    pageClosed = true;
    await context?.close();
    contextClosed = true;

    if (video) {
      await allure.attachment('Scenario video', await readFile(await video.path()), {
        contentType: 'video/webm',
        fileExtension: 'webm',
      });
    }
  } finally {
    if (page && !pageClosed && !page.isClosed()) {
      await page.close();
    }
    if (context && !contextClosed) {
      await context.close();
    }
    if (this.videoDir) {
      await rm(this.videoDir, { recursive: true, force: true });
    }
  }
});