# Annual ITR Worksheet

An **unofficial**, bilingual (English/Filipino) practice worksheet that helps individuals classified as **micro or small taxpayers** prepare their annual income tax return using **BIR Form 1701-MS (August 2024)**, then shows what to enter in eBIRForms.

Made by [@missniceph](https://instagram.com/missniceph) ("Nice to Know").

> Unofficial practice worksheet. Not a BIR form. File your actual return through eBIRForms or your RDO.
> General information only, not tax advice.

- Plain HTML, CSS and JavaScript. No build step, no backend, no tracking, no cookies.
- Nothing typed into the page is saved or sent anywhere. Closing or refreshing the tab clears it.
- It is not a copy of the BIR form: it has no BIR layout, logo or seal, and printing it shows a "NOT A BIR FORM" notice.

## What's here and how to update it

| File | What it holds | Update it when… |
|---|---|---|
| `js/strings.js` | **All text** on the page, English and Filipino side by side | You want to change wording or a translation (see below) |
| `js/config.js` | **Rates, limits, deadlines** and the "As of" date | The BIR changes a rate, threshold or deadline, or you review the content |
| `index.html` | Page shell: the always-bilingual banner, header, footer, page title and share-preview tags | You change the banner, or the site moves to a new web address (update the `og:url`, `og:image` and `canonical` links) |
| `assets/` | Favicon (`favicon.svg`) and share preview image (`og-image.svg`), plus PNG copies made from them | You redesign the icon or preview. Edit the `.svg`, then re-export the matching `.png` at the same size (1200×630 for the preview, 180×180 and 32×32 for the icons) |
| `js/calc.js` | The calculations, following the 1701-MS item numbers | Only if the form's computation changes |
| `js/app.js` | The step-by-step flow and results screen | You add or remove a question |
| `css/style.css` | Colours (light and dark), sizes, layout | You change the look. Colours are defined once at the top |
| `tests/` | Automated checks | You change a rule: add or update a test |

**Quick checklist after any update:** change the file → run `npm test` (and `npm run test:browser` if you changed text or layout) → update `asOf` in `js/config.js` → commit to `main`. GitHub Pages republishes in a minute or two.

## How to edit text and translations

1. Open `js/strings.js`.
2. Find the line you want to change. Each piece of text looks like this:
   ```js
   back: { en: 'Back', fil: 'Bumalik' },
   ```
3. Change the words **between the quotes**. Leave the name on the left (`back:`) alone.
4. Rules:
   - Keep anything in `{curly braces}` exactly as it is, for example `{date}`, `{limit}` or `{deduction}`. The page fills these in with amounts and dates.
   - If the text contains an apostrophe and is wrapped in single quotes, write it as `\'` (for example `can\'t`), or wrap the text in double quotes instead.
   - Simple HTML is allowed: `<strong>bold</strong>`, `<em>italic</em>`, `<br>` for a line break, and `<li>` for list items.
   - Keep `[confirm]` wherever an item number or label still needs checking against eBIRForms.
5. Every entry needs both `en` and `fil`. `npm test` fails if one is missing.

The yellow banner at the very top is in `index.html`, so it always shows in both languages. Change it there and in `banner` in `strings.js`.

## How to update rates or deadlines

Open `js/config.js`. Everything is labelled:

- `graduatedBrackets`: the graduated income tax table. Each row reads "over `over` up to `upTo`: `base` + `rate`% of the excess over `over`".
- `eightPercent.rate` and `eightPercent.deduction`: the 8% option and the ₱250,000 deduction.
- `osdRate`: the Optional Standard Deduction (40).
- `installmentThreshold`: installments are allowed if tax due is **more than** this (2000).
- `filingDeadline` and `secondInstallment`: month (1–12) and day. The page works out the year by itself: up to April 15 it shows this year's deadline, after that it shows next year's.
- `microLimit` and `microSmallLimit`: the ₱3M and ₱20M thresholds, used in the eligibility questions.
- `eBIRFormsVersion`: the minimum Offline eBIRForms Package version mentioned in reminders.
- `asOf`: the "As of …" date in the footer. **Update this whenever you review the content.**

After any change, run the tests (below). If you change a rate, update the expected numbers in `tests/calc.test.js` too.

## Run it on your computer

Open `index.html` in a browser. That's it. To preview in Filipino, add `?lang=fil` to the address.

## Tests

You need [Node.js](https://nodejs.org) 18 or newer. Run `npm install` once to get the accessibility checker used by the browser test.

```bash
npm test
```

This checks the calculations, including the required cases:

| Case | Expected |
|---|---|
| a) 8%, purely self-employed, sales ₱1,000,000, quarterly payments ₱50,000 | taxable ₱750,000, tax due ₱60,000, payable ₱10,000 |
| b) Graduated, OSD, purely self-employed, sales ₱1,000,000 | OSD ₱400,000, taxable ₱600,000, tax due ₱62,500 |
| c) 8%, mixed income, compensation ₱500,000, sales ₱300,000 | ₱42,500 + ₱24,000 = ₱66,500 |
| d) Graduated, OSD, mixed income, compensation ₱500,000, sales ₱300,000 | business taxable ₱180,000, total taxable ₱680,000, tax due ₱78,500 |
| e) Rounding | ₱100.49 → ₱100; ₱100.50 → ₱101 |
| f) Payable ₱10,000 in installments | ₱5,000 at filing, ₱5,000 by October 15 |
| g) Credits larger than tax due | overpayment shown with the three options, tax never negative |

