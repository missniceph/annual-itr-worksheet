// Run with: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const { roundPeso, graduatedTax, compute, filingDates } = require('../js/calc.js');
const STRINGS = require('../js/strings.js');

test('a) 8%, purely self-employed, sales 1,000,000, quarterly 50,000', () => {
  const r = compute({ option: '8', incomeType: 'pure', grossSales: 1000000, quarterly: 50000 });
  assert.equal(r.partIVB2.item21, 1000000);
  assert.equal(r.partIVB2.item22, 250000);
  assert.equal(r.partIVB2.item23, 750000);
  assert.equal(r.partIVB2.item24, 60000);
  assert.equal(r.partIVB2.item25, 60000);
  assert.equal(r.partII.item22, 60000);
  assert.equal(r.partII.item24, 50000);
  assert.equal(r.partII.item25, 10000);
  assert.equal(r.partII.payable, 10000);
  assert.equal(r.partII.overpayment, 0);
});

test('b) Graduated, OSD, purely self-employed, sales 1,000,000', () => {
  const r = compute({ option: 'graduated', incomeType: 'pure', deduction: 'osd', grossSales: 1000000 });
  assert.equal(r.partIVB1.item11, 400000);
  assert.equal(r.partIVB1.item14, 600000);
  assert.equal(r.partIVB1.item15, 600000);
  assert.equal(r.partIVB1.item18B, 62500);
  assert.equal(r.partII.item22, 62500);
  assert.equal(r.partII.item23, 62500);
});

test('c) 8%, mixed income, compensation 500,000, sales 300,000', () => {
  const r = compute({ option: '8', incomeType: 'mixed', compensation: 500000, grossSales: 300000 });
  assert.equal(r.partIVA.item3, 500000);
  assert.equal(r.partIVA.item4, 42500);
  assert.equal(r.partIVB2.item22, 0, 'no 250,000 deduction for mixed income');
  assert.equal(r.partIVB2.item23, 300000);
  assert.equal(r.partIVB2.item24, 24000);
  assert.equal(r.partIVB2.item25, 66500);
  assert.equal(r.partII.item22, 66500);
});

test('d) Graduated, OSD, mixed income, compensation 500,000, sales 300,000', () => {
  const r = compute({ option: 'graduated', incomeType: 'mixed', deduction: 'osd', compensation: 500000, grossSales: 300000 });
  assert.equal(r.partIVB1.item11, 120000);
  assert.equal(r.partIVB1.item14, 180000);
  assert.equal(r.partIVB1.item15, 680000);
  assert.equal(r.partIVB1.item18B, 78500);
  assert.equal(r.partIVA.item4, null, 'Item 4 only used under 8%');
});

test('e) Rounding: 100.49 -> 100, 100.50 -> 101', () => {
  assert.equal(roundPeso(100.49), 100);
  assert.equal(roundPeso(100.5), 101);
  assert.equal(roundPeso('100.50'), 101);
  assert.equal(roundPeso(0.49), 0);
  assert.equal(roundPeso(0.5), 1);
  assert.equal(roundPeso(-100.5), -101);
  // inputs with centavos are rounded before computing
  const r = compute({ option: '8', incomeType: 'pure', grossSales: 1000000.5, quarterly: 49999.49 });
  assert.equal(r.partIVB2.item19, 1000001);
  assert.equal(r.partV.quarterly, 49999);
  // 8% of 750,001 = 60,000.08 -> 60,000
  assert.equal(r.partIVB2.item24, 60000);
});

test('f) Tax payable 10,000 with installment -> 5,000 at filing, 5,000 by Oct 15', () => {
  const r = compute({ option: '8', incomeType: 'pure', grossSales: 1000000, quarterly: 50000, installment: true });
  assert.equal(r.partII.payable, 10000);
  assert.equal(r.partII.installmentEligible, true);
  assert.equal(r.partII.payNow, 5000);
  assert.equal(r.partII.item26, 5000);
  // Without choosing installment, everything is paid at filing
  const r2 = compute({ option: '8', incomeType: 'pure', grossSales: 1000000, quarterly: 50000 });
  assert.equal(r2.partII.payNow, 10000);
  assert.equal(r2.partII.item26, 0);
  // Odd peso goes to the first installment, still whole pesos
  const r3 = compute({ option: '8', incomeType: 'pure', grossSales: 1000000, quarterly: 49999, installment: true });
  assert.equal(r3.partII.payNow, 5001);
  assert.equal(r3.partII.item26, 5000);
});

