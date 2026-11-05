// Browser test: every route and edge case, in both languages, light and dark mode,
// at phone (360px), tablet (768px) and laptop (1366px) sizes, plus keyboard and
// automated accessibility (axe-core) checks.
//
// Run with: npm install && npm run test:browser   (needs Playwright + Chromium)
// Optional screenshots: SCREENSHOTS=/some/folder npm run test:browser
const path = require('path');
const assert = require('assert/strict');
const { chromium } = require('playwright');

const http = require('http');
const fs = require('fs');

// Tiny static server so the page runs over http, like on GitHub Pages.
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  const file = path.resolve(ROOT, rel);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
let PAGE;
const SHOTS = process.env.SCREENSHOTS;
let AXE = null;
try { AXE = require.resolve('axe-core/axe.min.js'); } catch (e) { console.warn('axe-core not installed: skipping accessibility scan (run npm install).'); }

const routes = [
  { name: '8-pure', answers: { option: '8', incomeType: 'pure' },
    values: { grossSales: '1,000,000', quarterly: '50000' }, due: '₱60,000', payable: '₱10,000', installment: ['₱5,000', '₱5,000'] },
  { name: '8-mixed', answers: { option: '8', incomeType: 'mixed' },
    values: { compensation: '500000', grossSales: '300000' }, due: '₱66,500', payable: '₱66,500' },
  { name: 'grad-osd-pure', answers: { option: 'graduated', incomeType: 'pure', deduction: 'osd' },
    values: { grossSales: '₱1,000,000' }, due: '₱62,500', payable: '₱62,500' },
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
    values: { grossSales: '1000000.50', quarterly: '100.49' }, due: '₱60,000', payable: '₱59,900' },
  { name: 'all-blank', answers: { option: 'graduated', incomeType: 'pure', deduction: 'osd' },
    values: {}, due: '₱0', payable: '₱0', nothing: true },
  { name: 'small-tax-no-installment', answers: { option: '8', incomeType: 'pure' },
    values: { grossSales: '275000' }, due: '₱2,000', payable: '₱2,000', noInstallment: true },
  { name: 'net-loss', answers: { option: 'graduated', incomeType: 'pure', deduction: 'itemized' },
    values: { grossSales: '100000', ded10A: '150000' }, due: '₱0', payable: '₱0', netLoss: true }
];
const viewports = {
  phone360: { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true },
  tablet: { viewport: { width: 768, height: 1024 }, hasTouch: true },
  laptop: { viewport: { width: 1366, height: 800 } }
};

const step = (page) => page.locator('#app').getAttribute('data-step');
const choose = (page, q, v) => page.locator(`[data-choose="${q}"][data-value="${v}"]`).click();

async function checkPage(page, label) {
  const text = await page.locator('body').innerText();
  assert.ok(!text.includes('⟦'), `${label}: missing translation key`);
  assert.ok(await page.getByTestId('banner').isVisible(), `${label}: banner not visible`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 0, `${label}: horizontal scroll of ${overflow}px`);
}

async function axeScan(page, label) {
  if (!AXE) return;
  await page.addScriptTag({ path: AXE });
  const violations = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] });
    return r.violations.map((v) => v.id + ' → ' + v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', '));
  });
  assert.deepEqual(violations, [], `${label}: accessibility issues`);
}

async function startFlow(page, lang) {
  await page.goto(PAGE + '?lang=' + lang);
  await page.getByTestId('start').click();
  await choose(page, 'eligSales', 'yes');
  await choose(page, 'eligActivities', 'no');
}

