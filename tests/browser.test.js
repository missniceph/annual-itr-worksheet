// Browser test: every route, both languages, phone and laptop sizes.
// Run with: npm run test:browser   (needs Playwright + Chromium installed)
// Optional: SCREENSHOTS=/some/folder npm run test:browser
const path = require('path');
const assert = require('assert/strict');
const { chromium } = require('playwright');

const PAGE = 'file://' + path.resolve(__dirname, '..', 'index.html');
const SHOTS = process.env.SCREENSHOTS;

const routes = [
  { name: '8-pure', answers: { option: '8', incomeType: 'pure' },
    values: { grossSales: '1,000,000', quarterly: '50000' }, due: '₱60,000', payable: '₱10,000', installment: ['₱5,000', '₱5,000'] },
  { name: '8-mixed', answers: { option: '8', incomeType: 'mixed' },
    values: { compensation: '500000', grossSales: '300000' }, due: '₱66,500', payable: '₱66,500' },
  { name: 'grad-osd-pure', answers: { option: 'graduated', incomeType: 'pure', deduction: 'osd' },
    values: { grossSales: '1000000' }, due: '₱62,500', payable: '₱62,500' },
  { name: 'grad-osd-mixed', answers: { option: 'graduated', incomeType: 'mixed', deduction: 'osd' },
    values: { compensation: '500000', grossSales: '300000' }, due: '₱78,500', payable: '₱78,500' },
  { name: 'grad-itemized-pure', answers: { option: 'graduated', incomeType: 'pure', deduction: 'itemized' },
    values: { grossSales: '1000000', ded10A: '300000', ded10B: '50000', ded10C: '25000', otherIncome: '10000', cwt2307: '20000' },
    due: '₱69,500', payable: '₱49,500' },
  { name: 'grad-itemized-mixed', answers: { option: 'graduated', incomeType: 'mixed', deduction: 'itemized' },
    values: { compensation: '500000', grossSales: '300000', ded10A: '100000', comp2316: '42500' },
    due: '₱82,500', payable: '₱40,000' },
  { name: 'overpayment', answers: { option: '8', incomeType: 'pure' },
    values: { grossSales: '1000000', quarterly: '45000', cwt2307: '30000' }, due: '₱60,000', overpayment: '₱15,000' },
  { name: 'rounding', answers: { option: '8', incomeType: 'pure' },
    values: { grossSales: '1000000.50', quarterly: '100.49' }, due: '₱60,000', payable: '₱59,900' }
];
const viewports = { phone: { width: 390, height: 844 }, laptop: { width: 1366, height: 800 } };

async function checkPage(page, label) {
  const text = await page.locator('body').innerText();
  assert.ok(!text.includes('⟦'), `${label}: missing translation key`);
  assert.ok(await page.getByTestId('banner').isVisible(), `${label}: banner not visible`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 0, `${label}: horizontal scroll of ${overflow}px`);
}

