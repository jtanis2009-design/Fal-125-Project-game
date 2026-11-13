#!/usr/bin/env node
'use strict';
/* fal125_hole_test.js: checks Hole (0115, Damage, Trypophobia), V260: holes, Bore, Phobia, Devil Form, the once-per-run revive.
   USAGE: node fal125_hole_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS, holes = run('hoHoles');
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 20; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  const turn = u => { T.addStatus(u, 'stun', 1, 1); return H.drive(run(`(async(u)=>{ try{ await takeTurn(u); }catch(e){ globalThis.__err=String(e); } })`)(u)); };
  run('RUN = newRun()');
  const c = G.CHARACTERS_BY('hole'); ok(c && c.role === 'Damage' && c.id === '0115' && c.build === 'Holes' && c.skills.every(s => S[s]) && S.ult_hole, 'Hole exists: Damage, 0115, 3 moves and an ultimate');
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  const h = mk('hole'), al = mk('sna'); let e1 = mkE(), e2 = mkE(); T.setSides([h, al], [e1, e2]); T.setCur(h);
  S.hobore.run(h, e1); ok(holes(e1) === 1, 'Bore digs a hole');
  for (let i = 0; i < 8; i++) S.hobore.run(h, e1); ok(holes(e1) === 5, 'up to 5 holes');
  let d0 = 0, d5 = 0; for (let i = 0; i < 30; i++) { e1.hp = 9000; e2.hp = 9000; e2.st = []; S.hobore.run(h, e1); S.hobore.run(h, e2); d5 += 9000 - e1.hp; d0 += 9000 - e2.hp; }
  ok(d5 > d0 * 1.25, 'every hole makes Bore hit harder (' + d5 + ' vs ' + d0 + ')');
  const f1 = mkE(), f2 = mkE(); T.setSides([h, al], [f1, f2]); S.hophobia.run(h, f1); ok(has(f1, 'hofear') && !has(f1, 'stun'), 'Phobia makes it Afraid');
  T.addStatus(f2, 'hoholes', 99, 3); S.hophobia.run(h, f2); ok(has(f2, 'stun'), 'with 3 holes it panics and loses its turn');
  const g = mkE(), n = mkE(); g.atk = n.atk = 30; T.setSides([h, al], [g, n]); T.addStatus(g, 'hofear', 9, .25);
  let dg = 0, dn = 0; for (let i = 0; i < 30; i++) { al.hp = al.maxHp; T.hit(g, al, 1); dg += al.maxHp - al.hp; al.hp = al.maxHp; T.hit(n, al, 1); dn += al.maxHp - al.hp; }
  ok(dg < dn * .85, 'Afraid enemies hit weaker (' + dg + ' vs ' + dn + ')');
  /* Devil Form */
  const x1 = mkE(), x2 = mkE(); T.setSides([h, al], [x1, x2]); T.setCur(h); ok(!S.hodevil.can(h), 'Devil Form ready');
  S.hodevil.run(h); ok(has(h, 'hodevil') && holes(x1) === 1 && holes(x2) === 1 && S.hodevil.can(h), 'Devil Form: every enemy gets a hole, once per wave');
  ok(run("COUNTER_FIELDS.includes('hoDevilUsed')"), 'Devil Form comes back every wave');
  x2.hp = 100; const before = x2.hp; S.hobore.run(h, x1); ok(x2.hp < before && holes(x2) === 2, 'in Devil Form, Bore pops out at a second enemy');
  const r1 = x1.hp; await turn(h); ok(x1.hp < r1, 'in Devil Form, the holes rot at the start of his turn');
  /* revive */
  run('RUN = newRun()'); const h2 = mk('hole'), z = mkE(); T.setSides([h2, al], [z]); T.setCur(z);
  T.damage(h2, 9999, 'impact'); ok(h2.alive && h2.hp === Math.round(h2.maxHp * .35), 'when he would fall, he gets back up with 35% HP');
  T.damage(h2, 9999, 'impact'); ok(!h2.alive || h2.hp <= 0, 'but only once per run');
  const u = mk('hole'), e = mkE(); T.setSides([u, al], [e]); T.setCur(u); S.ult_hole.run(u, e); ok(e.hp < 9000 && holes(e) === 2 && has(u, 'hodevil'), 'Pocket Dimension: hits everyone, 2 holes each, Devil Form');
  ok(!run('globalThis.__err'), 'no errors during turns');
  console.log(bad ? `\n${bad} problem(s).` : '\nHole OK.'); process.exit(bad ? 1 : 0);
})();
