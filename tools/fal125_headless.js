'use strict';
/* fal125_headless.js
   Shared loader for the FAL-125 tools. It reads your game's HTML file, pulls out the main game script, and runs the
   REAL game code inside Node with a fake browser (every DOM call is swallowed). Nothing in your HTML file is changed.
   No npm packages needed. Node 18+ is fine. */
const fs = require('fs'), path = require('path'), vm = require('vm');

function findHtml(arg) {
  if (arg) { if (!fs.existsSync(arg)) throw new Error('Cannot find ' + arg); return arg; }
  const here = [process.cwd(), __dirname];
  for (const d of here) {
    const c = fs.readdirSync(d).filter(f => /^fal125.*\.html$/i.test(f))
      .map(f => ({ f: path.join(d, f), t: fs.statSync(path.join(d, f)).mtimeMs })).sort((a, b) => b.t - a.t);
    if (c.length) return c[0].f;
  }
  throw new Error('No fal125*.html found next to this script. Pass the path with --html "path/to/game.html"');
}

function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* A "do-anything" stand-in for any browser object. Reads give back another stand-in, calls return one, writes are remembered. */
function stub() {
  const store = Object.create(null);
  const p = new Proxy(function () {}, {
    get(t, k) {
      if (k === 'then') return undefined;
      if (k === Symbol.toPrimitive) return () => '';
      if (k === Symbol.iterator) return function* () {};
      if (k in store) return store[k];
      if (k === 'length') return 0;
      if (k === 'textContent' || k === 'innerHTML' || k === 'value' || k === 'className' || k === 'id' || k === 'innerText' || k === 'src') return '';
      if (k === 'dataset' || k === 'style' || k === 'classList') return (store[k] = stub());
      if (k === 'matches' || k === 'hidden') return false;
      return p;
    },
    set(t, k, v) { store[k] = v; return true; },
    apply() { return p; }, construct() { return p; }, has() { return true; }
  });
  return p;
}