async function runRoute(page, route, lang, label) {
  await page.goto(PAGE + '?lang=' + lang);
  await checkPage(page, label + ' welcome');
  await page.getByTestId('start').click();
  const answers = Object.assign({ eligSales: 'yes', eligActivities: 'no' }, route.answers);
  for (let guard = 0; guard < 30; guard++) {
    const step = await page.locator('#app').getAttribute('data-step');
    if (step === 'results') break;
    await checkPage(page, `${label} ${step}`);
    if (answers[step] !== undefined) {
      await page.locator(`[data-choose="${step}"][data-value="${answers[step]}"]`).click();
    } else {
      const val = route.values[step] || '';
      await page.getByTestId('amount').fill(val);
      await page.getByTestId('next').click();
    }
  }
  assert.equal(await page.locator('#app').getAttribute('data-step'), 'results', label + ': did not reach results');
  await checkPage(page, label + ' results');
  assert.equal(await page.getByTestId('tax-due').innerText(), route.due, label + ': tax due');
  if (route.payable) assert.equal(await page.getByTestId('payable').innerText(), route.payable, label + ': payable');
  if (route.overpayment) {
    assert.equal(await page.getByTestId('overpayment').innerText(), route.overpayment, label + ': overpayment');
    assert.equal(await page.locator('input[name="over"]').count(), 3, label + ': three overpayment options');
    await page.locator('input[name="over"][value="refund"]').check();
    assert.ok((await page.locator('.ebir').innerText()).includes(lang === 'fil' ? 'Ipa-refund' : 'To be refunded'));
    assert.equal(await page.getByTestId('installment').count(), 0, label + ': no installment on overpayment');
  }
  if (route.installment) {
    await page.getByTestId('installment').check();
    assert.equal(await page.getByTestId('pay-now').innerText(), route.installment[0]);
    assert.equal(await page.getByTestId('pay-later').innerText(), route.installment[1]);
    assert.ok((await page.locator('.ebir').innerText()).includes('26'));
  }
  const ebir = await page.locator('.ebir').innerText();
  assert.ok(ebir.includes('[confirm'), label + ': [confirm] markers shown');
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${label}-results.png`), fullPage: true });

  // Copy summary
  await page.getByTestId('copy').click();
  await page.waitForTimeout(150);
  const status = await page.locator('.copy-status').innerText();
  assert.ok(status.length > 0, label + ': copy status shown');

  // Language switch mid-flow keeps the numbers
  const other = lang === 'en' ? 'fil' : 'en';
  await page.locator(`[data-lang="${other}"]`).click();
  assert.equal(await page.getByTestId('tax-due').innerText(), route.due, label + ': tax due after language switch');
  await checkPage(page, label + ' results ' + other);
  await page.locator(`[data-lang="${lang}"]`).click();

  await page.getByTestId('to-deadline').click();
  await checkPage(page, label + ' deadline');
  assert.ok(await page.getByTestId('deadline').isVisible());
  if (SHOTS && route.name === '8-pure') await page.screenshot({ path: path.join(SHOTS, `${label}-deadline.png`), fullPage: true });

  await page.getByTestId('restart').click();
  assert.equal(await page.locator('#app').getAttribute('data-step'), 'welcome');
}

(async () => {
  const browser = await chromium.launch();
  let count = 0;
  try {
    for (const [vpName, vp] of Object.entries(viewports)) {
      for (const lang of ['en', 'fil']) {
        const context = await browser.newContext({ viewport: vp, permissions: ['clipboard-read', 'clipboard-write'] });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        for (const route of routes) {
          await runRoute(page, route, lang, `${vpName}-${lang}-${route.name}`);
          count++;
        }

        // Stop screens
        for (const [q, v] of [['eligSales', 'no'], ['eligActivities', 'yes']]) {
          await page.goto(PAGE + '?lang=' + lang);
          await page.getByTestId('start').click();
          if (q === 'eligActivities') await page.locator('[data-choose="eligSales"][data-value="yes"]').click();
          await page.locator(`[data-choose="${q}"][data-value="${v}"]`).click();
          assert.ok(await page.getByTestId('stop').isVisible(), `${vpName}-${lang} stop ${q}`);
          assert.ok((await page.getByTestId('stop').innerText()).includes('1701'));
          await checkPage(page, `${vpName}-${lang} stop ${q}`);
          if (SHOTS && q === 'eligSales') await page.screenshot({ path: path.join(SHOTS, `${vpName}-${lang}-stop.png`), fullPage: true });
          count++;
        }

        // "Not sure" on the 8% question
        await page.goto(PAGE + '?lang=' + lang);
        await page.getByTestId('start').click();
        await page.locator('[data-choose="eligSales"][data-value="yes"]').click();
        await page.locator('[data-choose="eligActivities"][data-value="no"]').click();
        await page.locator('[data-choose="option"][data-value="notsure"]').click();
        assert.ok(await page.getByTestId('notsure').isVisible());
        assert.equal(await page.locator('#app').getAttribute('data-step'), 'option');
        if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${vpName}-${lang}-notsure.png`), fullPage: true });

        // Invalid input is rejected
        await page.locator('[data-choose="option"][data-value="8"]').click();
        await page.locator('[data-choose="incomeType"][data-value="pure"]').click();
        await page.getByTestId('amount').fill('-500');
        await page.getByTestId('next').click();
        assert.equal(await page.locator('#app').getAttribute('data-step'), 'grossSales', 'negative rejected');
        assert.ok(await page.locator('.error').isVisible());
        if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${vpName}-${lang}-input.png`), fullPage: true });

        // Dark mode renders
        await page.emulateMedia({ colorScheme: 'dark' });
        await page.goto(PAGE + '?lang=' + lang);
        const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
        assert.notEqual(bg, 'rgb(246, 248, 247)', 'dark background applied');
        if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${vpName}-${lang}-dark-welcome.png`), fullPage: true });
        await page.emulateMedia({ colorScheme: 'light' });

        assert.deepEqual(errors, [], `${vpName}-${lang}: page errors`);
        await context.close();
      }
    }
    console.log(`Browser tests passed: ${count} route runs across 2 languages × 2 screen sizes.`);
  } catch (e) {
    console.error('Browser test FAILED:', e.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