test('installment only if tax due exceeds 2,000', () => {
  // 8% of (275,000 - 250,000) = 2,000 -> not more than 2,000
  const r = compute({ option: '8', incomeType: 'pure', grossSales: 275000, installment: true });
  assert.equal(r.partII.item23, 2000);
  assert.equal(r.partII.installmentEligible, false);
  assert.equal(r.partII.item26, 0);
  assert.equal(r.partII.payNow, 2000);
  const r2 = compute({ option: '8', incomeType: 'pure', grossSales: 275013, installment: true });
  assert.equal(r2.partII.item23, 2001);
  assert.equal(r2.partII.installmentEligible, true);
});

test('g) Credits larger than tax due -> overpayment, never negative tax', () => {
  const r = compute({ option: '8', incomeType: 'pure', grossSales: 1000000, quarterly: 45000, cwt2307: 30000 });
  assert.equal(r.partII.item23, 60000);
  assert.equal(r.partII.item24, 75000);
  assert.equal(r.partII.payable, 0);
  assert.equal(r.partII.overpayment, 15000);
  assert.equal(r.partII.installmentEligible, false);
  assert.equal(r.partII.item31, 'carryover', 'automatically carried over if none chosen');
  for (const opt of ['refund', 'tcc', 'carryover']) {
    assert.equal(compute({ option: '8', incomeType: 'pure', grossSales: 1000000, quarterly: 75000, overpaymentOption: opt }).partII.item31, opt);
  }
  // tax due is never negative
  const zero = compute({ option: '8', incomeType: 'pure', grossSales: 100000, cwt2307: 1000 });
  assert.equal(zero.partIVB2.item23, 0);
  assert.equal(zero.partIVB2.item24, 0);
  assert.equal(zero.partII.item23, 0);
  assert.equal(zero.partII.overpayment, 1000);
  assert.equal(compute({ option: 'graduated', incomeType: 'pure', deduction: 'itemized', grossSales: 100, ded10A: 5000 }).partII.item23, 0);
});

test('graduated rate brackets', () => {
  const cases = [
    [0, 0], [250000, 0], [250001, 0], [400000, 22500], [800000, 102500],
    [2000000, 402500], [8000000, 2202500], [9000000, 2552500], [-5, 0]
  ];
  for (const [income, tax] of cases) assert.equal(graduatedTax(income), tax, `income ${income}`);
  assert.equal(graduatedTax(250007), 1); // 15% of 7 = 1.05 -> 1
});

test('itemized deductions route', () => {
  const r = compute({
    option: 'graduated', incomeType: 'pure', deduction: 'itemized',
    grossSales: 1000000, ded10A: 300000, ded10B: 50000, ded10C: 25000, otherIncome: 10000,
    cwt2307: 20000
  });
  assert.equal(r.partIVB1.item10D, 375000);
  assert.equal(r.partIVB1.item11, undefined);
  assert.equal(r.partIVB1.item14, 635000);
  assert.equal(r.partIVB1.item18B, 22500 + 47000);
  assert.equal(r.partII.payable, 69500 - 20000);
});

test('2316 credits ignored for purely self-employed', () => {
  const r = compute({ option: '8', incomeType: 'pure', grossSales: 1000000, comp2316: 5000 });
  assert.equal(r.partV.comp2316, 0);
  const m = compute({ option: '8', incomeType: 'mixed', compensation: 500000, grossSales: 300000, comp2316: 42500 });
  assert.equal(m.partV.comp2316, 42500);
  assert.equal(m.partII.payable, 24000);
});

test('filing dates', () => {
  const nov = filingDates(new Date(2026, 10, 5));
  assert.equal(nov.taxYear, 2026);
  assert.equal(nov.deadline.year, 2027);
  assert.equal(nov.secondInstallment.year, 2027);
  assert.equal(filingDates(new Date(2027, 3, 15)).taxYear, 2026);
  assert.equal(filingDates(new Date(2027, 3, 16)).taxYear, 2027);
});

test('every text has English and Filipino', () => {
  for (const [key, val] of Object.entries(STRINGS)) {
    assert.ok(val.en && val.en.trim(), `${key} missing English`);
    assert.ok(val.fil && val.fil.trim(), `${key} missing Filipino`);
  }
});
