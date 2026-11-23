#!/usr/bin/env node
'use strict';
/* fal125_elites_test.js: checks V299 elite traits (Vampiric, Splitting, Shielded, Hasty, Thorny, Volatile).
   USAGE: node fal125_elites_test.js [--html game.html] [--runs 2] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null), i1 = a.indexOf('--runs'), runs = i1 >= 0 ? +a[i1 + 1] : 2;
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 3 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k);
  const ek = 'husk';
  const mkE = (hp) => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek]), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 900; f.atk = 30; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  run('RUN = newRun(); round = 1; wave = 6');
  ok(run('Object.keys(ELT_TRAITS).length') === 6, 'six traits');
  const give = (e, k) => { H.sb.__tmpE = e; run('eltGive(__tmpE, ' + JSON.stringify(k) + ')'); };
  /* Vampiric */
  const p = mk('sna'), v = mkE(); T.setSides([p], [v]); give(v, 'vamp'); ok(v.trait === 'vamp' && /Vampiric/.test(v.name), 'Vampiric: named and shown');
  v.hp = 400; T.setCur(v); T.hit(v, p, 1); ok(v.hp > 400, 'Vampiric heals from the damage it deals');
  /* Shielded */
  const s = mkE(1000); T.setSides([p], [s]); give(s, 'shield'); ok(s.trShield === 300, 'Shielded: a shield of 30% max HP');
  T.damage(s, 200); ok(s.hp === 1000 && s.trShield === 100, 'the shield soaks damage first');
  T.damage(s, 250); ok(s.trShield === 0 && s.hp === 850, 'then the rest goes through');
  /* Hasty */
  const hz = mkE(); const sp0 = hz.spd; give(hz, 'hasty'); ok(hz.spd > sp0, 'Hasty: faster (' + sp0 + ' -> ' + hz.spd + ')');
  /* Thorny */
  const q = mk('fuja'), th = mkE(); T.setSides([q], [th]); give(th, 'thorn'); q.hp = q.maxHp; T.setCur(q); T.hit(q, th, 1); ok(q.hp < q.maxHp, 'Thorny hits back when a single attack hits it');
  q.hp = q.maxHp; T.hit(q, th, 1, { chain:true }); ok(q.hp === q.maxHp, 'but not for splash hits');
  /* Volatile */
  const r1 = mk('sna'), r2 = mk('fuja'), bo = mkE(5); T.setSides([r1, r2], [bo]); give(bo, 'boom'); r1.hp = r1.maxHp; r2.hp = r2.maxHp; T.setCur(r1); T.hit(r1, bo, 5);
  ok(!bo.alive && r1.hp < r1.maxHp && r2.hp < r2.maxHp, 'Volatile explodes when it falls and hurts every fighter');
  /* Splitting (needs the battle screen, so it is checked in a full run below by counting splits) */
  const sp = mkE(10); const sq = mk('fuja'); T.setSides([sq], [sp]); give(sp, 'split'); T.setCur(sq); let splitOk = false; try { T.hit(sq, sp, 5); const halves = run('foes').filter(f => f.alive && / \(half\)$/.test(f.name)); splitOk = !sp.alive && halves.length === 2 && halves[0].maxHp === 4; } catch (e) { console.log('  split error ' + e.message); }
  ok(splitOk, 'Splitting: when it falls, two half-size copies take its place');
  /* auto-play runs with elites forced on */
  run('ELT.chance = 1');
  let errs = 0; const P = ['fuja', 'radiant', 'eyianix', 'bearer'], xpMap = {}; P.forEach(k => xpMap[k] = 600);
  for (let i = 0; i < runs; i++) { H.reseed(9900 + i); try { await H.run(P, { world:2, runlen:'world', diff:'Normal', xp:0, xpMap, chips:[], smart:true, story:false, wave:1, foes:[] }); } catch (e2) { errs++; console.log('  run error: ' + String(e2.message).slice(0, 160)); } }
  ok(!errs, runs + ' auto-played runs with an elite on every wave finish with no errors');
  console.log(bad ? `\n${bad} problem(s).` : '\nElite traits OK.'); process.exit(bad ? 1 : 0);
})();
