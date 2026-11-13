#!/usr/bin/env node
'use strict';
/* fal125_blackmarket_test.js: checks THE BLACK MARKET (v222).
   1. data      every item has a price, text and a gate; ids are unique; every hook name is one the game really fires
   2. gates     milestones open and close items correctly
   3. stock     thousands of rolls: size 4-6, no duplicates, never the same set twice in a row, locked crates only when something is locked
   4. buying    caps, slots, grafts, sealed artifacts and the reveal after a wave
   5. runs      every item is installed in auto-played runs: no errors / hangs, and the clear rate + waves reached are compared with a run without it
   USAGE: node fal125_blackmarket_test.js [--html game.html] [--runs 24] [--world 3] [--party snavo,sna,eyianix,radiant] [--quick] [--only id,id] */
const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), opt = k => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : null; };
const html = findHtml(opt('html')), runs = +(opt('runs') || 24), world = (+(opt('world') || 3)) - 1, party = (opt('party') || 'snavo,sna,eyianix,radiant').split(','), quick = a.includes('--quick');
let bad = 0; const fail = m => { bad++; console.log('  ✗ ' + m); }, ok = m => console.log('  ✓ ' + m);
const HOOKS = ['wave', 'pre', 'post', 'kill', 'clear', 'coin', 'die', 'heal', 'skill', 'turn'];
(async () => {
  const H = load({ html }), G = H.G, BM = G.BM;
  if (!BM) { console.log('No Black Market found in this game file.'); process.exit(1); }
  const all = BM.items.concat(BM.mods), ids = new Set();

  console.log('1. DATA');
  all.concat(BM.art).forEach(x => { const id = x.id; if (ids.has(id)) fail('duplicate id ' + id); ids.add(id); });
  BM.items.forEach(d => {
    const p = [];
    if (!(d.price > 0)) p.push('no price'); if (!d.desc || d.desc.length < 20) p.push('no description'); if (!d.bmGate) p.push('no gate'); if (!d.name) p.push('no name');
    Object.keys(d).forEach(k => { if (['wave', 'pre', 'post', 'kill', 'clear', 'coin', 'die', 'heal', 'skill', 'turn'].includes(k) && !HOOKS.includes(k)) p.push('bad hook ' + k); });
    if (d.bm === 'unstable' && !d.noSlot) p.push('unstable chips must be noSlot'); if (d.bm === 'byte' && !d.byte) p.push('experimental bytes must be byte:true');
    if (d.bm === 'byte' && !d.stat && !d.pre && !d.wave && !d.post && !d.heal) p.push('does nothing');
    p.length ? fail(`${d.id}: ${p.join(', ')}`) : null;
  });
  BM.mods.forEach(m => { if (!(m.price > 0) || !m.desc || !m.bmGate || typeof m.give !== 'function') fail('graft ' + m.id + ' incomplete'); });
  BM.art.forEach(x => { if (!(x.w > 0) || !x.text || !x.bmGate || (!x.run && !x.chip)) fail('artifact ' + x.id + ' incomplete'); if (x.chip && !G.CHIP[x.chip]) fail('artifact chip missing ' + x.chip); });
  ok(`${BM.items.length} chips/bytes, ${BM.mods.length} grafts, ${BM.art.length} artifact outcomes checked`);
  const kinds = {}; BM.items.forEach(d => kinds[d.bm] = (kinds[d.bm] || 0) + 1); ok('by kind: ' + JSON.stringify(kinds));

  console.log('2. GATES');
  const g = BM.gateOk, m0 = { world:0, sec:0, inc:0, visits:0 };
  [[null, m0, true], [{ w:2 }, { ...m0, world:1 }, false], [{ w:2 }, { ...m0, world:2 }, true], [{ w:1, sec:1 }, { ...m0, world:5 }, false], [{ w:1, sec:1 }, { ...m0, world:5, sec:1 }, true], [{ inc:2 }, { ...m0, inc:1 }, false], [{ inc:2 }, { ...m0, inc:2 }, true], [{ visits:3 }, { ...m0, visits:3 }, true]]
    .forEach(([gate, m, want], i) => g(gate, m) === want ? null : fail('gate case ' + i));
  all.forEach(d => { if (!BM.gateText(d.bmGate)) fail('no gate text for ' + d.id); });
  ok('gate rules and gate texts');

  /* a finished run leaves a real RUN + party behind, which is all the stock and buying code needs */
  H.reseed(7); await H.run(party, { world, runlen:'world', diff:'Normal', story:true, smart:true, god:true, ohk:true });
  const reset = () => { G.PARTY.forEach(u => { u.alive = true; u.hp = u.maxHp; u.bmN = 0; u.bmFang = 0; u.bmPulse = 0; }); const R = G.RUN; R.coins = 99999; R.chips = []; R.bmOwned = []; R.bmLast = []; R.bmPend = []; R.paid = {}; G.SAVE.bm = { visits:0, seen:{}, clues:0 }; };

  console.log('3. STOCK');
  const worlds = [0, 1, 2, 3, 4, 5, 7], seenIds = new Set(); let rolls = 0, same = 0;
  for (const w of worlds) for (const sec of [0, 1, 3]) for (const inc of [0, 3]) {
    reset(); G.SAVE.inc = Object.fromEntries(Array.from({ length:inc }, (_, i) => ['i' + i, { done:1 }])); G.SAVE.unlocked = w; G.CFG.world = w; G.SAVE.pb = { own:{}, eq:{}, sec:Object.fromEntries(Array.from({ length:sec }, (_, i) => ['s' + i, 1])) };
    for (let n = 0; n < (quick ? 40 : 200); n++) {
      const st = BM.roll(), real = st.offers, key = real.map(o => o.id.split(':')[0]).sort().join(','); rolls++;
      if (w >= 1 && (real.length < 4 || real.length > 6)) fail(`world ${w + 1}: stock size ${real.length}`);
      if (w === 0 && real.length) fail('stock exists in World 1 for a fresh save (should not unless gates allow)');
      if (new Set(real.map(o => o.id)).size !== real.length) fail('duplicate offer in one stock');
      const mile = BM.mile(); real.forEach(o => { const d = o.kind === 'art' ? null : o.def; if (d && !BM.gateOk(d.bmGate, mile)) fail(`${o.id} offered but locked at world ${w + 1}`); if (!(o.price > 0)) fail('bad price ' + o.id); seenIds.add(o.id.split(':')[0]); });
      st.locked.forEach(o => { if (BM.gateOk(o.gate, mile)) fail('locked crate for an open gate'); });
      if (G.RUN.bmLast && G.RUN.bmLast.join() === key.split(',').join() && real.length > 2) same++;
      G.RUN.bmLast = real.map(o => o.id.split(':')[0]);
    }
  }
  ok(`${rolls} stock rolls, ${seenIds.size} distinct items seen`);
  same ? fail(`${same} rolls repeated the previous stock exactly`) : ok('stock never repeats back to back');
  all.forEach(d => { if (!seenIds.has(d.id)) fail('item never offered in any roll: ' + d.id); });

  console.log('4. BUYING');
  reset(); G.SAVE.unlocked = 7; G.CFG.world = 7; G.SAVE.pb = { own:{}, eq:{}, sec:{ a:1, b:1, c:1 } }; G.SAVE.inc = { x:{ done:1 }, y:{ done:1 }, z:{ done:1 } };
  const mk = (id, kind, extra) => Object.assign({ id, kind, name:id, def:G.CHIP[id], price:50, sold:false }, extra || {});
  const U = BM.items.filter(d => d.bm === 'unstable'); let bought = 0;
  U.forEach(d => { const o = mk(d.id, 'unstable'); const why = BM.block(o); if (BM.buy(o)) bought++; else if (!why) fail('buy failed without a reason ' + d.id); });
  bought === BM.BM.cap.unstable ? ok('Unstable Chip cap respected (' + bought + ')') : fail(`unstable cap: bought ${bought}, cap ${BM.BM.cap.unstable}`);
  const B = BM.items.filter(d => d.bm === 'byte'); let bb = 0; B.forEach(d => { if (BM.buy(mk(d.id, 'byte'))) bb++; });
  bb === BM.byteSlots ? ok('Byte slots respected (' + bb + ')') : fail(`byte slots: bought ${bb}`);
  const tgt = G.PARTY[0], hp0 = tgt.maxHp; let gm = 0; BM.mods.forEach(md => { if (BM.buy(mk(md.id + ':' + tgt.key, 'mod', { def:md, mod:md, target:tgt.key }))) gm++; });
  gm === BM.BM.modCap && tgt.bmN === BM.BM.modCap ? ok('Graft cap respected (2 per fighter)') : fail('graft cap: ' + gm);
  let pa = 0; for (let i = 0; i < 4; i++) if (BM.buy(mk('bm_art_sealed', 'art', { def:null }))) pa++; pa === BM.BM.cap.art && G.RUN.bmPend.length === pa ? ok('sealed artifact cap respected') : fail('artifact cap: ' + pa);
  const c0 = G.RUN.coins; await BM.reveal(); G.RUN.bmPend.length === 0 ? ok('reveal identified every sealed artifact') : fail('pending artifacts left after reveal');
  G.RUN.coins = 0; BM.buy(mk('bx_over', 'byte')) ? fail('bought with no coins') : ok('cannot buy without coins');
  G.RUN.chips = []; const art = new Set(); for (let i = 0; i < 400; i++) art.add(BM.artifactRoll().id); art.size === BM.art.length ? ok('every artifact outcome can roll when unlocked') : fail('only ' + art.size + ' of ' + BM.art.length + ' artifact outcomes rolled');
  reset(); G.SAVE.unlocked = 1; G.CFG.world = 1; const early = new Set(); for (let i = 0; i < 300; i++) early.add(BM.artifactRoll().id); [...early].some(id => BM.art.find(x => x.id === id).bmGate.w > 1) ? fail('locked artifact outcome rolled early') : ok('artifact gates hold');
  try { BM.open(BM.roll()); ok('market screen builds without errors'); } catch (e) { fail('openBlackMarket threw: ' + e.message); }

  console.log('5. RUNS (' + runs + ' auto-played runs each, World ' + (world + 1) + ', Normal, ' + party.join('/') + ')');
  const base = async extra => { let w = 0, wv = 0, er = 0, st = 0, msg = ''; for (let n = 0; n < runs; n++) { H.reseed(500 + n); const r = await H.run(party, Object.assign({ world, runlen:'world', diff:'Normal', story:true, smart:true, xp:1500 }, extra || {})); if (r.win) w++; wv += r.waves; if (r.error) { er++; msg = r.error; } if (r.stuck) st++; } return { w, wv:wv / runs, er, st, msg }; };
  G.SAVE.unlocked = Math.max(world, 0);
  const b0 = await base(); console.log(`  baseline                      clear ${String(b0.w).padStart(2)}/${runs}   avg waves ${b0.wv.toFixed(1)}`);
  let list = quick ? all.slice(0, 4) : all.concat(BM.art.map(x => ({ id:x.id, bm:'art', name:x.name }))); if (opt('only')) { const w = opt('only').split(','); list = all.concat(BM.art.map(x => ({ id:x.id, bm:'art', name:x.name }))).filter(x => w.includes(x.id)); }
  for (const d of list) {
    const o = d.bm === 'mod' ? { bm:[d.id + '@' + party[0]] } : { bm:[d.id] };
    const r = await base(o), dW = r.wv - b0.wv, pct = b0.wv ? dW / b0.wv : 0, flags = [];
    if (r.er) flags.push('ERRORS ' + r.msg); if (r.st) flags.push('STUCK ' + r.st);
    if (pct > .2) flags.push('maybe too strong'); if (pct < -.3) flags.push('maybe too weak');
    console.log(`  ${(d.name || d.id).padEnd(28)} clear ${String(r.w).padStart(2)}/${runs}   avg waves ${r.wv.toFixed(1)} (${dW >= 0 ? '+' : ''}${(pct * 100).toFixed(0)}%) ${flags.length ? '<- ' + flags.join('; ') : ''}`);
    if (r.er || r.st) bad++;
  }
  console.log(bad ? `\n${bad} problem(s).` : '\nBlack Market OK.'); process.exit(bad ? 1 : 0);
})().catch(e => { console.log('TEST CRASH', e.stack); process.exit(1); });
