/*
 * Annual ITR Worksheet — ALL TEXT (English + Filipino)
 * -----------------------------------------------------
 * Every piece of text on the page lives here. Each entry has `en` and `fil`.
 * To change wording, edit the text between the quotes. Keep {words in braces}
 * as they are — the page fills them in (amounts, dates, item numbers).
 * Simple HTML like <strong>, <em> and <br> is allowed.
 * Keep "[confirm]" wherever an item number or label still needs checking.
 */
(function (root) {
  var S = {
    /* ---------- Banner, header, footer ---------- */
    banner: {
      en: 'Unofficial practice worksheet. Not a BIR form. File your actual return through eBIRForms or your RDO.',
      fil: 'Unofficial na practice worksheet. Hindi ito BIR form. I-file ang totoong return mo sa eBIRForms o sa RDO mo.'
    },
    app_title: { en: 'Annual ITR Worksheet', fil: 'Annual ITR Worksheet' },
    app_subtitle: {
      en: 'Practice for BIR Form 1701-MS (August 2024) — for micro and small taxpayers',
      fil: 'Practice para sa BIR Form 1701-MS (August 2024) — para sa micro at small taxpayers'
    },
    privacy: {
      en: 'Nothing you enter is saved or sent anywhere. It stays on this page and disappears when you close it.',
      fil: 'Walang sine-save o ipinapadala kahit saan. Nandito lang sa page na ito ang lahat ng ilalagay mo, at mabubura ito pagsara mo ng page.'
    },
    lang_label: { en: 'Language', fil: 'Wika' },
    skip_link: { en: 'Skip to the worksheet', fil: 'Diretso sa worksheet' },
    footer_follow: { en: 'Follow @missniceph on Instagram', fil: 'I-follow si @missniceph sa Instagram' },
    theme_toggle: { en: 'Switch light/dark mode', fil: 'Palitan ang light/dark mode' },
    start_over: { en: 'Start over', fil: 'Magsimula ulit' },
    back: { en: 'Back', fil: 'Bumalik' },
    next: { en: 'Next', fil: 'Susunod' },
    yes: { en: 'Yes', fil: 'Oo' },
    no: { en: 'No', fil: 'Hindi' },
    step_of: { en: 'Step {n} of {total}', fil: 'Step {n} ng {total}' },
    what_is_this: { en: 'What is this?', fil: 'Ano ito?' },
    footer_disclaimer: {
      en: '<strong>General information only, not tax advice.</strong> This is an unofficial practice tool, not affiliated with the BIR. Always check your entries in eBIRForms, and ask your RDO if unsure.',
      fil: '<strong>Pangkalahatang impormasyon lang, hindi tax advice.</strong> Unofficial na practice tool ito at walang kaugnayan sa BIR. Laging i-check ang entries mo sa eBIRForms, at magtanong sa RDO mo kung hindi sigurado.'
    },
    footer_sources: { en: 'Sources', fil: 'Mga pinagkunan' },
    source_1: { en: 'BIR Form 1701-MS (August 2024) and its Guidelines', fil: 'BIR Form 1701-MS (August 2024) at ang Guidelines nito' },
    source_2: { en: 'RA 11976 (Ease of Paying Taxes Act)', fil: 'RA 11976 (Ease of Paying Taxes Act)' },
    source_3: { en: 'RR 8-2024', fil: 'RR 8-2024' },
    source_4: { en: 'TRAIN Law (RA 10963)', fil: 'TRAIN Law (RA 10963)' },
    footer_made_by: { en: 'Made by {link} · Nice to Know', fil: 'Gawa ni {link} · Nice to Know' },

    /* ---------- Welcome ---------- */
    welcome_title: { en: "Let's prepare your annual ITR", fil: 'Ihanda natin ang annual ITR mo' },
    welcome_body: {
      en: "This worksheet walks you through BIR Form 1701-MS (August 2024), the annual income tax return for individuals classified as <strong>micro</strong> or <strong>small</strong> taxpayers. Answer a few questions, enter your numbers one at a time, and you'll see exactly what to type into eBIRForms.",
      fil: 'Tutulungan ka ng worksheet na ito sa BIR Form 1701-MS (August 2024) — ang annual income tax return ng mga indibidwal na classified as <strong>micro</strong> o <strong>small</strong> taxpayers. Sagutin mo lang ang ilang tanong at ilagay ang mga numero isa-isa. Sa dulo, makikita mo kung ano mismo ang ita-type mo sa eBIRForms.'
    },
    welcome_explain: {
      en: '<strong>Micro taxpayers</strong> have gross sales below {micro} a year. <strong>Small taxpayers</strong> have gross sales from {micro} to below {limit}.',
      fil: '<strong>Micro taxpayer</strong> ka kung below {micro} ang gross sales mo sa isang taon. <strong>Small taxpayer</strong> naman kung {micro} hanggang below {limit}.'
    },
    welcome_ready: { en: 'Good to have nearby (if they apply to you):', fil: 'Ihanda mo na rin ito (kung meron ka):' },
    welcome_ready_list: {
      en: '<li>Your sales records for the year</li><li>Your 1st to 3rd quarter returns (BIR Form 1701Q) and proof of payment</li><li>BIR Form 2307 from clients who withheld tax</li><li>BIR Form 2316 from your employer, if you were also employed</li>',
      fil: '<li>Records ng benta mo sa buong taon</li><li>Ang 1st hanggang 3rd quarter returns mo (BIR Form 1701Q) at proof of payment</li><li>BIR Form 2307 mula sa clients na nag-withhold ng tax</li><li>BIR Form 2316 mula sa employer mo, kung empleyado ka rin</li>'
    },
    welcome_start: { en: "Let's start", fil: 'Simulan na natin' },

    /* ---------- Eligibility ---------- */
    elig_sales_q: {
      en: 'Are your annual gross sales below {limit}?',
      fil: 'Below {limit} ba ang annual gross sales mo?'
    },
    elig_sales_explain: {
      en: 'Gross sales means your total sales, receipts or fees for the whole year, before taking out any expenses. BIR Form 1701-MS is for <strong>micro</strong> taxpayers (below {micro}) and <strong>small</strong> taxpayers ({micro} to below {limit}).',
      fil: 'Ang gross sales ay ang kabuuang benta, resibo o fees mo sa buong taon, bago ibawas ang kahit anong gastos. Ang BIR Form 1701-MS ay para sa <strong>micro</strong> taxpayers (below {micro}) at <strong>small</strong> taxpayers ({micro} hanggang below {limit}).'
    },
    elig_act_q: {
      en: 'Do you have two or more business activities, or income under special/preferential rates or tax exemptions?',
      fil: 'May dalawa o higit pa bang business activities ka, o income na may special/preferential rate o tax exemption?'
    },
    elig_act_explain: {
      en: 'BIR Form 1701-MS (and this worksheet) is for one business or profession taxed at regular rates. If you have more than one business activity, or income that gets a special or preferential tax rate, or a tax exemption, answer <strong>Yes</strong>.',
      fil: 'Ang BIR Form 1701-MS (at ang worksheet na ito) ay para sa isang business o profession na regular rate ang tax. Kung higit sa isa ang business activity mo, o may income kang may special o preferential tax rate, o tax exemption, sumagot ng <strong>Oo</strong>.'
    },
    stop_title: { en: 'Use BIR Form 1701 instead', fil: 'BIR Form 1701 ang gamitin mo' },
    stop_sales: {
      en: 'BIR Form 1701-MS is only for micro and small taxpayers — gross sales below {limit}. Since yours are {limit} or more, you should file <strong>BIR Form 1701</strong> instead. This worksheet does not cover that form.',
      fil: 'Para lang ang BIR Form 1701-MS sa micro at small taxpayers — gross sales na below {limit}. Dahil {limit} o higit pa ang sa iyo, <strong>BIR Form 1701</strong> ang dapat mong i-file. Hindi sakop ng worksheet na ito ang form na iyon.'
    },
    stop_activities: {
      en: 'If you have two or more business activities, or income under special/preferential rates or tax exemptions, you should file <strong>BIR Form 1701</strong> instead of 1701-MS. This worksheet does not cover that form.',
      fil: 'Kung dalawa o higit pa ang business activities mo, o may income kang may special/preferential rate o tax exemption, <strong>BIR Form 1701</strong> ang dapat mong i-file imbes na 1701-MS. Hindi sakop ng worksheet na ito ang form na iyon.'
    },
    stop_unsure: { en: 'Not sure? Ask your RDO.', fil: 'Hindi sigurado? Magtanong sa RDO mo.' },
    stop_back: { en: 'Go back and change my answer', fil: 'Bumalik at baguhin ang sagot ko' },

    /* ---------- Tax option ---------- */
    option_q: {
      en: 'Did you choose the 8% income tax option for this year?',
      fil: 'Pinili mo ba ang 8% income tax option ngayong taon?'
    },
    option_explain: {
      en: 'Your business income is taxed one of two ways: the <strong>8% income tax option</strong> (8% of your gross sales/receipts and other non-operating income — purely self-employed individuals first deduct {deduction}), or the <strong>graduated income tax rates</strong> (0% to 35% of your taxable income after deductions).',
      fil: 'May dalawang paraan ng pag-compute ng tax sa business income mo: ang <strong>8% income tax option</strong> (8% ng gross sales/receipts at other non-operating income mo — ibabawas muna ang {deduction} kung purely self-employed ka), o ang <strong>graduated income tax rates</strong> (0% hanggang 35% ng taxable income mo pagkatapos ng deductions).'
    },
    option_8: { en: 'Yes, 8%', fil: 'Oo, 8%' },
    option_grad: { en: 'No, graduated rates', fil: 'Hindi, graduated rates' },
    option_notsure: { en: 'Not sure', fil: 'Hindi sigurado' },
    option_notsure_text: {
      en: '<strong>Good to know:</strong> this choice was made on your <strong>first-quarter return</strong> for the year, and it <strong>cannot be changed</strong> for the rest of that year. Check your first-quarter return: if you chose the 8% option there, pick <em>Yes, 8%</em>. Otherwise, pick <em>No, graduated rates</em>.',
      fil: '<strong>Good to know:</strong> pinili mo na ito noong nag-file ka ng <strong>first-quarter return</strong> mo ngayong taon, at <strong>hindi na ito puwedeng palitan</strong> sa buong taon. Silipin mo ang first-quarter return mo: kung 8% option ang pinili mo roon, piliin ang <em>Oo, 8%</em>. Kung hindi, piliin ang <em>Hindi, graduated rates</em>.'
    },

    /* ---------- Income type ---------- */
    income_q: {
      en: 'Is your income purely from your business or profession, or do you also earn a salary (mixed income)?',
      fil: 'Puro business o profession lang ba ang income mo, o may sweldo ka rin bilang empleyado (mixed income)?'
    },
    income_explain: {
      en: '<strong>Purely self-employed/professional:</strong> all your income comes from your own business or profession.<br><strong>Mixed income:</strong> you were also employed and received compensation (salary) during the year — shown on the BIR Form 2316 from your employer.',
      fil: '<strong>Purely self-employed/professional:</strong> lahat ng income mo ay galing sa sarili mong business o profession.<br><strong>Mixed income:</strong> empleyado ka rin at may natanggap kang compensation (sweldo) sa taon na iyon — makikita ito sa BIR Form 2316 na bigay ng employer mo.'
    },
    income_8_note: {
      en: 'Under the 8% option, only purely self-employed individuals and/or professionals get the {deduction} deduction. Mixed-income earners do not.',
      fil: 'Sa 8% option, ang purely self-employed individuals at/o professionals lang ang may {deduction} na deduction. Wala nito ang mga mixed-income earner.'
    },
    income_pure: { en: 'Purely self-employed / professional', fil: 'Purely self-employed / professional lang' },
    income_mixed: { en: 'Mixed income (also employed)', fil: 'Mixed income (empleyado rin)' },

    /* ---------- Deduction method ---------- */
    ded_q: {
      en: 'Which deduction did you choose: itemized deductions or the Optional Standard Deduction (40%)?',
      fil: 'Alin ang pinili mong deduction: itemized deductions o Optional Standard Deduction (40%)?'
    },
    ded_explain: {
      en: '<strong>Itemized deductions:</strong> you list your allowable deductions one by one (ordinary, special, and NOLCO).<br><strong>Optional Standard Deduction (OSD):</strong> you simply deduct {osd}% of your Total Sales/Revenue/Fees, in place of itemized deductions. OSD users do not need to submit financial statements, but must keep records of gross sales.<br><strong>Important:</strong> the choice was made in the <strong>first quarter</strong> and is <strong>irrevocable</strong> (can\'t be changed) for the year.',
      fil: '<strong>Itemized deductions:</strong> isa-isa mong ililista ang allowable deductions mo (ordinary, special, at NOLCO).<br><strong>Optional Standard Deduction (OSD)</strong> – {osd}% ng kabuuang benta, ibabawas mo na lang nang hindi na kailangan ng resibo ng gastos. Hindi na kailangang mag-submit ng financial statements ang naka-OSD, pero kailangan pa ring itago ang records ng gross sales.<br><strong>Importante:</strong> pinili mo ito noong <strong>first quarter</strong> at <strong>irrevocable</strong> ito (hindi na puwedeng palitan) sa buong taon.'
    },
    ded_itemized: { en: 'Itemized deductions', fil: 'Itemized deductions (isa-isang deduction)' },
    ded_osd: { en: 'Optional Standard Deduction (OSD) – 40%', fil: 'Optional Standard Deduction (OSD) – 40%' },

    /* ---------- Number entry ---------- */
    input_hint: { en: 'Whole pesos are fine. Leave blank or type 0 if none.', fil: 'Okay na ang buong piso. Puwedeng iwanang blangko o i-type ang 0 kung wala.' },
    input_invalid: { en: 'Please type numbers only, like 150000 or 150,000.50 (no letters or minus sign).', fil: 'Numero lang ang i-type, halimbawa 150000 o 150,000.50 (walang letra o minus sign).' },
    input_rounded: { en: 'No centavos: this will be entered as {amt}.', fil: 'Walang centavos: {amt} ang ilalagay.' },
    warn_sales_limit: {
      en: 'That is {limit} or more. BIR Form 1701-MS is only for gross sales below {limit}, so you may need BIR Form 1701 instead.',
      fil: '{limit} o higit pa iyan. Para lang ang BIR Form 1701-MS sa gross sales na below {limit}, kaya baka BIR Form 1701 ang kailangan mo.'
    },
    input_preview: { en: 'You entered {amt}.', fil: 'Inilagay mo: {amt}.' },

    f_comp_label: { en: 'Taxable compensation income', fil: 'Taxable compensation income (sweldong may tax)' },
    f_comp_explain: {
      en: 'Your taxable salary/compensation from your job for the whole year. Your employer\'s BIR Form 2316 should help you find it. If you have more than one BIR Form 2316, use the total.',
      fil: 'Ang taxable na sweldo/compensation mo mula sa trabaho sa buong taon. Makakatulong ang BIR Form 2316 na bigay ng employer mo para makita ito. Kung higit sa isa ang BIR Form 2316 mo, gamitin ang kabuuan.'
    },
    f_sales7_label: { en: 'Total Sales/Revenue/Fees', fil: 'Total Sales/Revenue/Fees (kabuuang benta/kita/fees)' },
    f_sales7_explain: {
      en: 'All your sales, receipts or professional fees from your business or profession for the whole year. If you use OSD, your deduction is {osd}% of this amount. In eBIRForms, Items 5 to 9 cover sales/revenue and gross income details [confirm labels]; Item 7 is this total.',
      fil: 'Lahat ng benta, resibo o professional fees mo mula sa business o profession sa buong taon. Kung naka-OSD ka, {osd}% nito ang deduction mo. Sa eBIRForms, ang Items 5 hanggang 9 ay para sa sales/revenue at gross income details [confirm labels]; Item 7 ang kabuuang ito.'
    },
    f_sales19_label: { en: 'Gross sales/receipts [confirm label]', fil: 'Gross sales/receipts [confirm label] (kabuuang benta/resibo)' },
    f_sales19_explain: {
      en: 'Your total sales, receipts or fees from your business or profession for the whole year. Under the 8% option, no expenses are deducted — only the {deduction} deduction if you are purely self-employed.',
      fil: 'Ang kabuuang benta, resibo o fees mo mula sa business o profession sa buong taon. Sa 8% option, walang ibabawas na gastos — ang {deduction} deduction lang kung purely self-employed ka.'
    },
    f_10A_label: { en: 'Ordinary allowable itemized deductions', fil: 'Ordinary allowable itemized deductions (karaniwang deductions)' },
    f_10A_explain: {
      en: 'The total of the ordinary allowable itemized deductions you are claiming for the year, based on your records and receipts.',
      fil: 'Ang kabuuan ng ordinary allowable itemized deductions na kine-claim mo ngayong taon, base sa records at resibo mo.'
    },
    f_10B_label: { en: 'Special allowable itemized deductions', fil: 'Special allowable itemized deductions (espesyal na deductions)' },
    f_10B_explain: {
      en: 'The total of any special allowable itemized deductions you are claiming. Leave blank if none.',
      fil: 'Ang kabuuan ng special allowable itemized deductions na kine-claim mo, kung meron. Iwanang blangko kung wala.'
    },
    f_10C_label: { en: 'Net Operating Loss Carry-Over (NOLCO)', fil: 'Net Operating Loss Carry-Over (NOLCO)' },
    f_10C_explain: {
      en: 'NOLCO is a net operating loss from earlier years that you are carrying over and deducting this year. Leave blank if none.',
      fil: 'Ang NOLCO ay net operating loss mula sa mga nakaraang taon na dinadala mo at ibinabawas ngayong taon. Iwanang blangko kung wala.'
    },
    f_other13_label: { en: 'Other non-operating income', fil: 'Other non-operating income (iba pang kita)' },
    f_other20_label: { en: 'Other non-operating income [confirm label]', fil: 'Other non-operating income [confirm label] (iba pang kita)' },
    f_other_explain: {
      en: 'Other income that is not from your main business operations, if any. Leave blank if none.',
      fil: 'Iba pang kita na hindi galing sa mismong operasyon ng business mo, kung meron. Iwanang blangko kung wala.'
    },
    f_quarterly_label: { en: 'Income tax paid in the 1st to 3rd quarters (BIR Form 1701Q)', fil: 'Income tax na binayaran mo sa 1st hanggang 3rd quarter (BIR Form 1701Q)' },
    f_quarterly_explain: {
      en: 'Add up the income tax you paid on your 1701Q returns for the 1st, 2nd and 3rd quarters of the year. Keep your proof of payment.',
      fil: 'Pagsamahin ang income tax na binayaran mo sa 1701Q returns mo para sa 1st, 2nd at 3rd quarter ng taon. Itago ang proof of payment mo.'
    },
    f_2307_label: { en: 'Creditable tax withheld per BIR Form 2307', fil: 'Creditable tax withheld ayon sa BIR Form 2307' },
    f_2307_explain: {
      en: 'Clients who withheld tax from what they paid you give you BIR Form 2307. Enter the total creditable tax withheld shown on your 2307s. Keep the forms — they are attachments.',
      fil: 'Ang clients na nag-withhold ng tax sa bayad nila sa iyo ay nagbibigay ng BIR Form 2307. Ilagay ang kabuuang creditable tax withheld na nakasulat sa mga 2307 mo. Itago ang mga form — attachments ang mga ito.'
    },
    f_2316_label: { en: 'Tax withheld on compensation per BIR Form 2316', fil: 'Tax na na-withhold sa sweldo ayon sa BIR Form 2316' },
    f_2316_explain: {
      en: 'The tax your employer already withheld from your salary, shown on your BIR Form 2316. If you have more than one 2316, use the total.',
      fil: 'Ang tax na na-withhold na ng employer mo mula sa sweldo mo, na nakasulat sa BIR Form 2316 mo. Kung higit sa isa ang 2316 mo, gamitin ang kabuuan.'
    },
    f_othercr_label: { en: 'Other tax credits/payments with proof [confirm]', fil: 'Iba pang tax credits/payments na may proof [confirm]' },
    f_othercr_explain: {
      en: 'Any other tax credit or payment for the year that you can prove. Leave blank if none.',
      fil: 'Iba pang tax credit o payment para sa taon na may proof ka. Iwanang blangko kung wala.'
    },
    see_results: { en: 'See my results', fil: 'Tingnan ang resulta ko' },

    /* ---------- Item references ---------- */
    ref_IVA: { en: 'Part IV-A · Item {n}', fil: 'Part IV-A · Item {n}' },
    ref_IVB1: { en: 'Part IV-B1 · Item {n}', fil: 'Part IV-B1 · Item {n}' },
    ref_IVB2: { en: 'Part IV-B2 · Item {n}', fil: 'Part IV-B2 · Item {n}' },
    ref_V: { en: 'Part V · Items 1–9 [confirm item no.]', fil: 'Part V · Items 1–9 [confirm item no.]' },

    /* ---------- Results ---------- */
    results_title: { en: 'Your results', fil: 'Ang resulta mo' },
    results_route: { en: 'Your route', fil: 'Ang sitwasyon mo' },
    route_8: { en: '8% income tax option', fil: '8% income tax option' },
    route_grad: { en: 'Graduated income tax rates', fil: 'Graduated income tax rates' },
    route_pure: { en: 'purely self-employed/professional', fil: 'purely self-employed/professional' },
    route_mixed: { en: 'mixed income', fil: 'mixed income' },
    route_osd: { en: 'Optional Standard Deduction (40%)', fil: 'Optional Standard Deduction (40%)' },
    route_itemized: { en: 'itemized deductions', fil: 'itemized deductions' },
    res_tax_due: { en: 'Total income tax due', fil: 'Kabuuang income tax due' },
    res_credits: { en: 'Less: total tax credits/payments', fil: 'Bawas: kabuuang tax credits/payments' },
    res_payable: { en: 'Tax payable', fil: 'Babayaran mo pa' },
    res_overpayment: { en: 'Overpayment', fil: 'Sobra ang naibayad mo (overpayment)' },
    res_nothing: { en: 'Nothing more to pay', fil: 'Wala ka nang babayaran' },
    res_nothing_text: {
      en: 'There is no tax left to pay. You still need to file your return.',
      fil: 'Wala ka nang natitirang tax na babayaran. Pero kailangan mo pa ring i-file ang return mo.'
    },
    warn_net_loss: {
      en: 'Your deductions are bigger than your sales and other income, so your taxable business income is below zero. This worksheet may not handle that correctly — please check with your RDO.',
      fil: 'Mas malaki ang deductions mo kaysa sa benta at iba pang kita mo, kaya below zero ang taxable business income mo. Baka hindi tama ang compute ng worksheet na ito sa ganitong sitwasyon — mas mabuting magtanong sa RDO mo.'
    },

    inst_title: { en: 'Installment option', fil: 'Puwedeng hulugan (installment)' },
    inst_text: {
      en: 'Because your tax due is more than {threshold}, you may pay in <strong>two equal installments</strong>: the first when you file, the second on or before <strong>{date}</strong>. If you miss an installment, the whole unpaid amount becomes due, with penalties.',
      fil: 'Dahil lampas {threshold} ang tax due mo, puwede kang magbayad nang <strong>dalawang pantay na hulog</strong>: ang una pag nag-file ka, ang pangalawa on or before <strong>{date}</strong>. Kapag hindi mo nabayaran ang isang hulog, magiging due agad ang buong natitirang balanse, may kasama pang penalties.'
    },
    inst_checkbox: { en: 'I want to pay in two installments', fil: 'Gusto kong magbayad nang dalawang hulog' },
    inst_first: { en: 'Pay when you file', fil: 'Bayaran pag nag-file ka' },
    inst_second: { en: 'Pay on or before {date} (Part II Item 26)', fil: 'Bayaran on or before {date} (Part II Item 26)' },
    inst_odd: {
      en: 'No centavos: the extra ₱1 goes to the first installment. [confirm]',
      fil: 'Walang centavos: ang sobrang ₱1 ay isasama sa unang hulog. [confirm]'
    },

    over_title: { en: 'What to do with your overpayment (Part II Item 31)', fil: 'Ano ang gagawin sa overpayment mo (Part II Item 31)' },
    over_text: {
      en: 'Choose one. <strong>Your choice is irrevocable.</strong> If you don\'t mark any, it is automatically carried over.',
      fil: 'Pumili ng isa. <strong>Irrevocable ang pipiliin mo</strong> (hindi na mababago). Kung wala kang mamarkahan, automatic itong ica-carry over.'
    },
    over_refund: { en: 'To be refunded', fil: 'Ipa-refund' },
    over_tcc: { en: 'To be issued a Tax Credit Certificate', fil: 'Ma-isyuhan ng Tax Credit Certificate' },
    over_carryover: { en: "To be carried over to next year's quarterly returns", fil: 'I-carry over sa quarterly returns ng susunod na taon' },
    over_default: { en: '(automatic if none is marked)', fil: '(automatic kung walang minarkahan)' },

    ebir_title: { en: 'What to enter in eBIRForms (1701-MS)', fil: 'Ano ang ilalagay sa eBIRForms (1701-MS)' },
    ebir_intro: {
      en: 'Whole pesos only. Items marked <strong>[confirm]</strong> need a double-check of the item number or label in eBIRForms. Amounts in (parentheses) are below zero — in Part II Item 25, that means an overpayment.',
      fil: 'Buong piso lang. Ang may <strong>[confirm]</strong> ay kailangang i-double-check ang item number o label sa eBIRForms. Ang amount na naka-(parentheses) ay below zero — sa Part II Item 25, ibig sabihin nito ay overpayment.'
    },
    col_item: { en: 'Item', fil: 'Item' },
    col_desc: { en: 'What it is', fil: 'Ano ito' },
    col_amount: { en: 'Amount', fil: 'Halaga' },
    part_IVA: { en: 'Part IV-A – Taxable Compensation Income', fil: 'Part IV-A – Taxable Compensation Income' },
    part_IVB1: { en: 'Part IV-B1 – Taxable Business Income for Graduated Rates', fil: 'Part IV-B1 – Taxable Business Income for Graduated Rates' },
    part_IVB2: { en: 'Part IV-B2 – Taxable Business Income for 8% Rate', fil: 'Part IV-B2 – Taxable Business Income for 8% Rate' },
    part_V: { en: 'Part V – Tax Credits/Payments', fil: 'Part V – Tax Credits/Payments' },
    part_II: { en: 'Part II – Total Income Tax Payable', fil: 'Part II – Total Income Tax Payable' },

    r_IVA_12: { en: '[confirm labels] Not computed by this worksheet — check eBIRForms', fil: '[confirm labels] Hindi kino-compute dito — i-check sa eBIRForms' },
    r_IVA_3: { en: 'Taxable compensation income', fil: 'Taxable compensation income' },
    r_IVA_4: { en: 'Tax due on compensation (graduated rates on Item 3)', fil: 'Tax due sa compensation (graduated rates sa Item 3)' },
    r_B1_59: { en: '[confirm labels] Sales/revenue and gross income details — check eBIRForms', fil: '[confirm labels] Sales/revenue at gross income details — i-check sa eBIRForms' },
    r_B1_7: { en: 'Total Sales/Revenue/Fees', fil: 'Total Sales/Revenue/Fees' },
    r_B1_10A: { en: 'Ordinary allowable itemized deductions', fil: 'Ordinary allowable itemized deductions' },
    r_B1_10B: { en: 'Special allowable itemized deductions', fil: 'Special allowable itemized deductions' },
    r_B1_10C: { en: 'NOLCO', fil: 'NOLCO' },
    r_B1_10D: { en: 'Total allowable itemized deductions (10A + 10B + 10C)', fil: 'Total allowable itemized deductions (10A + 10B + 10C)' },
    r_B1_11: { en: 'Optional Standard Deduction ({osd}% of Item 7)', fil: 'Optional Standard Deduction ({osd}% ng Item 7)' },
    r_B1_13: { en: 'Other non-operating income', fil: 'Other non-operating income' },
    r_B1_14: { en: 'Taxable business income [confirm label] (Item 7 − deductions + Item 13)', fil: 'Taxable business income [confirm label] (Item 7 − deductions + Item 13)' },
    r_B1_15: { en: 'Total Taxable Income – Compensation & Business (Item 3 + Item 14)', fil: 'Total Taxable Income – Compensation & Business (Item 3 + Item 14)' },
    r_B1_skip: { en: 'Not applicable here (special/preferential or exempt — out of scope)', fil: 'Hindi applicable dito (special/preferential o exempt — wala sa sakop)' },
    r_B1_18B: { en: 'Total Tax Due (graduated rates on Item 15) → Part II Item 22', fil: 'Total Tax Due (graduated rates sa Item 15) → Part II Item 22' },
    r_B2_19: { en: 'Gross sales/receipts [confirm label]', fil: 'Gross sales/receipts [confirm label]' },
    r_B2_20: { en: 'Other non-operating income [confirm label]', fil: 'Other non-operating income [confirm label]' },
    r_B2_21: { en: 'Total Income (Item 19 + Item 20)', fil: 'Total Income (Item 19 + Item 20)' },
    r_B2_22_pure: { en: 'Less: {deduction} deduction (purely self-employed)', fil: 'Bawas: {deduction} deduction (purely self-employed)' },
    r_B2_22_mixed: { en: 'No {deduction} deduction for mixed income — enter 0', fil: 'Walang {deduction} deduction ang mixed income — ilagay ang 0' },
    r_B2_23: { en: 'Taxable Income (Item 21 − Item 22, not below zero)', fil: 'Taxable Income (Item 21 − Item 22, hindi bababa sa zero)' },
    r_B2_24: { en: 'Tax Due – Business Income (Item 23 × 8%)', fil: 'Tax Due – Business Income (Item 23 × 8%)' },
    r_B2_25: { en: 'Total Tax Due – Compensation & Business (Item 4 + Item 24) → Part II Item 22', fil: 'Total Tax Due – Compensation & Business (Item 4 + Item 24) → Part II Item 22' },
    r_V_quarterly: { en: 'Income tax paid in the 1st to 3rd quarters (1701Q)', fil: 'Income tax na binayaran sa 1st hanggang 3rd quarter (1701Q)' },
    r_V_2307: { en: 'Creditable tax withheld per BIR Form 2307', fil: 'Creditable tax withheld ayon sa BIR Form 2307' },
    r_V_2316: { en: 'Tax withheld on compensation per BIR Form 2316', fil: 'Tax withheld sa compensation ayon sa BIR Form 2316' },
    r_V_other: { en: 'Other tax credits/payments', fil: 'Iba pang tax credits/payments' },
    r_V_10: { en: 'Total Tax Credits/Payments', fil: 'Total Tax Credits/Payments' },
    r_II_21: { en: 'Income tax due under special rates — 0 for this worksheet [confirm]', fil: 'Income tax due sa special rates — 0 sa worksheet na ito [confirm]' },
    r_II_22: { en: 'Income Tax Due – Regular Rate (from Part IV Item {from})', fil: 'Income Tax Due – Regular Rate (mula sa Part IV Item {from})' },
    r_II_23: { en: 'Total Income Tax Due (Item 21 + Item 22)', fil: 'Total Income Tax Due (Item 21 + Item 22)' },
    r_II_24: { en: 'Less: Total Tax Credits/Payments (Part V Item 10)', fil: 'Bawas: Total Tax Credits/Payments (Part V Item 10)' },
    r_II_25: { en: 'Tax payable/(overpayment) (Item 23 − Item 24) [confirm label]', fil: 'Tax payable/(overpayment) (Item 23 − Item 24) [confirm label]' },
    r_II_26: { en: 'Second installment, due on or before {date}', fil: 'Pangalawang hulog, due on or before {date}' },
    r_II_28: { en: 'Penalties — not computed here; see reminders', fil: 'Penalties — hindi kino-compute dito; tingnan ang reminders' },
    r_II_31: { en: 'Overpayment option: {choice}', fil: 'Pinili para sa overpayment: {choice}' },
    r_II_31_auto: { en: 'Overpayment option: none marked, so it is automatically carried over', fil: 'Walang minarkahan para sa overpayment, kaya automatic itong ica-carry over' },

    copy_btn: { en: 'Copy my summary', fil: 'Kopyahin ang summary ko' },
    copied: { en: 'Copied! Paste it in your notes.', fil: 'Nakopya na! I-paste mo sa notes mo.' },
    copy_failed: { en: "Couldn't copy automatically. Select the text below and copy it.", fil: 'Hindi na-copy nang automatic. I-select ang text sa ibaba at kopyahin.' },
    to_deadline: { en: 'Next: deadline and reminders', fil: 'Susunod: deadline at reminders' },
    back_to_results: { en: 'Back to my results', fil: 'Bumalik sa resulta ko' },

    /* ---------- Deadline and reminders ---------- */
    dl_title: { en: 'Deadline and reminders', fil: 'Deadline at reminders' },
    dl_explain: {
      en: 'The annual return is filed and paid on or before <strong>April 15</strong> of each year, covering the previous taxable year.',
      fil: 'Kailangang i-file at bayaran ang annual return on or before <strong>Abril 15</strong> kada taon, para sa nakaraang taxable year.'
    },
    dl_main: {
      en: 'For taxable year {ty}: file and pay on or before <strong>{date}</strong>.',
      fil: 'Para sa taxable year {ty}: mag-file at magbayad on or before <strong>{date}</strong>.'
    },
    dl_how_title: { en: 'How to file', fil: 'Paano mag-file' },
    dl_how: {
      en: 'File electronically, for example with the <strong>Offline eBIRForms Package version {ver} or later</strong>. Micro and small taxpayers may also use BIR Form 1701 or 1701A instead of 1701-MS.',
      fil: 'Mag-file electronically, halimbawa gamit ang <strong>Offline eBIRForms Package version {ver} o mas bago</strong>. Puwede ring gamitin ng micro at small taxpayers ang BIR Form 1701 o 1701A imbes na 1701-MS.'
    },
    dl_attach_title: { en: 'Common attachments (if they apply to you)', fil: 'Karaniwang attachments (kung meron ka)' },
    dl_attach: {
      en: '<li>BIR Form 2307 (creditable tax withheld)</li><li>BIR Form 2316 (if you were also employed)</li><li>Proof of quarterly payments</li>',
      fil: '<li>BIR Form 2307 (creditable tax withheld)</li><li>BIR Form 2316 (kung empleyado ka rin)</li><li>Proof ng quarterly payments</li>'
    },
    dl_osd_records: {
      en: 'Using OSD? You don\'t need to submit financial statements, but keep records of your gross sales.',
      fil: 'Naka-OSD ka? Hindi mo na kailangang mag-submit ng financial statements, pero itago ang records ng gross sales mo.'
    },
    dl_inst_title: { en: 'Paying in installments', fil: 'Pagbabayad nang hulugan' },
    dl_inst: {
      en: 'If your tax due is more than {threshold}, you may pay in two equal installments: the first when you file, the second on or before {date}. Miss an installment and the whole unpaid amount becomes due, with penalties.',
      fil: 'Kung lampas {threshold} ang tax due mo, puwede kang magbayad nang dalawang pantay na hulog: ang una pag nag-file ka, ang pangalawa on or before {date}. Kapag may hulog na hindi nabayaran, due agad ang buong natitirang balanse, may kasama pang penalties.'
    },
    dl_late_title: { en: 'Filing late?', fil: 'Late ka na sa pag-file?' },
    dl_late: {
      en: 'This worksheet does <strong>not</strong> compute penalties (Part II Items 28A–28C). For micro and small taxpayers, late filing or payment carries a <strong>10% surcharge</strong> (50% for willful neglect or fraud), <strong>interest at 6%</strong>, and a <strong>compromise penalty at 50%</strong> of the usual amount. If filing late, ask your RDO.',
      fil: '<strong>Hindi</strong> kino-compute ng worksheet na ito ang penalties (Part II Items 28A–28C). Para sa micro at small taxpayers, ang late na pag-file o pagbayad ay may <strong>10% surcharge</strong> (50% kung willful neglect o fraud), <strong>interest na 6%</strong>, at <strong>compromise penalty na 50%</strong> ng karaniwang halaga. Kung late ka mag-file, magtanong sa RDO mo.'
    },
    dl_over_title: { en: 'Overpayment', fil: 'Overpayment' },
    dl_over: {
      en: 'If you overpaid, choose in Item 31: refund, tax credit certificate, or carry-over to next year\'s quarters. The choice is irrevocable; if none is marked, it is automatically carried over.',
      fil: 'Kung sobra ang naibayad mo, pumili sa Item 31: refund, tax credit certificate, o carry-over sa quarters ng susunod na taon. Irrevocable ang pipiliin; kung walang minarkahan, automatic itong ica-carry over.'
    },

    /* ---------- Plain-text summary ---------- */
    sum_heading: { en: 'ANNUAL ITR WORKSHEET — MY SUMMARY (BIR Form 1701-MS, August 2024)', fil: 'ANNUAL ITR WORKSHEET — SUMMARY KO (BIR Form 1701-MS, August 2024)' },
    sum_footer: {
      en: 'General information only, not tax advice. Made with the Annual ITR Worksheet by @missniceph (Nice to Know).',
      fil: 'Pangkalahatang impormasyon lang, hindi tax advice. Ginawa gamit ang Annual ITR Worksheet ni @missniceph (Nice to Know).'
    }
  };

  if (typeof module === 'object' && module.exports) module.exports = S;
  else root.ITR_STRINGS = S;
})(typeof self !== 'undefined' ? self : this);