function load(opts = {}) {
  const htmlPath = findHtml(opts.html);
  const html = fs.readFileSync(htmlPath, 'utf8');
  const blocks = []; const re = /<script>([\s\S]*?)<\/script>/g; let m;
  while ((m = re.exec(html))) blocks.push(m[1]);
  const src = blocks.sort((a, b) => b.length - a.length)[0];
  if (!src || src.length < 100000) throw new Error('Could not find the main game script in ' + htmlPath);

  const rng = mulberry(opts.seed == null ? 12345 : opts.seed);
  const M = Object.create(Math); M.random = () => rng();
  const ls = new Map(); const timers = []; let now = 0, seq = 0;
  const sb = {
    console: { log() {}, warn() {}, error() {}, info() {}, table() {} },
    Math: M, Date, JSON, Promise, Object, Array, String, Number, Boolean, Symbol, Map, Set, WeakMap, WeakSet, Error, RegExp, parseInt, parseFloat, isNaN, isFinite,
    Infinity, NaN, undefined, encodeURIComponent, decodeURIComponent, escape, unescape, Uint8Array, Float32Array, Int32Array, ArrayBuffer,
    btoa: s => Buffer.from(s, 'binary').toString('base64'), atob: s => Buffer.from(s, 'base64').toString('binary')
  };
  sb.document = stub();
  sb.localStorage = { getItem: k => ls.has(k) ? ls.get(k) : null, setItem: (k, v) => { ls.set(k, String(v)); }, removeItem: k => { ls.delete(k); }, key: i => [...ls.keys()][i], get length() { return ls.size; } };
  sb.innerWidth = 1280; sb.innerHeight = 800; sb.devicePixelRatio = 1; sb.scrollX = 0; sb.scrollY = 0;
  sb.window = sb; sb.globalThis = sb; sb.self = sb;
  sb.setTimeout = (f, ms = 0, ...a) => { timers.push({ t: now + (+ms || 0), id: ++seq, f, a }); return seq; };
  sb.clearTimeout = id => { const i = timers.findIndex(x => x.id === id); if (i >= 0) timers.splice(i, 1); };
  sb.setInterval = () => 0; sb.clearInterval = () => {}; sb.requestAnimationFrame = f => sb.setTimeout(() => f(now), 16); sb.cancelAnimationFrame = () => {};
  sb.addEventListener = () => {}; sb.removeEventListener = () => {};
  sb.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  sb.navigator = { userAgent: 'node', vibrate() {}, clipboard: stub() }; sb.location = { reload() {}, href: '', search: '', hash: '' };
  sb.alert = () => {}; sb.confirm = () => true; sb.prompt = () => null; sb.performance = { now: () => now };
  sb.fetch = () => Promise.reject(new Error('no network in the simulator'));
  sb.getComputedStyle = () => stub();
  ['Audio', 'AudioContext', 'webkitAudioContext', 'Image', 'MutationObserver', 'ResizeObserver', 'IntersectionObserver', 'Element', 'HTMLElement', 'Blob', 'FileReader', 'URL', 'XMLHttpRequest', 'Worker', 'CustomEvent', 'Event']
    .forEach(n => { sb[n] = function () { return stub(); }; });
  sb.URL.createObjectURL = () => ''; sb.URL.revokeObjectURL = () => {};
  sb.__STYLE = process.env.FAL_STYLE || ''; vm.createContext(sb);

  const epilogue = `
;globalThis.__SIM = {
  CHARACTERS, CHIPS, CHIP, CARDS, SKILLS, WORLD_DATA, ENEMIES, get WAVES(){ return WAVES; },
  get BM(){ return typeof BM_API !== 'undefined' ? BM_API : null; }, get PARTY(){ return party; }, get PBYTE(){ return typeof PBYTE !== 'undefined' ? PBYTE : null; }, get SECRETS(){ return typeof SECRETS !== 'undefined' ? SECRETS : null; }, get SAVE(){ return SAVE; },
  get RUN(){ return RUN; }, get waiting(){ return !!resolveChoice; }, get cur(){ return cur ? cur.name + ' ' + cur.hp + '/' + cur.maxHp + ' alive=' + cur.alive + ' team=' + cur.team : null; }, get foes(){ return foes; }, get round(){ return round; }, get wave(){ return wave; }, get party(){ return party; }, CFG, SAVE,
  NEBQ, get NEB(){ return NEB; },
  STT: typeof STYLE_TUNE !== 'undefined' ? STYLE_TUNE : null,
  RXT:{ makeUnit, addStatus, hit, say, setSides:(p,f)=>{ party=p; foes=f; }, SKILLS, RXN:(typeof RXN!=='undefined'?RXN:null), setCur:u=>{ cur=u; }, setFx:f=>{ curFx=f; }, damage:(u,d,k)=>damage(u,d,k), kill:(u,m)=>kill(u,m), takeTurn:u=>takeTurn(u), CF:COUNTER_FIELDS, setRound:r=>{ round=r; } },
  async neb(side, stopAt) { Object.assign(CFG, { auto:true, routes:false, draft:false, unlockAll:true, pace:1, diff:'Normal' }); NEBQ.testStop = stopAt || 0; SAVE.xp = {}; return nebRun(side); },
  async incident(id, keys) { Object.assign(CFG, { auto:true, routes:false, draft:false, unlockAll:true, pace:1, diff:'Normal' }); ENEMY_DAMAGE = DIFFS.Normal || 1.5; SAVE.xp = {}; SAVE.graveyard = []; picked = new Set(keys); return incidentRun(INCIDENTS.find(i => i.id === id)); },
  MAST:{ info:mastInfo, lv:mastLv, lvReal:mastLvReal, award:mastAward, rec:mastRec, XP:MAST_XP, TEXT:MAST_TEXT, sig:mastSig, items:mastItems }, SAVE_:() => SAVE,
  INCIDENTS, INC_TYPES, CHARACTERS_BY: k => CHARACTERS.find(c => c.key === k),
  async confront(k) { Object.assign(CFG, { auto:true, routes:false, draft:false, unlockAll:true, pace:1, diff:'Normal' }); ENEMY_DAMAGE = DIFFS.Normal || 1.5; SAVE.xp = {}; return confrontRun(k); },
  async runOnce(keys, o) {
    Object.assign(CFG, { world:o.world, runlen:o.runlen, diff:o.diff, auto:true, routes:false, draft:false, unlockAll:true, pace:1 });
    ENEMY_DAMAGE = (DIFFS[CFG.diff] || 1.5) * (o.story && CFG.diff === 'Normal' ? STORY_EASE : 1);   /* v193: o.story applies the real Story-mode Normal ease (enemy damage x0.9) */
    SAVE.xp = {}; keys.forEach(k => { SAVE.xp[k] = (o.xpMap && o.xpMap[k]) || o.xp || 0; });
    CFG.autoStyle = o.smart ? 'smart' : 'classic';   /* v180: the smart autopilot now lives in the game (Settings > Auto-play style) */
    SAVE.graveyard = []; picked = new Set(keys);
    RUN = newRun(); try { RUN.heat = heatLevel(); } catch (e) {} RUN.daily = null; RUN.style = __STYLE;
    rollRun();
    party = CHARACTERS.filter(c => picked.has(c.key)).map(c => makeUnit(c, 'party'));
    applyVariants(); applyMeta();
    if (o.pbEq && typeof applyPBytes === 'function') { const pb = pbS(); pb.own = {}; pb.eq = {}; Object.keys(o.pbEq).forEach(k => { pb.eq[k] = o.pbEq[k]; o.pbEq[k].forEach(id => { pb.own[id] = 1; }); }); applyPBytes(); }   /* v206: equip permanent Bytes for balance tests, o.pbEq = { fighterKey: [byteIds] } */
    buildSide('#partySide', party);
    (o.chips || []).forEach(id => installChip(id));
    if (o.bm && typeof BM_API !== 'undefined') o.bm.forEach(g => { const a = String(g).split('@'); BM_API.grant(a[0], a[1]); });   /* v222: Black Market items/grafts/artifacts by id (graft target: id@fighterKey) */
    wave = 0;
    window.__lab = o.god ? { god:true } : null; window.__labWave = o.wave > 1 ? o.wave : 0;   /* v195: start at any wave, optional God mode */
    if (o.foes && o.foes.length) WAVES[Math.max(0, (o.wave || 1) - 1)] = o.foes.slice(0, 5);   /* v195: force the start wave's enemies */
    window.labWaveHook = o.ohk ? () => { foes.forEach(f => { if (f.alive) f.hp = 1; }); } : null;
    return playRun();
  }
};
`;
  vm.runInContext(src + epilogue, sb, { filename: 'game.js' });
  const G = sb.__SIM;

  /* ---- replace every screen that waits for a human with an automatic answer ---- */
  let result = null;
  sb.showEnd = win => { result = { win: !!win }; };
  sb.evtAsk = (t, p, ch) => Promise.resolve(ch && ch.length ? Math.floor(M.random() * ch.length) : 0);
  sb.openShop = () => Promise.resolve();
  sb.openBlackMarket = () => Promise.resolve();   /* v222 */
  sb.pickReward = () => new Promise(res => {
    const D = G.CFG.diff; const cards = G.CARDS; const avail = cards.filter(f => { try { return !G.RUN.taken.includes((f._peekName = f._peekName || f().name)); } catch (e) { return true; } });
    const c = (avail.length ? avail : cards)[Math.floor(M.random() * (avail.length || cards.length))]();
    try { c.run(); G.RUN.taken.push(c.name); } catch (e) {}
    res();
  });
  ['storyScene', 'trophyPick', 'allyEncounter', 'casinoFloor', 'routeFork', 'routePost', 'routeMini', 'bossTalk', 'wandererOffer', 'sideChoice', 'loreUnlock', 'archiveLore',
   'epiBefore', 'epiAfter', 'epiEnd', 'secretEnding', 'brBoon', 'endBossRewards', 'apexReward', 'dreadPick', 'runEvent', 'tryBanter', 'runDraft']
    .forEach(n => { if (typeof sb[n] === 'function') { (sb.__orig = sb.__orig || {})[n] = sb[n]; sb[n] = () => Promise.resolve(null); } });   /* the real ones stay reachable as sb.__orig.name for tests */

  const flush = () => new Promise(r => setImmediate(r));
  /* Runs the game's fake clock until the promise settles. Returns {value} or {stuck:true}. */
  async function drive(promise, maxTurns = 400000, maxRounds = 150) {
    let done = false, value, err;
    promise.then(v => { done = true; value = v; }, e => { done = true; err = e; });
    let idle = 0;
    for (let i = 0; i < maxTurns; i++) {
      await flush();
      if (done) break;
      if ((i & 255) === 0 && G.round > maxRounds) return { stalemate: true };
      if (!timers.length) { if (++idle > 5) return { stuck: true }; continue; }
      idle = 0;
      let bi = 0; for (let j = 1; j < timers.length; j++) if (timers[j].t < timers[bi].t || (timers[j].t === timers[bi].t && timers[j].id < timers[bi].id)) bi = j;
      const tm = timers.splice(bi, 1)[0]; now = Math.max(now, tm.t);
      try { tm.f(...tm.a); } catch (e) {}
    }
    if (!done) return { stuck: true, runaway: true };
    if (err) return { error: err };
    return { value };
  }
  function reseed(seed) { const r = mulberry(seed); M.random = () => r(); }

  async function run(keys, o) {
    result = null; timers.length = 0; now = 0;
    if (o.neb) { const q = await drive(G.neb(keys[0], o.turns), 4000000, 100000); return { ok:!q.stuck && !q.error && !q.stalemate, stuck:!!q.stuck, stalemate:!!q.stalemate, error:q.error ? String(q.error && q.error.stack || q.error).split('\n').slice(0, 3).join(' | ') : null, result:q.value }; }   /* v181: Never Ending Battle */
    if (o.incident) { const q = await drive(G.incident(o.incident, keys), 400000, o.maxRounds || 150); return { ok:!q.stuck && !q.error && !q.stalemate, win:q.value === 'win', stuck:!!q.stuck, stalemate:!!q.stalemate, error:q.error ? String(q.error && q.error.stack || q.error).split('\n').slice(0, 3).join(' | ') : null }; }
    if (o.confront) { const q = await drive(G.confront(keys[0]), 400000, o.maxRounds || 150); return { ok:!q.stuck && !q.error && !q.stalemate, win:q.value === 'win', stalemate:!!q.stalemate, error:q.error ? String(q.error && q.error.stack || q.error).split('\n').slice(0, 3).join(' | ') : null, waves:0, rounds:0, kills:0 }; }
    const out = await drive(G.runOnce(keys, o), 400000, o.maxRounds || 150);
    const R = G.RUN;
    const stale = !!out.stalemate;
    const stallFoes = stale ? G.foes.filter(f => f.alive).map(f => f.name).slice(0, 4).join(' + ') : '';
    return {
      stalemate: stale, stallFoes, stallWave: G.wave + 1, atWave: G.wave + 1,
      ok: stale || (!out.stuck && !out.error && result !== null),
      stuck: !!out.stuck, error: out.error ? String(out.error && out.error.stack || out.error).split('\n').slice(0, 3).join(' | ') : null,
      win: !stale && !!(result && result.win), waves: R.waves || 0, rounds: R.rounds || 0, kills: R.kills || 0,
      xpGain: Math.round((R.xp || 0) * (R._xpMul || 1)), cDone: R.cDone || 0, cGiven: R.cGiven || 0, alive: G.party.filter(u => u.alive).length, dmg: Object.assign({}, R.dBy || {})
    };
  }
  return { G, run, reseed, htmlPath, sb, drive };
}
module.exports = { load, findHtml };