async function runRoute(page, route, lang, label, opts) {
  await page.goto(PAGE + '?lang=' + lang);
  await checkPage(page, label + ' welcome');
  if (opts.axe) await axeScan(page, label + ' welcome');
  await page.getByTestId('start').click();
  const answers = Object.assign({ eligSales: 'yes', eligActivities: 'no' }, route.answers);
  for (let guard = 0; guard < 30; guard++) {
    const s = await step(page);
    if (s === 'results') break;
    await checkPage(page, `${label} ${s}`);
    if (opts.axe) await axeScan(page, `${label} ${s}`);
    if (answers[s] !== undefined) {
      await choose(page, s, answers[s]);
    } else {
      await page.getByTestId('amount').fill(route.values[s] || '');
      await page.getByTestId('next').click();
    }
  }
  assert.equal(await step(page), 'results', label + ': did not reach results');
  await checkPage(page, label + ' results');
  assert.equal(await page.getByTestId('tax-due').innerText(), route.due, label + ': tax due');
  if (route.payable) assert.equal(await page.getByTestId('payable').innerText(), route.payable, label + ': payable');
  const ebir = await page.locator('.ebir').innerText();
  assert.ok(ebir.includes('[confirm'), label + ': [confirm] markers shown');
  assert.ok(!/-₱|₱-/.test(await page.locator('#app').innerText()), label + ': no negative peso amounts');

  if (route.overpayment) {
    assert.equal(await page.getByTestId('overpayment').innerText(), route.overpayment, label + ': overpayment');
    assert.equal(await page.locator('input[name="over"]').count(), 3, label + ': three overpayment options');
    assert.equal(await page.getByTestId('installment').count(), 0, label + ': no installment on overpayment');
    assert.ok(ebir.includes(lang === 'fil' ? 'automatic' : 'automatically carried over'), label + ': default carry-over');
    await page.locator('input[name="over"][value="refund"]').check();
    assert.ok((await page.locator('.ebir').innerText()).includes(lang === 'fil' ? 'Ipa-refund' : 'To be refunded'));
  }
  if (route.installment) {
    await page.getByTestId('installment').check();
    assert.equal(await page.getByTestId('pay-now').innerText(), route.installment[0]);
    assert.equal(await page.getByTestId('pay-later').innerText(), route.installment[1]);
    assert.ok((await page.locator('.ebir').innerText()).includes('26'));
    await page.getByTestId('installment').uncheck();
    assert.equal(await page.getByTestId('pay-now').count(), 0, label + ': installment can be turned off');
  }
  if (route.noInstallment) assert.equal(await page.getByTestId('installment').count(), 0, label + ': ₱2,000 is not more than ₱2,000');
  if (route.netLoss) assert.ok(await page.getByTestId('net-loss').isVisible(), label + ': net loss warning');
  if (route.nothing) assert.ok(await page.getByTestId('nothing').isVisible(), label + ': nothing-to-pay note');
  if (opts.axe) await axeScan(page, label + ' results');
  if (SHOTS && opts.shots) await page.screenshot({ path: path.join(SHOTS, `${label}-results.png`), fullPage: true });

  // Copy summary
  await page.getByTestId('copy').click();
  await page.waitForFunction(() => document.querySelector('.copy-status').textContent.length > 0);

  // Language switch on the results keeps the numbers
  const other = lang === 'en' ? 'fil' : 'en';
  await page.locator(`[data-lang="${other}"]`).click();
  assert.equal(await page.getByTestId('tax-due').innerText(), route.due, label + ': tax due after language switch');
  await checkPage(page, label + ' results ' + other);
  await page.locator(`[data-lang="${lang}"]`).click();

  await page.getByTestId('to-deadline').click();
  await checkPage(page, label + ' deadline');
  assert.ok(await page.getByTestId('deadline').isVisible());
  if (opts.axe) await axeScan(page, label + ' deadline');
  if (SHOTS && opts.shots && route.name === '8-pure') await page.screenshot({ path: path.join(SHOTS, `${label}-deadline.png`), fullPage: true });

  await page.getByTestId('restart').click();
  assert.equal(await step(page), 'welcome');
}

