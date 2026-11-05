/*
 * Annual ITR Worksheet — RATES, LIMITS AND DATES
 * ------------------------------------------------
 * Edit this file when the BIR changes a rate, threshold or deadline.
 * Amounts are in pesos. Rates are whole-number percentages (8 means 8%).
 * After editing, run `npm test` to make sure the calculations still pass.
 */
(function (root) {
  var CONFIG = {
    // Shown in the footer.
    asOf: { en: 'As of November 2026', fil: 'As of Nobyembre 2026' },

    // Who can use BIR Form 1701-MS (eligibility screen text uses these).
    microLimit: 3000000,        // micro: gross sales below this
    microSmallLimit: 20000000,  // small: from microLimit up to below this

    // Graduated income tax rates (2023 onwards).
    // Tax = base + rate% of the amount over `over`, for income above `over` up to `upTo`.
    graduatedBrackets: [
      { over: 0,       upTo: 250000,   base: 0,       rate: 0 },
      { over: 250000,  upTo: 400000,   base: 0,       rate: 15 },
      { over: 400000,  upTo: 800000,   base: 22500,   rate: 20 },
      { over: 800000,  upTo: 2000000,  base: 102500,  rate: 25 },
      { over: 2000000, upTo: 8000000,  base: 402500,  rate: 30 },
      { over: 8000000, upTo: Infinity, base: 2202500, rate: 35 }
    ],

    // 8% income tax option (Part IV-B2).
    eightPercent: {
      rate: 8,
      // Item 22 deduction — purely self-employed/professionals only.
      deduction: 250000
    },

    // Optional Standard Deduction (Part IV-B1 Item 11): % of Item 7.
    osdRate: 40,

    // Installment: allowed if total tax due is MORE than this amount.
    installmentThreshold: 2000,

    // Deadlines (month is 1–12).
    filingDeadline: { month: 4, day: 15 },     // file and pay, covering the previous taxable year
    secondInstallment: { month: 10, day: 15 }, // 2nd installment due date

    // Minimum Offline eBIRForms Package version mentioned in reminders.
    eBIRFormsVersion: '7.9.6'
  };

  if (typeof module === 'object' && module.exports) module.exports = CONFIG;
  else root.ITR_CONFIG = CONFIG;
})(typeof self !== 'undefined' ? self : this);
