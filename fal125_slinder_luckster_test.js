#!/usr/bin/env node
'use strict';
/* fal125_slinder_luckster_test.js: checks Slinder (Bloodmaker) and Luckster (Rabbit's Luck), V253.
   USAGE: node fal125_slinder_luckster_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 20; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  run('RUN = newRun()');
  const sl = G.CHARACTERS_BY('slinder'), lk = G.CHARACTERS_BY('luckster');
  ok(sl.role === 'Damage' && sl.id === '0107' && lk.role === 'Healer' && lk.id === '0108', 'Slinder (Damage, 0107) and Luckster (Healer, 0108) exist');
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  /* Slinder */
  const s = mk('slinder'), al = mk('sna'); let e1 = mkE(), e2 = mkE(); T.setSides([s, al], [e1, e2]); T.setCur(s);
  S.bmclaw.run(s, e1); ok(e1.hp < 9000 && has(e1, 'bleed'), 'Blood Claws hits and makes the target Bleed');
  const h0 = s.hp, b0 = e2.hp; S.bmblade.run(s, e2); const full = b0 - e2.hp;
  ok(s.hp === h0 - Math.round(s.maxHp * .12), 'Blood Blade costs 12% of his own max HP');
  s.hp = Math.round(s.maxHp * .3); const b1 = e2.hp; S.bmblade.run(s, e2); const low = b1 - e2.hp;
  ok(low > full * 1.3, 'and hits much harder the less HP he has (' + full + ' -> ' + low + ')');
  s.hp = 1; S.bmblade.run(s, e2); ok(s.hp === 1, 'it never takes his last HP');
  S.bmclaw.run(s, e2); s.hp = 30; const hp1 = s.hp, c1 = e1.hp, c2 = e2.hp; S.bmharvest.run(s);
  ok(!has(e1, 'bleed') && !has(e2, 'bleed') && e1.hp < c1 && e2.hp < c2, 'Harvest pulls the blood out of every Bleeding enemy (and ends the Bleed)');
  ok(s.hp > hp1 && s.bmFree === 1, 'he heals for each one, and his next Blade is free');
  const h2 = s.hp; S.bmblade.run(s, e1); ok(s.hp === h2 && !s.bmFree, 'the free Blade costs nothing');
  const f1 = mkE(), f2 = mkE(); T.setSides([s, al], [f1, f2]); run('addStatus')(f1, 'bleed', 3, .05);
  let d1 = 0, d2 = 0; for (let i = 0; i < 20; i++) { f1.hp = f2.hp = 9000; T.hit(s, f1, .5); T.hit(s, f2, .5); d1 += 9000 - f1.hp; d2 += 9000 - f2.hp; }
  ok(d1 > d2 * 1.05, 'Bleeding enemies take more from him (' + d1 + ' vs ' + d2 + ')');
  /* Luckster */
  const L = mk('luckster'), t1 = mk('sna'), t2 = mk('snavo'); const g1 = mkE(); T.setSides([L, t1, t2], [g1]); T.setCur(L);
  const rolls = {}; run('globalThis.__lr=[]; const __l=lkRoll; lkRoll=function(){ const k=__l.apply(this,arguments); __lr.push(k); return k; }');
  for (let i = 0; i < 40; i++) { t1.hp = Math.round(t1.maxHp * .25); t1.st = []; g1.st = []; S.lkbreak.run(L, t1); }
  run('__lr').forEach(k => rolls[k] = (rolls[k] || 0) + 1);
  ok((rolls.heal || 0) >= 20, 'Lucky Break leans to a heal when the ally is low (' + JSON.stringify(rolls) + ')');
  run('__lr=[]'); const add = run('addStatus');
  for (let i = 0; i < 40; i++) { t1.hp = t1.maxHp; t1.st = []; T.setCur(g1); add(t1, 'venom', 3, .05); add(t1, 'slow', 2, .3); add(t1, 'burn', 2, .05); T.setCur(L); S.lkbreak.run(L, t1); }
  const r2 = {}; run('__lr').forEach(k => r2[k] = (r2[k] || 0) + 1);
  ok((r2.cleanse || 0) >= 20, 'and to a cleanse when they are covered in bad statuses (' + JSON.stringify(r2) + ')');
  run('__lr=[]'); for (let i = 0; i < 60; i++) { t1.hp = t1.maxHp; t1.st = []; S.lkbreak.run(L, t1); }
  const r3 = {}; run('__lr').forEach(k => r3[k] = (r3[k] || 0) + 1);
  ok(Object.keys(r3).length >= 4, 'when everyone is fine, anything can happen (' + JSON.stringify(r3) + ')');
  t1.hp = 10; const hh = t1.hp; S.lkbreak.run(L, t1); ok(t1.hp > hh, 'Lucky Break always heals something');
  t1.hp = t2.hp = 10; S.lkfoot.run(L); ok(t1.hp > 10 && t2.hp > 10, 'Rabbit\'s Foot heals the whole team and rolls for everyone');
  L.lkJack = 1; t1.hp = t2.hp = 10; t1.st = [{ k:'venom', t:3, v:.05 }]; S.lkjack.run(L); ok(t1.hp >= 10 + t1.maxHp * .3 && !has(t1, 'venom'), 'Jackpot (forced): the team heals 30% and is cleansed');
  let miss = 0; for (let i = 0; i < 200; i++) { L.hp = L.maxHp; T.setCur(g1); if ((T.hit(g1, L, .2) || 0) === 0 && L.hp === L.maxHp) miss++; }
  ok(miss > 15 && miss < 60, 'about 15% of enemy hits on him somehow miss (' + miss + ' of 200)');
  console.log(bad ? `\n${bad} problem(s).` : '\nSlinder and Luckster OK.'); process.exit(bad ? 1 : 0);
})();
