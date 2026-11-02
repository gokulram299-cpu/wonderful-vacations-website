(function () {
  'use strict';
  var C = window.WV_CONFIG || {};
  var API = (C.apiBase || '').replace(/\/$/, '');
  var LANG = 'en';
  try { LANG = localStorage.getItem('wv_lang') || 'en'; } catch (e) { LANG = 'en'; }
  if (LANG !== 'ta') LANG = 'en';

  /* ---------- helpers ---------- */
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rupees(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function addDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return iso(d); }
  function fmtDate(s) { if (!s) return ''; var d = new Date(s + 'T00:00'); return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
  function plus6m(s) { var d = new Date(s + 'T00:00'), day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + 6); var last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); d.setDate(Math.min(day, last)); return iso(d); }
  function wa(text) { return C.whatsapp ? 'https://wa.me/' + C.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '') : 'contact.html'; }
  function api(path, body) {
    return fetch(API + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.error || 'Request failed'); e.status = r.status; throw e; } return j; });
    });
  }

  /* ---------- Tamil / English ---------- */
  var T = {
    ta: {
      'nav.book': 'புக்கிங்', 'nav.holidays': 'சுற்றுலா', 'nav.visa': 'விசா', 'nav.passport': 'பாஸ்போர்ட்', 'nav.groups': 'குழு சுற்றுலா', 'nav.mytrip': 'என் பயணம்', 'nav.contact': 'தொடர்பு',
      'hero.title': 'கோயம்புத்தூரிலிருந்து விமானம், ஹோட்டல், சுற்றுலா மற்றும் விசா',
      'hero.sub': 'எங்கள் விமான, ஹோட்டல் பார்ட்னர்களிடமிருந்து சிறந்த கட்டணம் · ஆன்லைனில் அல்லது WhatsApp-ல் புக் செய்யுங்கள் · தமிழ் & ஆங்கிலத்தில் 24x7 உதவி',
      'tab.flights': 'விமானம்', 'tab.hotels': 'ஹோட்டல்', 'tab.holidays': 'சுற்றுலா', 'tab.visa': 'விசா', 'tab.passport': 'பாஸ்போர்ட்', 'tab.groups': 'குழு',
      'btn.flights': 'சிறந்த கட்டணம் பெறுக', 'btn.hotels': 'ஹோட்டல் தேடு', 'btn.holidays': 'சுற்றுலா பார்க்க', 'btn.visa': 'விசா விவரம்', 'btn.passport': 'விண்ணப்பம் தொடங்கு', 'btn.groups': 'குழு quote பெறுக',
      'why.title': 'ஏன் Wonderful Vacations?', 'popular': 'கோயம்புத்தூரிலிருந்து பிரபலமான சுற்றுலா', 'all.packages': 'அனைத்து சுற்றுலாக்களும்',
      'wa.chat': 'WhatsApp', 'call': 'அழைக்க', 'enquire': 'விசாரிக்க', 'quote.wa': 'WhatsApp-ல் quote பெறுக', 'from': 'தொடக்க விலை', 'pp': 'ஒருவருக்கு',
      'f.name': 'பெயர்', 'f.mobile': 'மொபைல் (WhatsApp)', 'f.email': 'மின்னஞ்சல் (விருப்பம்)', 'f.consent': 'WhatsApp / அழைப்பு மூலம் தொடர்பு கொள்ள ஒப்புக்கொள்கிறேன். தனியுரிமைக் கொள்கையைப் படித்தேன்.', 'f.send': 'அனுப்பு',
      'mytrip.title': 'என் பயணம்', 'mytrip.find': 'என் புக்கிங்கைக் காண்க',
    },
  };
  function applyLang() {
    document.documentElement.lang = LANG === 'ta' ? 'ta' : 'en';
    $$('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.textContent);
      el.textContent = LANG === 'ta' && T.ta[k] ? T.ta[k] : el.getAttribute('data-en');
    });
    $$('.lang-btn').forEach(function (b) { b.textContent = LANG === 'ta' ? 'English' : 'தமிழ்'; b.setAttribute('lang', LANG === 'ta' ? 'en' : 'ta'); });
  }
  $$('.lang-btn').forEach(function (b) { b.addEventListener('click', function () { LANG = LANG === 'ta' ? 'en' : 'ta'; try { localStorage.setItem('wv_lang', LANG); } catch (e) {} applyLang(); }); });

  /* ---------- chrome: nav, contact links, year ---------- */
  var menu = $('#menuBtn'), nav = $('#mainNav');
  if (menu) menu.addEventListener('click', function () { var o = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', o ? 'true' : 'false'); });
  function fillContact() {
    $$('[data-wa]').forEach(function (a) { a.href = wa(a.getAttribute('data-wa') || 'Hi Wonderful Vacations, I need help with a booking.'); if (C.whatsapp) { a.target = '_blank'; a.rel = 'noopener'; } });
    $$('[data-tel]').forEach(function (a) { if (C.phone) { a.href = 'tel:' + C.phone.replace(/[^\d+]/g, ''); } });
    $$('[data-c]').forEach(function (el) { var v = C[el.getAttribute('data-c')]; if (v) el.textContent = v; });
    $$('[data-mail]').forEach(function (a) { if (C.email) { a.href = 'mailto:' + C.email; a.textContent = C.email; } });
    var y = $('#yr'); if (y) y.textContent = new Date().getFullYear();
    var map = $('#map'); if (map && C.googleMapsEmbed) { map.src = C.googleMapsEmbed; map.hidden = false; }
  }
  fillContact();
  // Live contact details from the CRM settings (admin edits them there)
  if (API) api('/api/public/config').then(function (c) {
    if (c.whatsapp) C.whatsapp = c.whatsapp; if (c.phone) C.phone = c.phone; if (c.email) C.email = c.email; if (c.gstin) C.gstin = c.gstin;
    fillContact();
  }).catch(function () {});

  /* ---------- drawer ---------- */
  var drawer = $('#drawer'), bg = $('#drawerBg'), lastFocus = null;
  function openDrawer(html) {
    lastFocus = document.activeElement;
    drawer.innerHTML = '<button class="x" type="button" data-close aria-label="Close">×</button>' + html;
    drawer.hidden = false; bg.hidden = false;
    var f = drawer.querySelector('input, select, textarea, button:not(.x)'); (f || drawer).focus();
  }
  function closeDrawer() { drawer.hidden = true; bg.hidden = true; if (lastFocus) lastFocus.focus(); }
  if (drawer) {
    bg.addEventListener('click', closeDrawer);
    drawer.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeDrawer(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); });
  }

  /* ---------- enquiry (every search / package / form becomes a CRM lead) ---------- */
  function contactFields(extra, px) {
    px = px || 'e';
    return '<div class="inp"><label for="' + px + 'Name">' + (LANG === 'ta' ? T.ta['f.name'] : 'Name') + '</label><input id="' + px + 'Name" name="name" autocomplete="name" required></div>' +
      '<div class="inp"><label for="' + px + 'Mob">' + (LANG === 'ta' ? T.ta['f.mobile'] : 'Mobile (WhatsApp)') + '</label><input id="' + px + 'Mob" name="mobile" inputmode="tel" autocomplete="tel" placeholder="10-digit mobile" required></div>' +
      '<div class="inp"><label for="' + px + 'Mail">' + (LANG === 'ta' ? T.ta['f.email'] : 'Email (optional)') + '</label><input id="' + px + 'Mail" name="email" type="email" autocomplete="email"></div>' + (extra || '') +
      '<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<label class="check"><input type="checkbox" name="consent" required> <span>' + (LANG === 'ta' ? T.ta['f.consent'] : 'I agree to be contacted on WhatsApp / phone about this enquiry. I have read the <a href="privacy.html">privacy policy</a>.') + '</span></label>';
  }
  function enquiry(title, summaryRows, payload, opts) {
    opts = opts || {};
    var rows = summaryRows.filter(function (r) { return r[1]; }).map(function (r) { return '<div><span>' + esc(r[0]) + '</span><b>' + esc(r[1]) + '</b></div>'; }).join('');
    var passport = payload.international && opts.askPassport ? '<div class="inp"><label for="ePass">Passport expiry (lead traveller)</label><input id="ePass" name="passport_expiry" type="date"><span class="fine">International travel needs at least 6 months validity from the travel date.</span></div>' : '';
    openDrawer('<h3 id="dTitle">' + esc(title) + '</h3>' + (rows ? '<div class="sum">' + rows + '</div>' : '') + (opts.note ? '<p class="fine">' + opts.note + '</p>' : '') +
      '<form class="form" id="enqForm" novalidate>' + contactFields(passport + '<div class="inp"><label for="eNote">Anything else?</label><textarea id="eNote" name="details" placeholder="Preferred airline, hotel area, budget, food preference..."></textarea></div>') +
      '<div id="enqMsg" role="status"></div><button class="btn btn-primary" type="submit">' + (opts.cta || 'Get best price on WhatsApp') + '</button>' +
      '<a class="btn btn-wa" data-wa="' + esc(waText(title, summaryRows)) + '">Chat on WhatsApp instead</a></form>');
    fillContact();
    var form = $('#enqForm'), msg = $('#enqMsg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form), data = Object.assign({}, payload);
      fd.forEach(function (v, k) { data[k] = v; });
      data.consent = !!form.consent.checked; data.language = LANG; data.page = location.pathname;
      var mob = String(data.mobile || '').replace(/\D/g, '');
      if (!data.name) { msg.className = 'msg bad'; msg.textContent = 'Please enter your name.'; return; }
      if (mob.length < 10) { msg.className = 'msg bad'; msg.textContent = 'Please enter a valid mobile number.'; return; }
      if (!data.consent) { msg.className = 'msg bad'; msg.textContent = 'Please tick the box so we can contact you.'; return; }
      if (data.international && data.passport_expiry && payload.depart_date && data.passport_expiry < plus6m(payload.depart_date)) {
        msg.className = 'msg warn'; msg.innerHTML = 'The passport must be valid until at least <b>' + fmtDate(plus6m(payload.depart_date)) + '</b> (6 months from travel). Please renew first - we can help with <a href="passport.html">passport renewal</a>. We will still save your enquiry.';
      }
      var btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Sending...';
      api('/api/public/enquiry', data).then(function (r) {
        form.innerHTML = '<div class="msg good"><b>Thank you!</b> Your enquiry reference is <span class="code">' + esc(r.ref || '') + '</span>. Our team will send the best options on WhatsApp shortly' + (isNight() ? ' (night-time enquiries are answered first thing in the morning)' : '') + '.</div>' +
          (r.warning ? '<div class="msg warn">' + esc(r.warning) + '</div>' : '') + '<button class="btn btn-ghost" type="button" data-close>Close</button>';
        if (window.gtag) window.gtag('event', 'generate_lead', { service: payload.service });
      }).catch(function () {
        btn.disabled = false; btn.textContent = 'Try again';
        msg.className = 'msg warn'; msg.innerHTML = 'We could not send the form right now. Please <a href="' + esc(wa(waText(title, summaryRows))) + '" target="_blank" rel="noopener">send it on WhatsApp</a> or call us.';
      });
    });
  }
  function isNight() { var h = new Date().getHours(); return h >= 22 || h < 8; }
  function waText(title, rows) { return 'Hi Wonderful Vacations, ' + title + '\n' + rows.filter(function (r) { return r[1]; }).map(function (r) { return r[0] + ': ' + r[1]; }).join('\n'); }
  window.WV_enquiry = enquiry;

  /* ---------- search console ---------- */
  var airports = [
    ['CJB', 'Coimbatore', 'India', 0], ['MAA', 'Chennai', 'India', 0], ['BLR', 'Bengaluru', 'India', 0], ['COK', 'Kochi', 'India', 0], ['TRZ', 'Tiruchirappalli', 'India', 0], ['IXM', 'Madurai', 'India', 0],
    ['BOM', 'Mumbai', 'India', 0], ['DEL', 'Delhi', 'India', 0], ['HYD', 'Hyderabad', 'India', 0], ['GOI', 'Goa', 'India', 0], ['CCU', 'Kolkata', 'India', 0], ['SXR', 'Srinagar', 'India', 0], ['IXZ', 'Port Blair', 'India', 0],
    ['DXB', 'Dubai', 'UAE', 1], ['AUH', 'Abu Dhabi', 'UAE', 1], ['SHJ', 'Sharjah', 'UAE', 1], ['DOH', 'Doha', 'Qatar', 1], ['MCT', 'Muscat', 'Oman', 1], ['BAH', 'Bahrain', 'Bahrain', 1], ['KWI', 'Kuwait', 'Kuwait', 1],
    ['SIN', 'Singapore', 'Singapore', 1], ['KUL', 'Kuala Lumpur', 'Malaysia', 1], ['BKK', 'Bangkok', 'Thailand', 1], ['HKT', 'Phuket', 'Thailand', 1], ['DPS', 'Bali (Denpasar)', 'Indonesia', 1],
    ['MLE', 'Male', 'Maldives', 1], ['CMB', 'Colombo', 'Sri Lanka', 1], ['JED', 'Jeddah', 'Saudi Arabia', 1], ['RUH', 'Riyadh', 'Saudi Arabia', 1], ['LHR', 'London', 'UK', 1], ['CDG', 'Paris', 'France', 1], ['JFK', 'New York', 'USA', 1], ['SYD', 'Sydney', 'Australia', 1]
  ];
  var A = {}; airports.forEach(function (a) { A[a[0]] = { code: a[0], city: a[1], country: a[2], intl: !!a[3] }; });
  var visas = [
    { c: 'UAE', docs: ['Passport front + back', 'Photo, white background', 'Confirmed return ticket', 'Hotel booking'], original: false },
    { c: 'Singapore', docs: ['Passport front + back', 'Photo 35×45 mm, matte', 'Bank statement, 6 months', 'ITR, 2 years', 'Cover letter'], original: false },
    { c: 'Thailand', docs: ['Passport front + back', 'Return ticket', 'Hotel booking', 'Funds proof'], original: false },
    { c: 'Indonesia (Bali)', docs: ['Passport front + back', 'Return ticket', 'Hotel booking'], original: false },
    { c: 'Malaysia', docs: ['Passport front + back', 'Photo', 'Return ticket', 'Hotel booking'], original: false },
    { c: 'Sri Lanka', docs: ['Passport front + back', 'Return ticket'], original: false },
    { c: 'Vietnam', docs: ['Passport front + back', 'Photo', 'Travel dates'], original: false },
    { c: 'Schengen (Europe)', docs: ['Original passport', 'Photos', 'Bank statement, 6 months', 'ITR, 3 years', 'Travel insurance', 'Leave / NOC letter', 'Hotel + flight bookings'], original: true },
    { c: 'United Kingdom', docs: ['Original passport + old passports', 'Bank statement, 6 months', 'ITR, 3 years', 'Employment / business proof', 'Itinerary'], original: true },
    { c: 'USA', docs: ['Original passport', 'DS-160 confirmation', 'Interview appointment', 'Financial documents'], original: true },
    { c: 'Other country', docs: ['We will share the exact list for your country'], original: false }
  ];

  var tabs = $$('.tab'), panels = $$('.panel');
  function showTab(name) {
    tabs.forEach(function (t) { t.setAttribute('aria-selected', t.dataset.tab === name ? 'true' : 'false'); t.tabIndex = t.dataset.tab === name ? 0 : -1; });
    panels.forEach(function (p) { p.hidden = p.dataset.panel !== name; });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { showTab(t.dataset.tab); });
    t.addEventListener('keydown', function (e) { var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); showTab(n.dataset.tab); } });
  });
  var initial = new URLSearchParams(location.search).get('tab') || (document.body.dataset.tab || '');
  if (initial && $('[data-tab="' + initial + '"]')) showTab(initial);

  function pressed(group, btn) { $$('[data-' + group + ']').forEach(function (x) { x.setAttribute('aria-pressed', x === btn ? 'true' : 'false'); }); }

  // Flights
  var fFrom = $('#fFrom'), fTo = $('#fTo'), fRet = $('#fRet'), trip = 'round';
  if (fFrom) {
    var opts = airports.map(function (a) { return '<option value="' + a[0] + '">' + a[1] + ' (' + a[0] + ')</option>'; }).join('');
    fFrom.innerHTML = opts; fTo.innerHTML = opts; fFrom.value = 'CJB'; fTo.value = 'DXB';
    $('#fDep').value = addDays(14); fRet.value = addDays(20); $('#fDep').min = addDays(0); fRet.min = addDays(0);
    $('#swap').addEventListener('click', function () { var x = fFrom.value; fFrom.value = fTo.value; fTo.value = x; });
    $$('[data-trip]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.trip === 'multi') { enquiry('Multi-city trip', [], { service: 'flight', trip_type: 'multi' }, { note: 'Tell us each leg in the box below - we send the best combination, often cheaper than separate tickets.' }); return; }
        trip = b.dataset.trip; pressed('trip', b); fRet.disabled = trip === 'oneway';
      });
    });
    $('#goFlights').addEventListener('click', function () {
      var from = A[fFrom.value], to = A[fTo.value], dep = $('#fDep').value, ret = trip === 'round' ? fRet.value : '';
      if (from.code === to.code) { alert('From and To are the same. Choose a different destination.'); return; }
      if (ret && dep && ret < dep) { alert('Return date is before departure. Please change the dates.'); return; }
      var px = $('#fPax').value.split('|'), intl = from.intl || to.intl;
      enquiry(from.city + ' → ' + to.city, [['Trip', trip === 'round' ? 'Round trip' : 'One way'], ['Depart', fmtDate(dep)], ['Return', fmtDate(ret)], ['Travellers', px[0] + ' · ' + px[1]]],
        { service: 'flight', from: from.city + ' (' + from.code + ')', to: to.city + ' (' + to.code + ')', trip_type: trip, depart_date: dep, return_date: ret, adults: +px[0], cabin: px[1], international: intl },
        { askPassport: true, note: 'We check live fares across all our airline partners (one-way, return and split tickets) and send the top options on WhatsApp in minutes.' + (intl ? ' International trip: passports must be valid until at least ' + fmtDate(plus6m(dep)) + '.' : '') });
    });
  }
  // Hotels
  var near = '';
  $$('[data-near]').forEach(function (b) { b.addEventListener('click', function () { var on = b.getAttribute('aria-pressed') !== 'true'; pressed('near', on ? b : null); near = on ? b.dataset.near : ''; }); });
  if ($('#hIn')) {
    $('#hIn').value = addDays(14); $('#hOut').value = addDays(17);
    $('#goHotels').addEventListener('click', function () {
      var city = $('#hCity').value.trim(), ci = $('#hIn').value, co = $('#hOut').value;
      if (!city) { alert('Please enter a city or area.'); $('#hCity').focus(); return; }
      if (co <= ci) { alert('Check-out must be after check-in.'); return; }
      enquiry('Hotels in ' + city, [['Check-in', fmtDate(ci)], ['Check-out', fmtDate(co)], ['Rooms', $('#hRooms').value], ['Category', $('#hStar').value], ['Stay near', near]],
        { service: 'hotel', to: city, depart_date: ci, return_date: co, hotel_category: $('#hStar').value, near: near, details: $('#hRooms').value },
        { note: 'Only well-rated hotels (guest rating and review count checked); new properties are marked clearly. We send 3-5 options with photos, ratings and nearby places.' });
    });
  }
  // Holidays tab -> holidays page with filter
  if ($('#goHolidays')) $('#goHolidays').addEventListener('click', function () {
    var st = ($('[data-style][aria-pressed="true"]') || {}).dataset; var dest = $('#pDest').value;
    location.href = 'holidays.html?style=' + encodeURIComponent((st && st.style) || 'All') + (dest ? '&dest=' + encodeURIComponent(dest) : '');
  });
  $$('[data-style]').forEach(function (b) { b.addEventListener('click', function () { pressed('style', b); if (document.body.dataset.page === 'holidays') renderPackages(); }); });
  // Visa
  var vC = $('#vCountry');
  if (vC) {
    vC.innerHTML = visas.map(function (v, i) { return '<option value="' + i + '">' + esc(v.c) + '</option>'; }).join('');
    $('#vDate').value = addDays(30);
    $('#goVisa').addEventListener('click', function () {
      var v = visas[+vC.value], dt = $('#vDate').value;
      var docs = '<ul class="ul">' + v.docs.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>';
      var note = 'Indicative checklist - we confirm the exact documents, fee and processing time for your case with the quote. Passport must be valid until at least <b>' + fmtDate(plus6m(dt)) + '</b>.' +
        (v.original ? '<br><br><b>This visa needs your original passport.</b> We collect it from you in person - our staff will call you to fix a convenient time. You get a WhatsApp receipt on pickup and updates until it is back with you.' : '');
      enquiry(v.c + ' visa', [['Travel date', fmtDate(dt)], ['Applicants', $('#vPax').value]], { service: 'visa', to: v.c, depart_date: dt, adults: +$('#vPax').value, international: true },
        { askPassport: true, note: 'Documents usually needed:' + docs + note, cta: 'Get visa quote on WhatsApp' });
    });
  }
  // Passport
  if ($('#goPassport')) $('#goPassport').addEventListener('click', function () {
    enquiry('Passport application', [['Service', $('#ppType').value], ['Scheme', $('#ppSpeed').value], ['Nearest office', $('#ppCity').value]],
      { service: 'passport', details: [$('#ppType').value, $('#ppSpeed').value, $('#ppCity').value].join(' · ') },
      { note: 'We fill the form with you on WhatsApp, you approve it, then we book the earliest appointment you choose. Government fee + our service fee are shown before you pay.', cta: 'Start on WhatsApp' });
  });
  // Groups
  if ($('#goGroups')) $('#goGroups').addEventListener('click', function () {
    enquiry('Group tour quote', [['Destination', $('#gDest').value], ['Group size', $('#gSize').value], ['Group', $('#gType').value], ['Month', $('#gMonth').value]],
      { service: 'group', to: $('#gDest').value, details: [$('#gSize').value, $('#gType').value, $('#gMonth').value].join(' · ') },
      { note: 'Group fares, Indian meals and one coordinator for everyone.', cta: 'Get group quote' });
  });

  /* ---------- holiday packages (from CRM itinerary templates) ---------- */
  var PACKS = null;
  function loadPackages() {
    if (PACKS) return Promise.resolve(PACKS);
    var fallback = window.WV_PACKAGES || [];
    if (!API) return Promise.resolve(PACKS = fallback);
    return api('/api/public/packages').then(function (p) { return (PACKS = p.length ? p : fallback); }).catch(function () { return (PACKS = fallback); });
  }
  function card(p) {
    return '<a class="pkg" href="package.html?slug=' + encodeURIComponent(p.slug) + '"><div class="hero" style="background:linear-gradient(150deg,' + esc(p.color || '#006E99') + ',#00405C)">' +
      '<span class="code">' + esc((p.destination || '').toUpperCase()) + (p.international ? ' · INTERNATIONAL' : '') + '</span><h3>' + esc(p.name) + '</h3></div>' +
      '<div class="body"><div><span class="pill">' + p.nights + 'N / ' + (p.nights + 1) + 'D</span> ' + (p.styles || []).map(function (s) { return '<span class="pill">' + esc(s) + '</span>'; }).join(' ') + '</div><p>' + esc(p.summary || '') + '</p></div>' +
      '<div class="foot"><div class="price">' + (p.from_price ? '<small>' + (LANG === 'ta' ? T.ta.from : 'From') + '</small><b>' + rupees(p.from_price) + '</b><small>' + (LANG === 'ta' ? T.ta.pp : 'per person') + '</small>' : '<small>Price on request</small>') + '</div><span class="btn btn-ghost btn-sm">View</span></div></a>';
  }
  function renderPackages() {
    var grid = $('#packGrid'); if (!grid) return;
    loadPackages().then(function (list) {
      var limit = +grid.dataset.limit || 0, q = new URLSearchParams(location.search);
      var stBtn = $('[data-style][aria-pressed="true"]'), style = stBtn ? stBtn.dataset.style : (q.get('style') || 'All'), dest = q.get('dest') || '';
      var l = list.filter(function (p) { return (style === 'All' || (p.styles || []).indexOf(style) >= 0) && (!dest || p.destination === dest || p.country === dest); });
      if (limit) l = l.slice(0, limit);
      grid.innerHTML = l.length ? l.map(card).join('') : '<p class="fine">No packages in this style yet - <a data-wa="Hi, I want a custom holiday package">ask us for a custom plan</a>.</p>';
      fillContact();
      var dSel = $('#pDest');
      if (dSel && dSel.options.length <= 1) list.forEach(function (p) { var o = document.createElement('option'); o.value = p.destination; o.textContent = p.destination; dSel.appendChild(o); });
    });
  }
  var qs = new URLSearchParams(location.search);
  if (qs.get('style')) { var sb = $('[data-style="' + qs.get('style') + '"]'); if (sb) pressed('style', sb); }
  renderPackages();

  // Package detail page
  var pkgRoot = $('#pkgRoot');
  if (pkgRoot) {
    var slug = qs.get('slug');
    loadPackages().then(function (list) {
      var p = list.filter(function (x) { return x.slug === slug; })[0];
      if (!p && API) return api('/api/public/packages/' + encodeURIComponent(slug)).catch(function () { return null; });
      return p;
    }).then(function (p) {
      if (!p) { pkgRoot.innerHTML = '<div class="card"><h2>Package not found</h2><p class="fine" style="margin-top:8px"><a href="holidays.html">See all holiday packages</a></p></div>'; return; }
      document.title = p.name + ' · ' + p.nights + 'N/' + (p.nights + 1) + 'D holiday from Coimbatore | Wonderful Vacations';
      var md = $('meta[name=description]'); if (md) md.setAttribute('content', p.summary || '');
      $('#pageTitle').textContent = p.name; $('#pageSub').textContent = p.nights + ' nights / ' + (p.nights + 1) + ' days · ' + p.destination + (p.country && p.country !== p.destination ? ', ' + p.country : '');
      var lines = function (t) { return t ? '<ul class="ul">' + String(t).split(/\n+/).filter(Boolean).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '<p class="fine">On request</p>'; };
      pkgRoot.innerHTML = '<div class="two"><div>' + (p.summary ? '<p style="font-size:1.0625rem;margin-bottom:16px">' + esc(p.summary) + '</p>' : '') +
        '<h2 style="font-size:1.25rem;margin-bottom:10px">Day-wise plan</h2><ol class="days">' + (p.day_plan || []).map(function (d, i) { return '<li><span class="d">DAY ' + (i + 1) + '</span><div><b>' + esc(d.title) + '</b><p class="fine" style="font-size:.9rem">' + esc(d.details) + '</p></div></li>'; }).join('') + '</ol>' +
        '<div class="two" style="grid-template-columns:1fr 1fr;margin-top:18px"><div class="card"><h3>Inclusions</h3>' + lines(p.inclusions) + '</div><div class="card"><h3>Exclusions</h3>' + lines(p.exclusions) + '</div></div>' +
        (p.hotels ? '<div class="card" style="margin-top:14px"><h3>Hotels</h3>' + lines(p.hotels) + '</div>' : '') + '</div>' +
        '<aside class="card" style="position:sticky;top:16px;display:grid;gap:12px"><div class="price">' + (p.from_price ? '<small>From</small><b style="font-size:1.6rem">' + rupees(p.from_price) + '</b><small>per person · final price depends on dates and hotels</small>' : '<small>Price on request</small>') + '</div>' +
        '<button class="btn btn-primary" type="button" id="pkgEnq">Enquire / get quote</button><a class="btn btn-wa" data-wa="' + esc('Hi, I am interested in the ' + p.name + ' package (' + p.nights + 'N). Please send a quote.') + '">Get quote on WhatsApp</a>' +
        '<p class="fine">Every package can be changed: dates, hotels, days. ' + (p.international ? 'Passport must be valid 6 months from travel.' : '') + '</p></aside></div>';
      fillContact();
      $('#pkgEnq').addEventListener('click', function () {
        enquiry(p.name, [['Duration', p.nights + 'N / ' + (p.nights + 1) + 'D'], ['From', p.from_price ? rupees(p.from_price) + ' pp' : '']],
          { service: 'package', to: p.destination, international: p.international, option: p.name + ' (' + p.slug + ')' },
          { askPassport: false, note: 'Tell us your travel month and number of travellers - we send a customised day-wise itinerary with the final price.' });
      });
    });
  }

  /* ---------- my trip ---------- */
  var tripForm = $('#tripForm');
  if (tripForm) tripForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var out = $('#tripOut'), ref = $('#mBook').value.trim(), mob = $('#mMob').value.trim();
    if (!ref || mob.replace(/\D/g, '').length < 10) { out.innerHTML = '<div class="msg bad">Enter your booking number (or PNR) and the 10-digit mobile used for booking.</div>'; return; }
    out.innerHTML = '<p class="fine">Checking...</p>';
    api('/api/public/mytrip', { ref: ref, mobile: mob }).then(function (b) {
      out.innerHTML = '<div class="card" style="display:grid;gap:10px"><h3>' + esc(b.ref) + ' · ' + esc(b.title || b.destination || '') + '</h3><div class="sum">' +
        [['Status', b.status], ['Travel', fmtDate(b.travel_start) + (b.travel_end ? ' – ' + fmtDate(b.travel_end) : '')], ['PNR', b.pnr], ['Total', rupees(b.total)], ['Paid', rupees(b.paid)], ['Balance', b.balance > 0 ? rupees(b.balance) : 'No dues']]
          .filter(function (r) { return r[1]; }).map(function (r) { return '<div><span>' + r[0] + '</span><b>' + esc(r[1]) + '</b></div>'; }).join('') + '</div>' +
        (b.invoices && b.invoices.length ? '<div>' + b.invoices.map(function (i) { return '<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="' + esc(i.url) + '">' + (i.type === 'credit_note' ? 'Credit note ' : 'GST invoice ') + esc(i.number) + '</a>'; }).join(' ') + '</div>' : '') +
        '<p class="fine">Tickets and vouchers are sent on WhatsApp. Need changes or cancellation? Message us from the booking mobile number.</p></div>';
    }).catch(function (err) { out.innerHTML = '<div class="msg bad">' + esc(err.status === 404 ? 'No booking found for this number and mobile.' : 'Could not check right now - please WhatsApp us.') + '</div>'; });
  });

  /* ---------- general contact form ---------- */
  var cf = $('#contactForm');
  if (cf) cf.innerHTML = contactFields('<div class="inp"><label for="cSvc">I need help with</label><select id="cSvc" name="service"><option value="flight">Flights</option><option value="hotel">Hotels</option><option value="package">Holiday package</option><option value="visa">Visa</option><option value="passport">Passport</option><option value="group">Group / corporate tour</option><option value="other">Something else</option></select></div><div class="inp"><label for="cMsg">Message</label><textarea id="cMsg" name="details" required></textarea></div>', 'c') + '<div id="cfMsg" role="status"></div><button class="btn btn-primary" type="submit">Send enquiry</button>';
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(cf), d = {}; fd.forEach(function (v, k) { d[k] = v; }); d.consent = !!cf.consent.checked; d.language = LANG; d.page = location.pathname;
    var m = $('#cfMsg');
    if (!d.name || String(d.mobile).replace(/\D/g, '').length < 10 || !d.consent) { m.className = 'msg bad'; m.textContent = 'Please fill name, mobile and tick the consent box.'; return; }
    var btn = cf.querySelector('button[type=submit]'); btn.disabled = true;
    api('/api/public/enquiry', d).then(function (r) { cf.innerHTML = '<div class="msg good"><b>Thank you!</b> Reference <span class="code">' + esc(r.ref) + '</span>. We will reply on WhatsApp shortly.</div>'; })
      .catch(function () { btn.disabled = false; m.className = 'msg warn'; m.innerHTML = 'Could not send right now. Please <a href="' + esc(wa(d.details)) + '" target="_blank" rel="noopener">WhatsApp us</a>.'; });
  });

  applyLang();
})();
