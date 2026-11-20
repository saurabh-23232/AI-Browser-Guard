(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- mobile menu ---------- */
  const burger = $('#burger');
  const links = $('#links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', (e) => {
      if (e.target instanceof HTMLAnchorElement) {
        links.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }
  const yr = $('#year');
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ---------- reveal on scroll + count-up ---------- */
  const revealTargets = $$('.stat,.card,.f,.flow li,.steps3 article,.case,details,.compare,.honest-box,.cta-box,.callout,.dec,.try-in,.try-out');
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
  });
  const countUp = (el) => {
    const to = Number(el.dataset.to || 0);
    const pre = el.dataset.pre || '';
    const suf = el.dataset.suf || '';
    if (reduce) { el.textContent = `${pre}${to}${suf}`; return; }
    const t0 = performance.now();
    const dur = 1400;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = `${pre}${Math.round(to * e)}${suf}`;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      $$('.count', en.target).forEach(countUp);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  revealTargets.forEach((el) => io.observe(el));

  /* ---------- leak simulation ---------- */
  const demo = $('#demo');
  if (demo) {
    const stage = $('#stage');
    const promptEl = $('#prompt');
    const sendBtn = $('#send');
    const sw = $('#guardSwitch');
    const shield = $('.shield', stage);
    const cloud = $('#nodeCloud');
    const cloudSub = $('#cloudSub');
    const threat = $('#nodeThreat');
    const gateState = $('#gateState');
    const packets = $('#packets');
    const toast = $('#toast');
    const mLeaked = $('#mLeaked');
    const mBlocked = $('#mBlocked');
    const userNode = $('#nodeUser');
    const gateNode = $('#nodeGate');

    const SEGMENTS = [
      { t: 'Our login keeps failing. Fix this config:\n' },
      { t: 'DB_PASSWORD=Sup3rS3cret!x9', s: true, label: 'Password', pol: 'credentials' },
      { t: '\n' },
      { t: 'AWS_KEY=AKIAIOSFODNN7EXAMPLE', s: true, label: 'AWS key', pol: 'credentials' },
      { t: '\nCustomer: ' },
      { t: 'priya@acme-client.com', s: true, label: 'Customer email', pol: 'customer data' },
    ];
    const ITEMS = SEGMENTS.filter((s) => s.s);

    let guard = false;
    let auto = true;
    let token = 0;
    let leaked = 0;
    let blocked = 0;
    let visible = true;

    const setGuard = (on) => {
      guard = on;
      demo.dataset.guard = on ? 'on' : 'off';
      sw.setAttribute('aria-checked', String(on));
      gateState.textContent = on ? 'Guard on' : 'Guard off';
      cloudSub.textContent = on ? 'Nothing sensitive arrives' : 'Prompts may be stored & used';
    };
    const showToast = (msg, kind) => {
      toast.textContent = msg;
      toast.className = `toast ${kind} show`;
    };
    const hideToast = () => { toast.className = 'toast'; };
    const render = (upTo) => {
      promptEl.textContent = '';
      let left = upTo;
      for (const seg of SEGMENTS) {
        if (left <= 0) break;
        const part = seg.t.slice(0, left);
        left -= part.length;
        if (seg.s) {
          const sp = document.createElement('span');
          sp.className = 's';
          sp.textContent = part;
          promptEl.appendChild(sp);
        } else {
          promptEl.appendChild(document.createTextNode(part));
        }
      }
    };
    const total = SEGMENTS.reduce((n, s) => n + s.t.length, 0);
    const center = (el) => {
      const a = el.getBoundingClientRect();
      const b = stage.getBoundingClientRect();
      return { x: a.left - b.left + a.width / 2, y: a.top - b.top + a.height / 2 };
    };
    const fly = (label, from, to, ms, cls) => {
      const el = document.createElement('div');
      el.className = `pk ${cls || ''}`;
      el.textContent = label;
      packets.appendChild(el);
      const w = el.offsetWidth / 2;
      const h = el.offsetHeight / 2;
      const anim = el.animate([
        { transform: `translate(${from.x - w}px, ${from.y - h}px) scale(.6)`, opacity: 0 },
        { transform: `translate(${from.x - w + (to.x - from.x) * 0.12}px, ${from.y - h + (to.y - from.y) * 0.12}px) scale(1)`, opacity: 1, offset: 0.12 },
        { transform: `translate(${to.x - w}px, ${to.y - h}px) scale(1)`, opacity: 1 },
      ], { duration: ms, easing: 'cubic-bezier(.5,.05,.4,1)', fill: 'forwards' });
      return anim.finished.then(() => el).catch(() => el);
    };
    const burst = (at) => {
      for (let i = 0; i < 14; i++) {
        const sh = document.createElement('div');
        sh.className = 'shard';
        packets.appendChild(sh);
        const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
        const d = 40 + Math.random() * 46;
        sh.animate([
          { transform: `translate(${at.x}px, ${at.y}px) scale(1)`, opacity: 1 },
          { transform: `translate(${at.x + Math.cos(ang) * d}px, ${at.y + Math.sin(ang) * d}px) scale(.2)`, opacity: 0 },
        ], { duration: 650, easing: 'ease-out', fill: 'forwards' }).finished.then(() => sh.remove()).catch(() => sh.remove());
      }
    };
    const clearStage = () => {
      packets.textContent = '';
      cloud.classList.remove('leaked');
      threat.classList.remove('on');
      hideToast();
    };
    const waitVisible = async (my) => { while (!visible && my === token) await sleep(400); };

    const staticState = () => {
      clearStage();
      render(total);
      if (guard) {
        gateState.textContent = 'Blocked';
        showToast('Blocked: credentials never left the browser', 'good');
        mLeaked.textContent = '0';
        mBlocked.textContent = String(ITEMS.length);
      } else {
        cloud.classList.add('leaked');
        threat.classList.add('on');
        showToast('Leaked: the model now holds the password, key and customer email', 'bad');
        mLeaked.textContent = String(ITEMS.length);
        mBlocked.textContent = '0';
      }
    };

    const cycle = async (my) => {
      clearStage();
      setGuard(guard);
      render(0);
      sendBtn.classList.remove('press');
      // type
      for (let i = 1; i <= total; i++) {
        if (my !== token) return;
        render(i);
        await sleep(i < 12 ? 40 : 22);
      }
      await sleep(550);
      if (my !== token) return;
      await waitVisible(my);
      sendBtn.classList.add('press');
      setTimeout(() => sendBtn.classList.remove('press'), 220);

      const start = center(userNode);
      const gate = center(shield);
      const cloudAt = center($('svg', cloud));
      const threatAt = center(threat);

      if (!guard) {
        const arrivals = ITEMS.map(async (it, i) => {
          await sleep(i * 260);
          if (my !== token) return;
          const short = it.t.length > 22 ? `${it.t.slice(0, 20)}…` : it.t;
          await fly(short, start, cloudAt, 1200);
          if (my !== token) return;
          leaked += 1;
          mLeaked.textContent = String(leaked);
          cloud.classList.add('leaked');
          showToast(`${it.label} sent to a third party`, 'bad');
        });
        await Promise.all(arrivals);
        if (my !== token) return;
        await sleep(500);
        threat.classList.add('on');
        const flights = ITEMS.map(async (it, i) => {
          await sleep(i * 160);
          if (my !== token) return;
          await fly('stolen', cloudAt, threatAt, 900, 'red2');
        });
        await Promise.all(flights);
        showToast('Leaked: the password, the key and customer data are now outside your control', 'bad');
        await sleep(2800);
        if (my !== token) return;
        if (auto) { setGuard(true); auto = false; }
        return cycle(my);
      }

      // guard on
      const flights = ITEMS.map(async (it, i) => {
        await sleep(i * 260);
        if (my !== token) return;
        const short = it.t.length > 22 ? `${it.t.slice(0, 20)}…` : it.t;
        const el = await fly(short, start, gate, 800);
        if (my !== token) return;
        el.remove();
        burst(gate);
        shield.classList.remove('hit');
        void shield.getBoundingClientRect();
        shield.classList.add('hit');
        blocked += 1;
        mBlocked.textContent = String(blocked);
        gateState.textContent = 'Blocked';
        showToast(`Blocked: ${it.label.toLowerCase()} (${it.pol}) stopped in the browser`, 'good');
      });
      await Promise.all(flights);
      if (my !== token) return;
      await sleep(400);
      showToast('Prompt held. Nothing sensitive reached the AI model, and the attempt is in the audit log', 'good');
      await sleep(3200);
      if (my !== token) return;
      gateState.textContent = 'Guard on';
      return cycle(my);
    };

    const restart = () => {
      token += 1;
      if (reduce) { setGuard(guard); staticState(); return; }
      cycle(token);
    };

    sw.addEventListener('click', () => {
      auto = false;
      setGuard(!guard);
      restart();
    });

    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0.2 }).observe(demo);

    setGuard(false);
    if (reduce) {
      auto = false;
      staticState();
    } else {
      render(0);
      // start once the demo is on screen
      const starter = new IntersectionObserver((en) => {
        if (en[0].isIntersecting) { starter.disconnect(); restart(); }
      }, { threshold: 0.25 });
      starter.observe(demo);
    }
    window.addEventListener('resize', () => { if (!reduce) { clearStage(); } });
  }

  /* ---------- detector ---------- */
  const tryText = $('#tryText');
  if (tryText) {
    const verdict = $('#verdict');
    const vTitle = $('#vTitle');
    const vSub = $('#vSub');
    const marked = $('#marked');
    const found = $('#found');

    const luhn = (digits) => {
      let sum = 0;
      let alt = false;
      for (let i = digits.length - 1; i >= 0; i--) {
        let n = digits.charCodeAt(i) - 48;
        if (alt) { n *= 2; if (n > 9) n -= 9; }
        sum += n;
        alt = !alt;
      }
      return sum % 10 === 0;
    };
    const RULES = [
      { label: 'Private key', level: 'block', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
      { label: 'AWS access key', level: 'block', re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
      { label: 'GitHub token', level: 'block', re: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/g },
      { label: 'API key', level: 'block', re: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
      { label: 'Connection string', level: 'block', re: /\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/[^\s:@/]+:[^\s@]+@\S+/gi },
      { label: 'Password / secret', level: 'block', re: /[A-Za-z_]*(?:pass(?:word)?|pwd|secret|token)[A-Za-z_]*\s*[:=]\s*[^\s,;]{4,}/gi },
      { label: 'Internal IP address', level: 'auth', re: /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/g },
      { label: 'Internal hostname', level: 'auth', re: /\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:internal|corp|local|lan|intranet)\b/gi },
      { label: 'Confidential marker', level: 'warn', re: /\b(?:confidential|internal use only|do not share|proprietary)\b/gi },
      { label: 'Payment card', level: 'flag', re: /\b(?:\d[ -]?){13,19}\b/g, ok: (m) => luhn(m.replace(/\D/g, '')) && m.replace(/\D/g, '').length >= 13 },
      { label: 'PAN (India)', level: 'flag', re: /\b[A-Z]{5}\d{4}[A-Z]\b/g },
      { label: 'Email address', level: 'flag', re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
    ];
    const RANK = { block: 4, auth: 3, warn: 2, flag: 1 };
    const VERDICT = {
      block: ['BLOCKED', 'Credentials and secrets are hard-blocked. No password can override this.'],
      auth: ['REQUIRES AUTHORIZATION', 'Internal infrastructure details need the company password, once.'],
      warn: ['WARNING', 'Confidential-marked content asks the employee to confirm before sending.'],
      flag: ['FLAGGED', 'Detected and added to the risk score. Your policy decides the action.'],
      ok: ['ALLOWED', 'No sensitive data found. The prompt goes through.'],
    };
    const MARK_CLASS = { block: '', auth: 'm-auth', warn: 'm-warn', flag: 'm-flag' };

    const scan = (text) => {
      const hits = [];
      for (const r of RULES) {
        r.re.lastIndex = 0;
        let m;
        while ((m = r.re.exec(text)) !== null) {
          if (m[0].length === 0) { r.re.lastIndex++; continue; }
          if (r.ok && !r.ok(m[0])) continue;
          hits.push({ s: m.index, e: m.index + m[0].length, level: r.level, label: r.label });
        }
      }
      hits.sort((a, b) => a.s - b.s || RANK[b.level] - RANK[a.level]);
      const out = [];
      for (const h of hits) {
        const last = out[out.length - 1];
        if (last && h.s < last.e) {
          if (RANK[h.level] > RANK[last.level] && h.s <= last.s) out[out.length - 1] = h;
          continue;
        }
        out.push(h);
      }
      return out;
    };

    const update = () => {
      const text = tryText.value;
      marked.textContent = '';
      found.textContent = '';
      if (!text.trim()) {
        verdict.dataset.level = 'none';
        vTitle.textContent = 'Waiting for input';
        vSub.textContent = 'Type something to scan it.';
        return;
      }
      const hits = scan(text);
      let pos = 0;
      for (const h of hits) {
        if (h.s > pos) marked.appendChild(document.createTextNode(text.slice(pos, h.s)));
        const mk = document.createElement('mark');
        if (MARK_CLASS[h.level]) mk.className = MARK_CLASS[h.level];
        mk.textContent = text.slice(h.s, h.e);
        mk.title = h.label;
        marked.appendChild(mk);
        pos = h.e;
      }
      if (pos < text.length) marked.appendChild(document.createTextNode(text.slice(pos)));

      let top = 'ok';
      const counts = new Map();
      for (const h of hits) {
        if (top === 'ok' || RANK[h.level] > RANK[top]) top = h.level;
        counts.set(h.label, (counts.get(h.label) || 0) + 1);
      }
      verdict.dataset.level = top;
      vTitle.textContent = VERDICT[top][0];
      vSub.textContent = VERDICT[top][1];
      counts.forEach((n, label) => {
        const li = document.createElement('li');
        const a = document.createElement('span');
        a.textContent = label;
        const b = document.createElement('b');
        b.textContent = `×${n}`;
        li.append(a, b);
        found.appendChild(li);
      });
    };
    tryText.addEventListener('input', update);
    $('#sampleBad').addEventListener('click', () => {
      tryText.value = 'Hi, please debug this deploy script.\nDATABASE_URL=postgres://admin:Sup3rS3cret!x9@db.corp.local:5432/prod\nAWS_KEY=AKIAIOSFODNN7EXAMPLE\nServer 10.2.4.17 is failing. Customer priya@acme-client.com is waiting. CONFIDENTIAL.';
      update();
    });
    $('#sampleOk').addEventListener('click', () => {
      tryText.value = 'Explain how a binary search works and write a short example in Python.';
      update();
    });
    $('#clearTry').addEventListener('click', () => { tryText.value = ''; update(); tryText.focus(); });
    update();
  }
})();