The browser test runs the page on a local web server and clicks through 11 routes (8% and graduated, purely self-employed and mixed, itemized and OSD, overpayment, rounding, all-blank, tax of exactly ₱2,000, net loss) in **both languages**, in **light and dark mode**, at **phone (360px), tablet (768px) and laptop (1366px)** sizes. It also checks the two "use BIR Form 1701" stops, "Not sure", invalid input, the ₱20M sales warning, going back and changing answers, Start over, the theme toggle, keyboard-only use with visible focus, no sideways scrolling, and an automated accessibility scan (axe-core, WCAG 2.1 AA). It needs [Playwright](https://playwright.dev) with Chromium:

```bash
npm run test:browser
```

## Publish on GitHub Pages

In the repository on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, choose `main` and `/ (root)`, then save. The site appears at `https://missniceph.github.io/annual-itr-worksheet/` after a minute or two. The empty `.nojekyll` file tells GitHub to serve the files as they are.

## Items still marked [confirm]

These are shown on the page with "[confirm]" and should be checked against the actual eBIRForms 1701-MS screen before relying on them:

1. **Part IV-A Items 1–2**: labels unknown; the worksheet doesn't compute them.
2. **Part IV-B1 Items 5–6 and 8–9**: labels unknown. The worksheet asks only for Item 7 (Total Sales/Revenue/Fees).
3. **Part IV-B1 Item 12**: not covered by the rules; not shown.
4. **Part IV-B1 Item 14**: label (shown as "Taxable business income"). The worksheet computes it as Item 7 − deductions (10D or 11) + Item 13. Confirm whether eBIRForms first works out a gross income in Items 8–9 (for example, after cost of sales) for itemized filers.
5. **Part IV-B2 Item 19** ("Gross sales/receipts") and **Item 20** ("Other non-operating income"): labels.
6. **Part V Items 1–9**: which item number holds each credit (1st–3rd quarter payments, BIR Form 2307, BIR Form 2316, other credits).
7. **Part II Item 21**: assumed to be 0 for this worksheet's scope.
8. **Part II Item 25**: label (shown as "Tax payable/(overpayment)").
9. **Installments with an odd peso amount**: since there are no centavos, the worksheet puts the extra ₱1 in the first installment. Confirm how eBIRForms splits it.
10. **Item 4 under graduated rates**: the worksheet shows Item 4 (tax due on compensation) only under the 8% option, as described in the rules. Confirm whether eBIRForms also fills it in for graduated filers.
11. **Net loss**: if deductions exceed sales and other income, Item 14 goes below zero. The page shows a warning and suggests asking the RDO. Confirm how the form handles it.

## Helper wording not taken from the rules

These explanations help people find their numbers but are not stated in the 1701-MS rules this worksheet was built from. Check them before sharing widely:

- Taxable compensation income can be found with the help of the employer's **BIR Form 2316**.
- Clients who withheld tax give you **BIR Form 2307**.
- **NOLCO** means a net operating loss from earlier years carried over to this year.
- The "Not sure?" tip tells people to look at their **first-quarter return** to see which option they chose.
- The deadline shown is always **April 15** (the page doesn't move it if April 15 falls on a weekend or holiday).

## Sources

- BIR Form 1701-MS (August 2024) and its Guidelines
- RA 11976 (Ease of Paying Taxes Act)
- RR 8-2024
- TRAIN Law (RA 10963)

As of November 2026.
