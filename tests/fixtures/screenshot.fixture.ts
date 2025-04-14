import { test as base } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = './test-results';

const getTimestampedFileName = (prefix: string) => {
    const date = new Date();
    const timestamp = date.toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '-')
        .split('.')[0];
    return path.join(SCREENSHOT_DIR, `${timestamp}-${prefix}.png`);
};

const cleanScreenshotDirectory = () => {
    if (fs.existsSync(SCREENSHOT_DIR)) {
        const files = fs.readdirSync(SCREENSHOT_DIR);
        for (const file of files) {
            const filePath = path.join(SCREENSHOT_DIR, file);
            if (fs.lstatSync(filePath).isFile() && file.endsWith('.png')) {
                fs.unlinkSync(filePath);
            }
        }
    } else {
        fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
};

export type TestFixtures = {
    autoScreenshot: void;
};

const fixture = base.extend<TestFixtures>({
    autoScreenshot: [async ({ page }, use, testInfo) => {
        // Clean screenshot directory before first test
        if (testInfo.workerIndex === 0 && testInfo.retry === 0) {
            cleanScreenshotDirectory();
        }

        // Take screenshot before test
        const beforePath = getTimestampedFileName(`${testInfo.title}-before`);
        await page.screenshot({ path: beforePath });
        await testInfo.attach('before-test', {
            path: beforePath,
            contentType: 'image/png'
        });

        await use();

        // Take screenshot after test
        const afterPath = getTimestampedFileName(`${testInfo.title}-after`);
        await page.screenshot({ path: afterPath, fullPage: true });
        await testInfo.attach('after-test', {
            path: afterPath,
            contentType: 'image/png'
        });
    }, { auto: true }]
});

export { fixture as test };