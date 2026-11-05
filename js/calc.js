/*
 * Annual ITR Worksheet — CALCULATIONS
 * ------------------------------------
 * Pure functions only (no page code), so they can be tested with `npm test`.
 * Rates and limits come from js/config.js.
 * Item numbers follow BIR Form 1701-MS (August 2024) as listed in the README.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./config.js'));
  else root.ITRCalc = factory(root.ITR_CONFIG);
})(typeof self !== 'undefined' ? self : this, function (CONFIG) {
  'use strict';

  /**
   * No centavos: 49 centavos or less are dropped; 50 centavos or more round up
   * to the next peso. Works on the centavo value first to avoid floating-point noise.
   */
  function roundPeso(x) {
    var n = Number(x);
    if (!isFinite(n)) return 0;
    var sign = n < 0 ? -1 : 1;
    var centavos = Math.round(Math.abs(n) * 100);
    var pesos = Math.floor((centavos + 50) / 100);
    return pesos === 0 ? 0 : sign * pesos;
  }

  /** Graduated income tax rates applied to a taxable income. Never below zero. */
  function graduatedTax(income) {
    var x = roundPeso(income);
    if (x <= 0) return 0;
    var brackets = CONFIG.graduatedBrackets;
    for (var i = 0; i < brackets.length; i++) {
      var b = brackets[i];
      if (x > b.over && x <= b.upTo) {
        return roundPeso(b.base + ((x - b.over) * b.rate) / 100);
      }
    }
    return 0;
  }

  function amount(input, key) {
    return Math.max(0, roundPeso(input[key] || 0));
  }

  /**
   * Compute every worksheet item.
   * input = {
   *   option: '8' | 'graduated',
   *   incomeType: 'pure' | 'mixed',
   *   deduction: 'osd' | 'itemized'          (graduated only),
   *   compensation,                          Part IV-A Item 3 (mixed only)
   *   grossSales,                            Item 7 (graduated) or Item 19 (8%)
   *   otherIncome,                           Item 13 (graduated) or Item 20 (8%)
   *   ded10A, ded10B, ded10C,                itemized deductions
   *   quarterly, cwt2307, comp2316, otherCredits   Part V credits
   *   installment: boolean,                  pay in two installments
   *   overpaymentOption: 'refund' | 'tcc' | 'carryover'
   * }
   */
  function compute(input) {
    var i = input || {};
    var isEight = i.option === '8';
    var isMixed = i.incomeType === 'mixed';
    var isOSD = i.deduction === 'osd';

    var r = {
      option: isEight ? '8' : 'graduated',
      incomeType: isMixed ? 'mixed' : 'pure',
      deduction: isEight ? null : (isOSD ? 'osd' : 'itemized'),
      partIVA: null,
      partIVB1: null,
      partIVB2: null,
      warnings: []
    };

    // Part IV-A — Taxable Compensation Income (mixed income only)
    var item3 = isMixed ? amount(i, 'compensation') : 0;
    var item4 = isMixed && isEight ? graduatedTax(item3) : 0;
    if (isMixed) r.partIVA = { item3: item3, item4: isEight ? item4 : null };

    var taxDue;
    if (isEight) {
      // Part IV-B2 — Taxable Business Income for 8% Rate
      var item19 = amount(i, 'grossSales');
      var item20 = amount(i, 'otherIncome');
      var item21 = item19 + item20;
      var item22 = isMixed ? 0 : CONFIG.eightPercent.deduction;
      var item23 = Math.max(0, item21 - item22);
      var item24 = roundPeso((item23 * CONFIG.eightPercent.rate) / 100);
      var item25 = item4 + item24;
      r.partIVB2 = {
        item19: item19, item20: item20, item21: item21, item22: item22,
        item23: item23, item24: item24, item25: item25
      };
      taxDue = item25;
    } else {
      // Part IV-B1 — Taxable Business Income for Graduated Rates
      var item7 = amount(i, 'grossSales');
      var b1 = { item7: item7 };
      var deductions;
      if (isOSD) {
        b1.item11 = roundPeso((item7 * CONFIG.osdRate) / 100);
        deductions = b1.item11;
      } else {
        b1.item10A = amount(i, 'ded10A');
        b1.item10B = amount(i, 'ded10B');
        b1.item10C = amount(i, 'ded10C');
        b1.item10D = b1.item10A + b1.item10B + b1.item10C;
        deductions = b1.item10D;
      }
      b1.item13 = amount(i, 'otherIncome');
      b1.item14 = item7 - deductions + b1.item13;
      b1.item15 = item3 + b1.item14;
      b1.item18B = graduatedTax(b1.item15);
      if (b1.item14 < 0) r.warnings.push('netLoss');
      r.partIVB1 = b1;
      taxDue = b1.item18B;
    }

    // Part V — Tax Credits/Payments
    var v = {
      quarterly: amount(i, 'quarterly'),
      cwt2307: amount(i, 'cwt2307'),
      comp2316: isMixed ? amount(i, 'comp2316') : 0,
      otherCredits: amount(i, 'otherCredits')
    };
    v.item10 = v.quarterly + v.cwt2307 + v.comp2316 + v.otherCredits;
    r.partV = v;

    // Part II — Total Income Tax Payable
    var ii = { item21: 0, item22: taxDue };
    ii.item23 = ii.item21 + ii.item22;
    ii.item24 = v.item10;
    ii.item25 = ii.item23 - ii.item24; // negative = overpayment
    ii.payable = Math.max(0, ii.item25);
    ii.overpayment = Math.max(0, -ii.item25);
    ii.installmentEligible = ii.item23 > CONFIG.installmentThreshold && ii.payable > 0;
    ii.useInstallment = ii.installmentEligible && !!i.installment;
    // Two equal installments, in whole pesos. If the amount is odd, the extra
    // peso goes to the first installment (worksheet choice — see README [confirm]).
    ii.item26 = ii.useInstallment ? Math.floor(ii.payable / 2) : 0;
    ii.payNow = ii.payable - ii.item26;
    ii.item31 = ii.overpayment > 0
      ? (['refund', 'tcc', 'carryover'].indexOf(i.overpaymentOption) >= 0 ? i.overpaymentOption : 'carryover')
      : null;
    r.partII = ii;

    return r;
  }

  /**
   * Which taxable year is being filed now, and the deadlines for it.
   * On or before April 15: last year's return is due this April 15.
   * After April 15: this year's return is due next April 15.
   */
  function filingDates(now) {
    var d = now || new Date();
    var y = d.getFullYear();
    var fd = CONFIG.filingDeadline;
    var month = d.getMonth() + 1;
    var beforeDeadline = month < fd.month || (month === fd.month && d.getDate() <= fd.day);
    var deadlineYear = beforeDeadline ? y : y + 1;
    return {
      taxYear: deadlineYear - 1,
      deadline: { year: deadlineYear, month: fd.month, day: fd.day },
      secondInstallment: { year: deadlineYear, month: CONFIG.secondInstallment.month, day: CONFIG.secondInstallment.day }
    };
  }

  return { roundPeso: roundPeso, graduatedTax: graduatedTax, compute: compute, filingDates: filingDates };
});
