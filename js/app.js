/*
 * Annual ITR Worksheet — PAGE LOGIC
 * Text lives in js/strings.js, rates/dates in js/config.js, maths in js/calc.js.
 * Nothing is stored or sent: all answers live only in the `state` object below.
 */
(function () {
  'use strict';
  var C = window.ITR_CONFIG;
  var Calc = window.ITRCalc;
  var S = window.ITR_STRINGS;

  var MONTHS = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    fil: ['Enero', 'Pebrero', 'Marso', 'Abril', 'Mayo', 'Hunyo', 'Hulyo', 'Agosto', 'Setyembre', 'Oktubre', 'Nobyembre', 'Disyembre']
  };

  var state;
  function freshState(lang) {
    return {
      lang: lang,
      step: 'welcome',
      answers: {},     // eligSales, eligActivities, option, incomeType, deduction
      values: {},      // raw text typed in each number step
      notSure: false,
      stopReason: null,
      installment: false,
      overpaymentOption: '',
      copyStatus: ''
    };
  }

  function initialLang() {
    var q = /[?&]lang=(en|fil)\b/.exec(location.search);
    if (q) return q[1];
    var nav = (navigator.language || '').toLowerCase();
    return nav.indexOf('fil') === 0 || nav.indexOf('tl') === 0 ? 'fil' : 'en';
  }

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function peso(n) {
    var v = Calc.roundPeso(n);
    var s = '₱' + Math.abs(v).toLocaleString('en-PH');
    return v < 0 ? '(' + s + ')' : s;
  }
  var baseVars = {
    limit: peso(C.microSmallLimit),
    micro: peso(C.microLimit),
    deduction: peso(C.eightPercent.deduction),
    osd: C.osdRate,
    threshold: peso(C.installmentThreshold),
    ver: C.eBIRFormsVersion
  };
  function t(key, vars) {
    var e = S[key];
    if (!e) return '⟦' + key + '⟧';
    var s = e[state.lang] || e.en;
    var all = Object.assign({}, baseVars, vars || {});
    return s.replace(/\{(\w+)\}/g, function (m, k) { return k in all ? all[k] : m; });
  }
  function plain(html) {
    var d = document.createElement('div');
    d.innerHTML = html.replace(/<br\s*\/?>/g, '\n').replace(/<li>/g, '\n- ');
    return d.textContent.trim();
  }
  function fmtDate(d) {
    return MONTHS[state.lang][d.month - 1] + ' ' + d.day + ', ' + d.year;
  }
  function parseAmount(raw) {
    var s = String(raw == null ? '' : raw).replace(/[₱,\s]/g, '');
    if (s === '') return { ok: true, value: 0, empty: true };
    if (!/^\d*\.?\d*$/.test(s) || s === '.') return { ok: false };
    return { ok: true, value: Number(s) };
  }

  /* ---------- steps ---------- */
  var NUMBER_STEPS = {
    compensation: function () { return { ref: t('ref_IVA', { n: 3 }), label: 'f_comp_label', explain: 'f_comp_explain' }; },
    grossSales: function () {
      return state.answers.option === '8'
        ? { ref: t('ref_IVB2', { n: 19 }), label: 'f_sales19_label', explain: 'f_sales19_explain' }
        : { ref: t('ref_IVB1', { n: 7 }), label: 'f_sales7_label', explain: 'f_sales7_explain' };
    },
    ded10A: function () { return { ref: t('ref_IVB1', { n: '10A' }), label: 'f_10A_label', explain: 'f_10A_explain' }; },
    ded10B: function () { return { ref: t('ref_IVB1', { n: '10B' }), label: 'f_10B_label', explain: 'f_10B_explain' }; },
    ded10C: function () { return { ref: t('ref_IVB1', { n: '10C' }), label: 'f_10C_label', explain: 'f_10C_explain' }; },
    otherIncome: function () {
      return state.answers.option === '8'
        ? { ref: t('ref_IVB2', { n: 20 }), label: 'f_other20_label', explain: 'f_other_explain' }
        : { ref: t('ref_IVB1', { n: 13 }), label: 'f_other13_label', explain: 'f_other_explain' };
    },
    quarterly: function () { return { ref: t('ref_V'), label: 'f_quarterly_label', explain: 'f_quarterly_explain' }; },
    cwt2307: function () { return { ref: t('ref_V'), label: 'f_2307_label', explain: 'f_2307_explain' }; },
    comp2316: function () { return { ref: t('ref_V'), label: 'f_2316_label', explain: 'f_2316_explain' }; },
    otherCredits: function () { return { ref: t('ref_V'), label: 'f_othercr_label', explain: 'f_othercr_explain' }; }
  };

  function stepList() {
    var a = state.answers;
    var list = ['welcome', 'eligSales', 'eligActivities', 'option', 'incomeType'];
    if (a.option === 'graduated') list.push('deduction');
    if (a.incomeType === 'mixed') list.push('compensation');
    list.push('grossSales');
    if (a.option === 'graduated' && a.deduction === 'itemized') list.push('ded10A', 'ded10B', 'ded10C');
    list.push('otherIncome', 'quarterly', 'cwt2307');
    if (a.incomeType === 'mixed') list.push('comp2316');
    list.push('otherCredits', 'results', 'deadline');
    return list;
  }

  function go(step) {
    state.step = step;
    state.copyStatus = '';
    render(true);
  }
  function goNext() {
    var list = stepList();
    go(list[list.indexOf(state.step) + 1]);
  }
  function goBack() {
    if (state.step === 'stop') { go(state.stopReason === 'sales' ? 'eligSales' : 'eligActivities'); return; }
    var list = stepList();
    var i = list.indexOf(state.step);
    if (i > 0) go(list[i - 1]);
  }

  function choose(question, value) {
    var a = state.answers;
    if (question === 'option' && value === 'notsure') { state.notSure = true; render(false); return; }
    a[question] = value;
    if (question === 'option') state.notSure = false;
    if (question === 'eligSales' && value === 'no') { state.stopReason = 'sales'; go('stop'); return; }
    if (question === 'eligActivities' && value === 'yes') { state.stopReason = 'activities'; go('stop'); return; }
    goNext();
  }

  function computeNow() {
    var a = state.answers;
    var input = {
      option: a.option, incomeType: a.incomeType, deduction: a.deduction,
      installment: state.installment, overpaymentOption: state.overpaymentOption
    };
    Object.keys(NUMBER_STEPS).forEach(function (k) {
      var p = parseAmount(state.values[k]);
      input[k] = p.ok ? p.value : 0;
    });
    return Calc.compute(input);
  }

  /* ---------- rendering ---------- */
  function progressHTML() {
    var list = stepList();
    var total = list.length - 1;
    var n = Math.max(1, list.indexOf(state.step));
    var pct = Math.round((n / total) * 100);
    return '<div class="progress"><span>' + esc(t('step_of', { n: n, total: total })) + '</span>' +
      '<div class="bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div></div>';
  }

  function explainHTML(html) {
    return '<details class="explain" open><summary>' + t('what_is_this') + '</summary><div class="explain-body">' + html + '</div></details>';
  }

  function navHTML(nextLabel, nextAttr) {
    return '<div class="nav">' +
      '<button type="button" class="btn ghost" data-action="back">← ' + t('back') + '</button>' +
      (nextLabel ? '<button type="submit" class="btn primary" ' + (nextAttr || '') + ' data-testid="next">' + nextLabel + ' →</button>' : '') +
      '</div>';
  }

  function choiceStep(question, title, explain, choices, extra) {
    var current = state.answers[question];
    var html = progressHTML() +
      '<h2 id="step-title" tabindex="-1">' + title + '</h2>' + explainHTML(explain) +
      '<div class="choices" role="group" aria-labelledby="step-title">';
    choices.forEach(function (c) {
      html += '<button type="button" class="choice' + (current === c.value ? ' selected' : '') +
        '" data-choose="' + question + '" data-value="' + c.value + '" aria-pressed="' + (current === c.value) + '">' + c.label + '</button>';
    });
    html += '</div>' + (extra || '') + navHTML();
    return html;
  }

  function renderWelcome() {
    return '<h2 id="step-title" tabindex="-1">' + t('welcome_title') + '</h2>' +
      '<p>' + t('welcome_body') + '</p>' +
      explainHTML('<p>' + t('welcome_explain') + '</p>') +
      '<p class="muted">' + t('welcome_ready') + '</p><ul class="list">' + t('welcome_ready_list') + '</ul>' +
      '<p class="privacy">🔒 ' + t('privacy') + '</p>' +
      '<div class="nav"><span></span><button type="button" class="btn primary" data-action="next" data-testid="start">' + t('welcome_start') + ' →</button></div>';
  }

  function renderStop() {
    return '<h2 id="step-title" tabindex="-1">' + t('stop_title') + '</h2>' +
      '<div class="callout warn" data-testid="stop"><p>' + t(state.stopReason === 'sales' ? 'stop_sales' : 'stop_activities') + '</p></div>' +
      '<p>' + t('stop_unsure') + '</p>' +
      '<div class="nav"><button type="button" class="btn ghost" data-action="back">← ' + t('stop_back') + '</button>' +
      '<button type="button" class="btn ghost" data-action="restart">' + t('start_over') + '</button></div>';
  }

  function renderNumber(key) {
    var def = NUMBER_STEPS[key]();
    var raw = state.values[key] || '';
    var list = stepList();
    var last = list[list.indexOf(key) + 1] === 'results';
    return '<form data-form="number" data-key="' + key + '" novalidate>' + progressHTML() +
      '<p class="item-ref">' + esc(def.ref) + '</p>' +
      '<h2 id="step-title" tabindex="-1"><label for="amount">' + t(def.label) + '</label></h2>' +
      explainHTML('<p>' + t(def.explain) + '</p>') +
      '<div class="amount-wrap"><span class="peso" aria-hidden="true">₱</span>' +
      '<input id="amount" name="amount" class="amount" type="text" inputmode="decimal" autocomplete="off" ' +
      'aria-describedby="amount-hint amount-feedback" data-testid="amount" value="' + esc(raw) + '" placeholder="0"></div>' +
      '<p id="amount-hint" class="muted small">' + t('input_hint') + '</p>' +
      '<p id="amount-feedback" class="feedback" aria-live="polite">' + feedbackText(raw) + '</p>' +
      navHTML(last ? t('see_results') : t('next')) + '</form>';
  }

  function feedbackText(raw) {
    var p = parseAmount(raw);
    if (!p.ok) return '<span class="error">' + t('input_invalid') + '</span>';
    if (p.empty) return '';
    var r = Calc.roundPeso(p.value);
    if (r !== p.value) return t('input_rounded', { amt: peso(r) });
    return t('input_preview', { amt: peso(r) });
  }

  /* eBIRForms rows: [{part, rows:[{item, label, amount}]}] */
  function ebirSections(r) {
    var secs = [];
    var dates = Calc.filingDates(new Date());
    var oct = fmtDate(dates.secondInstallment);
    if (r.partIVA) {
      var a = [
        { item: '1–2', label: t('r_IVA_12'), amount: null },
        { item: '3', label: t('r_IVA_3'), amount: r.partIVA.item3 }
      ];
      if (r.option === '8') a.push({ item: '4', label: t('r_IVA_4'), amount: r.partIVA.item4 });
      secs.push({ title: t('part_IVA'), rows: a });
    }
    if (r.partIVB1) {
      var b = r.partIVB1;
      var rows = [
        { item: '5–6, 8–9', label: t('r_B1_59'), amount: null },
        { item: '7', label: t('r_B1_7'), amount: b.item7 }
      ];
      if (r.deduction === 'itemized') {
        rows.push({ item: '10A', label: t('r_B1_10A'), amount: b.item10A },
          { item: '10B', label: t('r_B1_10B'), amount: b.item10B },
          { item: '10C', label: t('r_B1_10C'), amount: b.item10C },
          { item: '10D', label: t('r_B1_10D'), amount: b.item10D });
      } else {
        rows.push({ item: '11', label: t('r_B1_11'), amount: b.item11 });
      }
      rows.push({ item: '13', label: t('r_B1_13'), amount: b.item13 },
        { item: '14', label: t('r_B1_14'), amount: b.item14 },
        { item: '15', label: t('r_B1_15'), amount: b.item15 },
        { item: '16, 17, 18A', label: t('r_B1_skip'), amount: null },
        { item: '18B', label: t('r_B1_18B'), amount: b.item18B, strong: true });
      secs.push({ title: t('part_IVB1'), rows: rows });
    }
    if (r.partIVB2) {
      var c = r.partIVB2;
      secs.push({ title: t('part_IVB2'), rows: [
        { item: '19', label: t('r_B2_19'), amount: c.item19 },
        { item: '20', label: t('r_B2_20'), amount: c.item20 },
        { item: '21', label: t('r_B2_21'), amount: c.item21 },
        { item: '22', label: t(r.incomeType === 'mixed' ? 'r_B2_22_mixed' : 'r_B2_22_pure'), amount: c.item22 },
        { item: '23', label: t('r_B2_23'), amount: c.item23 },
        { item: '24', label: t('r_B2_24'), amount: c.item24 },
        { item: '25', label: t('r_B2_25'), amount: c.item25, strong: true }
      ] });
    }
    var v = r.partV;
    var vr = [
      { item: '1–9', label: t('r_V_quarterly') + ' [confirm item no.]', amount: v.quarterly },
      { item: '1–9', label: t('r_V_2307') + ' [confirm item no.]', amount: v.cwt2307 }
    ];
    if (r.incomeType === 'mixed') vr.push({ item: '1–9', label: t('r_V_2316') + ' [confirm item no.]', amount: v.comp2316 });
    vr.push({ item: '1–9', label: t('r_V_other') + ' [confirm item no.]', amount: v.otherCredits },
      { item: '10', label: t('r_V_10'), amount: v.item10, strong: true });
    secs.push({ title: t('part_V'), rows: vr });

    var ii = r.partII;
    var pr = [
      { item: '21', label: t('r_II_21'), amount: ii.item21 },
      { item: '22', label: t('r_II_22', { from: r.option === '8' ? '25' : '18B' }), amount: ii.item22 },
      { item: '23', label: t('r_II_23'), amount: ii.item23 },
      { item: '24', label: t('r_II_24'), amount: ii.item24 },
      { item: '25', label: t('r_II_25'), amount: ii.item25, strong: true }
    ];
    if (ii.useInstallment) pr.push({ item: '26', label: t('r_II_26', { date: oct }), amount: ii.item26 });
    pr.push({ item: '28A–28C', label: t('r_II_28'), amount: null });
    if (ii.item31) pr.push({ item: '31', label: t('r_II_31', { choice: t('over_' + ii.item31) }), amount: null });
    secs.push({ title: t('part_II'), rows: pr });
    return secs;
  }

  function routeText(r) {
    var parts = [t(r.option === '8' ? 'route_8' : 'route_grad'), t(r.incomeType === 'mixed' ? 'route_mixed' : 'route_pure')];
    if (r.deduction) parts.push(t(r.deduction === 'osd' ? 'route_osd' : 'route_itemized'));
    return parts.join(' · ');
  }

  function renderResults() {
    var r = computeNow();
    var ii = r.partII;
    var dates = Calc.filingDates(new Date());
    var oct = fmtDate(dates.secondInstallment);
    var html = progressHTML() +
      '<h2 id="step-title" tabindex="-1">' + t('results_title') + '</h2>' +
      '<p class="route"><span class="muted">' + t('results_route') + ':</span> ' + routeText(r) + '</p>';

    if (r.warnings.indexOf('netLoss') >= 0) html += '<div class="callout warn"><p>' + t('warn_net_loss') + '</p></div>';

    html += '<dl class="summary">' +
      '<div><dt>' + t('res_tax_due') + '</dt><dd data-testid="tax-due">' + peso(ii.item23) + '</dd></div>' +
      '<div><dt>' + t('res_credits') + '</dt><dd data-testid="credits">' + peso(ii.item24) + '</dd></div>';
    if (ii.overpayment > 0) {
      html += '<div class="total over"><dt>' + t('res_overpayment') + '</dt><dd data-testid="overpayment">' + peso(ii.overpayment) + '</dd></div>';
    } else if (ii.payable > 0) {
      html += '<div class="total"><dt>' + t('res_payable') + '</dt><dd data-testid="payable">' + peso(ii.payable) + '</dd></div>';
    } else {
      html += '<div class="total"><dt>' + t('res_nothing') + '</dt><dd data-testid="payable">' + peso(0) + '</dd></div>';
    }
    html += '</dl>';
    if (ii.payable === 0 && ii.overpayment === 0) html += '<p class="muted">' + t('res_nothing_text') + '</p>';

    if (ii.installmentEligible) {
      html += '<section class="callout" aria-labelledby="inst-h"><h3 id="inst-h">' + t('inst_title') + '</h3>' +
        '<p>' + t('inst_text', { date: oct }) + '</p>' +
        '<label class="check"><input type="checkbox" data-action="installment" data-testid="installment"' + (state.installment ? ' checked' : '') + '> ' + t('inst_checkbox') + '</label>';
      if (ii.useInstallment) {
        html += '<dl class="summary small"><div><dt>' + t('inst_first') + '</dt><dd data-testid="pay-now">' + peso(ii.payNow) + '</dd></div>' +
          '<div><dt>' + t('inst_second', { date: oct }) + '</dt><dd data-testid="pay-later">' + peso(ii.item26) + '</dd></div></dl>';
        if (ii.payNow !== ii.item26) html += '<p class="muted small">' + t('inst_odd') + '</p>';
      }
      html += '</section>';
    }

    if (ii.overpayment > 0) {
      html += '<fieldset class="callout" data-testid="overpay-options"><legend>' + t('over_title') + '</legend><p>' + t('over_text') + '</p>';
      ['refund', 'tcc', 'carryover'].forEach(function (o) {
        html += '<label class="radio"><input type="radio" name="over" value="' + o + '" data-action="overpay"' +
          (state.overpaymentOption === o ? ' checked' : '') + '> <span>' + t('over_' + o) +
          (o === 'carryover' ? ' <span class="muted small">' + t('over_default') + '</span>' : '') + '</span></label>';
      });
      html += '</fieldset>';
    }

    html += '<section class="ebir" aria-labelledby="ebir-h"><h3 id="ebir-h">' + t('ebir_title') + '</h3><p class="muted small">' + t('ebir_intro') + '</p>';
    ebirSections(r).forEach(function (sec) {
      html += '<h4>' + esc(sec.title) + '</h4><table><thead><tr><th scope="col">' + t('col_item') + '</th><th scope="col">' + t('col_desc') +
        '</th><th scope="col" class="num">' + t('col_amount') + '</th></tr></thead><tbody>';
      sec.rows.forEach(function (row) {
        html += '<tr' + (row.strong ? ' class="strong"' : '') + '><td class="item">' + esc(row.item) + '</td><td>' + esc(row.label) +
          '</td><td class="num">' + (row.amount === null ? '—' : peso(row.amount)) + '</td></tr>';
      });
      html += '</tbody></table>';
    });
    html += '</section>';

    html += '<div class="actions"><button type="button" class="btn secondary" data-action="copy" data-testid="copy">📋 ' + t('copy_btn') + '</button>' +
      '<span class="copy-status" aria-live="polite">' + esc(state.copyStatus) + '</span></div>' +
      '<textarea id="summary-text" class="summary-text" readonly hidden aria-label="' + esc(t('copy_btn')) + '"></textarea>';
    html += '<div class="nav"><button type="button" class="btn ghost" data-action="back">← ' + t('back') + '</button>' +
      '<button type="button" class="btn primary" data-action="next" data-testid="to-deadline">' + t('to_deadline') + ' →</button></div>';
    return html;
  }

  function summaryText() {
    var r = computeNow();
    var ii = r.partII;
    var dates = Calc.filingDates(new Date());
    var lines = [t('sum_heading'), plain(t('banner')), '', t('results_route') + ': ' + routeText(r), ''];
    lines.push(t('res_tax_due') + ': ' + peso(ii.item23));
    lines.push(t('res_credits') + ': ' + peso(ii.item24));
    if (ii.overpayment > 0) lines.push(t('res_overpayment') + ': ' + peso(ii.overpayment));
    else lines.push(t('res_payable') + ': ' + peso(ii.payable));
    if (ii.useInstallment) {
      lines.push('  ' + t('inst_first') + ': ' + peso(ii.payNow));
      lines.push('  ' + plain(t('inst_second', { date: fmtDate(dates.secondInstallment) })) + ': ' + peso(ii.item26));
    }
    lines.push('', t('ebir_title'));
    ebirSections(r).forEach(function (sec) {
      lines.push('', sec.title);
      sec.rows.forEach(function (row) {
        lines.push('  Item ' + row.item + ' — ' + row.label + (row.amount === null ? '' : ': ' + peso(row.amount)));
      });
    });
    lines.push('', plain(t('dl_main', { ty: dates.taxYear, date: fmtDate(dates.deadline) })), '', t('sum_footer'));
    return lines.join('\n');
  }

  function copySummary() {
    var text = summaryText();
    var ta = document.getElementById('summary-text');
    function done(ok) {
      state.copyStatus = ok ? t('copied') : t('copy_failed');
      var st = document.querySelector('.copy-status');
      if (st) st.textContent = state.copyStatus;
      if (!ok && ta) { ta.hidden = false; ta.value = text; ta.focus(); ta.select(); }
    }
    function fallback() {
      try {
        ta.hidden = false; ta.value = text; ta.select();
        var ok = document.execCommand('copy');
        if (ok) ta.hidden = true;
        done(ok);
      } catch (e) { done(false); }
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    } else fallback();
  }

  function renderDeadline() {
    var dates = Calc.filingDates(new Date());
    var r = computeNow();
    var html = progressHTML() +
      '<h2 id="step-title" tabindex="-1">' + t('dl_title') + '</h2>' +
      explainHTML('<p>' + t('dl_explain') + '</p>') +
      '<div class="callout big" data-testid="deadline"><p>📅 ' + t('dl_main', { ty: dates.taxYear, date: fmtDate(dates.deadline) }) + '</p></div>' +
      '<h3>' + t('dl_how_title') + '</h3><p>' + t('dl_how') + '</p>' +
      '<h3>' + t('dl_attach_title') + '</h3><ul class="list">' + t('dl_attach') + '</ul>';
    if (r.deduction === 'osd') html += '<p>' + t('dl_osd_records') + '</p>';
    html += '<h3>' + t('dl_inst_title') + '</h3><p>' + t('dl_inst', { date: fmtDate(dates.secondInstallment) }) + '</p>' +
      '<h3>' + t('dl_over_title') + '</h3><p>' + t('dl_over') + '</p>' +
      '<div class="callout warn"><h3>' + t('dl_late_title') + '</h3><p>' + t('dl_late') + '</p></div>' +
      '<div class="nav"><button type="button" class="btn ghost" data-action="back">← ' + t('back_to_results') + '</button>' +
      '<button type="button" class="btn ghost" data-action="restart">' + t('start_over') + '</button></div>';
    return html;
  }

  function renderStep() {
    var s = state.step;
    if (s === 'welcome') return renderWelcome();
    if (s === 'stop') return renderStop();
    if (s === 'eligSales') {
      return choiceStep('eligSales', t('elig_sales_q'), '<p>' + t('elig_sales_explain') + '</p>',
        [{ value: 'yes', label: t('yes') }, { value: 'no', label: t('no') }]);
    }
    if (s === 'eligActivities') {
      return choiceStep('eligActivities', t('elig_act_q'), '<p>' + t('elig_act_explain') + '</p>',
        [{ value: 'yes', label: t('yes') }, { value: 'no', label: t('no') }]);
    }
    if (s === 'option') {
      return choiceStep('option', t('option_q'), '<p>' + t('option_explain') + '</p>', [
        { value: '8', label: t('option_8') }, { value: 'graduated', label: t('option_grad') }, { value: 'notsure', label: t('option_notsure') }
      ], state.notSure ? '<div class="callout" data-testid="notsure" role="status"><p>' + t('option_notsure_text') + '</p></div>' : '');
    }
    if (s === 'incomeType') {
      var note = state.answers.option === '8' ? '<p>' + t('income_8_note') + '</p>' : '';
      return choiceStep('incomeType', t('income_q'), '<p>' + t('income_explain') + '</p>' + note, [
        { value: 'pure', label: t('income_pure') }, { value: 'mixed', label: t('income_mixed') }
      ]);
    }
    if (s === 'deduction') {
      return choiceStep('deduction', t('ded_q'), '<p>' + t('ded_explain') + '</p>', [
        { value: 'itemized', label: t('ded_itemized') }, { value: 'osd', label: t('ded_osd') }
      ]);
    }
    if (s === 'results') return renderResults();
    if (s === 'deadline') return renderDeadline();
    if (NUMBER_STEPS[s]) return renderNumber(s);
    return renderWelcome();
  }

  function renderChrome() {
    document.documentElement.lang = state.lang === 'fil' ? 'fil' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-aria'));
      el.setAttribute('aria-label', v); el.setAttribute('title', v);
    });
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === state.lang));
    });
    document.getElementById('as-of').textContent = C.asOf[state.lang];
    document.getElementById('made-by').innerHTML = t('footer_made_by', {
      link: '<a href="https://instagram.com/missniceph" target="_blank" rel="noopener">@missniceph</a>'
    });
  }

  function render(moveFocus) {
    renderChrome();
    var app = document.getElementById('app');
    app.innerHTML = renderStep();
    app.setAttribute('data-step', state.step);
    if (moveFocus) {
      var input = app.querySelector('#amount');
      var target = input || app.querySelector('#step-title');
      if (target) target.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }

  /* ---------- events ---------- */
  function onClick(e) {
    var el = e.target.closest('button, [data-lang]');
    if (!el) return;
    if (el.hasAttribute('data-lang')) {
      state.lang = el.getAttribute('data-lang');
      var keepFocus = el.getAttribute('data-lang');
      render(false);
      var b = document.querySelector('[data-lang="' + keepFocus + '"]');
      if (b) b.focus();
      return;
    }
    if (el.hasAttribute('data-choose')) { choose(el.getAttribute('data-choose'), el.getAttribute('data-value')); return; }
    var action = el.getAttribute('data-action');
    if (action === 'next') goNext();
    else if (action === 'back') goBack();
    else if (action === 'restart') { state = freshState(state.lang); render(true); }
    else if (action === 'copy') copySummary();
    else if (action === 'theme') toggleTheme();
  }

  function onChange(e) {
    var el = e.target;
    var action = el.getAttribute('data-action');
    if (action === 'installment') { state.installment = el.checked; render(false); var c = document.querySelector('[data-action="installment"]'); if (c) c.focus(); }
    else if (action === 'overpay') { state.overpaymentOption = el.value; render(false); var r = document.querySelector('input[name="over"][value="' + el.value + '"]'); if (r) r.focus(); }
  }

  function onInput(e) {
    if (e.target.id !== 'amount') return;
    var form = e.target.closest('form');
    state.values[form.getAttribute('data-key')] = e.target.value;
    document.getElementById('amount-feedback').innerHTML = feedbackText(e.target.value);
  }

  function onSubmit(e) {
    var form = e.target;
    if (form.getAttribute('data-form') !== 'number') return;
    e.preventDefault();
    var key = form.getAttribute('data-key');
    var val = form.querySelector('#amount').value;
    state.values[key] = val;
    if (!parseAmount(val).ok) {
      document.getElementById('amount-feedback').innerHTML = feedbackText(val);
      form.querySelector('#amount').focus();
      return;
    }
    goNext();
  }

  function toggleTheme() {
    var root = document.documentElement;
    var current = root.getAttribute('data-theme') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  }

  document.addEventListener('DOMContentLoaded', function () {
    state = freshState(initialLang());
    document.addEventListener('click', onClick);
    document.addEventListener('change', onChange);
    document.addEventListener('input', onInput);
    document.addEventListener('submit', onSubmit);
    render(false);
  });
})();