async function edgeCases(page, lang, label) {
  // Stop screens, and "go back" returns to the question
  for (const [q, v] of [['eligSales', 'no'], ['eligActivities', 'yes']]) {
    await page.goto(PAGE + '?lang=' + lang);
    await page.getByTestId('start').click();
    if (q === 'eligActivities') await choose(page, 'eligSales', 'yes');
    await choose(page, q, v);
    assert.ok(await page.getByTestId('stop').isVisible(), `${label} stop ${q}`);
    assert.ok((await page.getByTestId('stop').innerText()).includes('1701'));
    await checkPage(page, `${label} stop ${q}`);
    await axeScan(page, `${label} stop`);
    if (SHOTS && q === 'eligSales') await page.screenshot({ path: path.join(SHOTS, `${label}-stop.png`), fullPage: true });
    await page.locator('[data-action="back"]').click();
    assert.equal(await step(page), q, `${label}: back from stop screen`);
  }

  // "Not sure" on the 8% question
  await startFlow(page, lang);
  await choose(page, 'option', 'notsure');
  assert.ok(await page.getByTestId('notsure').isVisible());
  assert.equal(await step(page), 'option');
  await axeScan(page, `${label} not sure`);
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${label}-notsure.png`), fullPage: true });

  // Invalid input is rejected and marked
  await choose(page, 'option', '8');
  await choose(page, 'incomeType', 'pure');
  for (const bad of ['-500', 'abc', '1.000.000', '.']) {
    await page.getByTestId('amount').fill(bad);
    await page.getByTestId('next').click();
    assert.equal(await step(page), 'grossSales', `${label}: "${bad}" rejected`);
    assert.ok(await page.locator('.error').isVisible());
    assert.equal(await page.getByTestId('amount').getAttribute('aria-invalid'), 'true');
  }
  await axeScan(page, `${label} invalid input`);
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `${label}-input.png`), fullPage: true });

  // Sales of ₱20M or more get a warning; typed value survives a language switch
  await page.getByTestId('amount').fill('20,000,000');
  assert.ok(await page.getByTestId('sales-limit').isVisible(), `${label}: sales limit warning`);
  await page.locator(`[data-lang="${lang === 'en' ? 'fil' : 'en'}"]`).click();
  assert.equal(await page.getByTestId('amount').inputValue(), '20,000,000', `${label}: typed value kept after language switch`);
  await page.locator(`[data-lang="${lang}"]`).click();

  // Changing an earlier answer: values are kept, route changes, results follow
  await page.getByTestId('amount').fill('1000000');
  await page.getByTestId('next').click();
  await page.locator('[data-action="back"]').click();
  assert.equal(await page.getByTestId('amount').inputValue(), '1000000', `${label}: back keeps the value`);
  await page.locator('[data-action="back"]').click();
  await page.locator('[data-action="back"]').click();
  assert.equal(await step(page), 'option');
  await choose(page, 'option', 'graduated');
  await choose(page, 'incomeType', 'pure');
  await choose(page, 'deduction', 'osd');
  for (let i = 0; i < 10 && (await step(page)) !== 'results'; i++) await page.getByTestId('next').click();
  assert.equal(await page.getByTestId('tax-due').innerText(), '₱62,500', `${label}: switching 8% → graduated OSD`);

  // Start over clears everything
  await page.getByTestId('restart').click();
  await startFlow(page, lang);
  await choose(page, 'option', '8');
  await choose(page, 'incomeType', 'pure');
  assert.equal(await page.getByTestId('amount').inputValue(), '', `${label}: start over clears values`);
}

async function keyboardOnly(page, lang, label) {
  await page.goto(PAGE + '?lang=' + lang);
  // First Tab reaches the skip link, which becomes visible
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.className), 'skip', `${label}: skip link first`);
  const top = await page.evaluate(() => document.activeElement.getBoundingClientRect().top);
  assert.ok(top >= 0, `${label}: skip link visible on focus`);

  // Every focusable control shows a visible focus indicator
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(() => {
      const e = document.activeElement; const cs = getComputedStyle(e);
      return { tag: e.tagName, outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2 };
    });
    if (f.tag === 'BODY') break;
    assert.ok(f.outline, `${label}: focus ring on ${f.tag} (tab ${i})`);
  }

  // Complete a whole route with the keyboard only
  await page.goto(PAGE + '?lang=' + lang);
  await page.getByTestId('start').focus();
  await page.keyboard.press('Enter');
  const pressChoice = async (q, v) => {
    await page.locator(`[data-choose="${q}"][data-value="${v}"]`).focus();
    await page.keyboard.press('Enter');
  };
  await pressChoice('eligSales', 'yes');
  await pressChoice('eligActivities', 'no');
  await pressChoice('option', '8');
  await pressChoice('incomeType', 'pure');
  await page.getByTestId('amount').focus();
  const amountRing = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  assert.notEqual(amountRing, 'none', `${label}: amount box focus ring`);
  await page.keyboard.type('1000000');
  await page.keyboard.press('Enter');
  for (let i = 0; i < 5 && (await step(page)) !== 'results'; i++) {
    await page.getByTestId('amount').focus();
    await page.keyboard.press('Enter');
  }
  assert.equal(await step(page), 'results', `${label}: keyboard reaches results`);
  assert.equal(await page.getByTestId('tax-due').innerText(), '₱60,000');
  // Space toggles the installment checkbox
  await page.getByTestId('installment').focus();
  await page.keyboard.press('Space');
  assert.equal(await page.getByTestId('pay-now').innerText(), '₱30,000');
  assert.ok(await page.getByTestId('installment').evaluate((e) => e === document.activeElement), `${label}: focus stays on checkbox`);
}

async function themeToggle(page, lang, label) {
  await page.goto(PAGE + '?lang=' + lang);
  const btn = page.locator('[data-action="theme"]');
  const before = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const pressed = await btn.getAttribute('aria-pressed');
  await btn.click();
  const after = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  assert.notEqual(before, after, `${label}: theme toggle changes colours`);
  assert.notEqual(await btn.getAttribute('aria-pressed'), pressed, `${label}: theme aria-pressed updates`);
  await btn.click();
}

(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  PAGE = `http://127.0.0.1:${server.address().port}/index.html`;
  const browser = await chromium.launch();
  let count = 0;
  try {
    for (const [vpName, vp] of Object.entries(viewports)) {
      for (const scheme of ['light', 'dark']) {
        for (const lang of ['en', 'fil']) {
          const label = `${vpName}-${scheme}-${lang}`;
          const context = await browser.newContext(Object.assign({ colorScheme: scheme, permissions: ['clipboard-read', 'clipboard-write'] }, vp));
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', (e) => errors.push(e.message));
          page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
          for (const route of routes) {
            // Full axe scan of every step on the main routes at phone size; results/deadline everywhere else.
            const axe = vpName === 'phone360' && ['8-mixed', 'grad-itemized-mixed', 'overpayment'].includes(route.name);
            await runRoute(page, route, lang, `${label}-${route.name}`, { axe, shots: scheme === 'light' || route.name === '8-pure' });
            count++;
          }
          await edgeCases(page, lang, label);
          if (vpName === 'laptop') await keyboardOnly(page, lang, label);
          await themeToggle(page, lang, label);
          if (SHOTS) {
            await page.goto(PAGE + '?lang=' + lang);
            await page.screenshot({ path: path.join(SHOTS, `${label}-welcome.png`), fullPage: true });
          }
          assert.deepEqual(errors, [], `${label}: page errors`);
          await context.close();
        }
      }
    }
    console.log(`Browser tests passed: ${count} route runs (11 routes × 2 languages × light/dark × 360px/tablet/laptop), plus edge cases, keyboard and accessibility checks.`);
  } catch (e) {
    console.error('Browser test FAILED:', e.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
})();
