#!/usr/bin/env node
'use strict';
/* fal125_trio_test.js: checks Gloom (0117, Damage), Ano (0118, Healer) and Lycion (0119, Tank), V262. USAGE: node fal125_trio_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 30; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  const turn = u => { T.addStatus(u, 'stun', 1, 1); return H.drive(run(`(async(u)=>{ try{ await takeTurn(u); }catch(e){ globalThis.__err=String(e); } })`)(u)); };
  run('RUN = newRun()');
  const want = { gloom:['0117', 'Damage'], ano:['0118', 'Healer'], lycion:['0119', 'Tank'] };
  for (const k in want) { const c = G.CHARACTERS_BY(k); ok(c && c.id === want[k][0] && c.role === want[k][1] && c.skills.every(s => S[s]) && S['ult_' + k], `${k}: ${want[k][1]} ${want[k][0]}, 3 moves and an ultimate`); }
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  /* Gloom */
  const g = mk('gloom'), s1 = mk('sna'); let e = mkE(); T.setSides([g, s1], [e]); T.setCur(g);
  e.hp = Math.round(e.maxHp * .30) + 30; S.glhead.run(g, e); ok(!e.alive, 'Head Blow: a normal enemy left under 30% dies outright');
  const b = mkE(); b.boss = true; T.setSides([g, s1], [b]); S.glhead.run(g, b); ok(b.alive, 'a boss is not killed outright');
  const q = mkE(); T.setSides([g, s1], [q]); S.glquick.run(g, q); ok(q.hp < 9000, 'Quick Strike hits');
  const l = mkE(); T.setSides([g, s1], [l]); S.glleap.run(g, l); T.setCur(l); const gh = g.hp; T.hit(l, g, 1); ok(g.hp === gh, 'Leap: nothing can hit him in the air');
  const lh = l.hp; await turn(g); ok(l.hp < lh && !has(g, 'glair'), 'he lands on the enemy at the start of his next turn');
  ok(!run('glCalm')(g), 'without Ano or Lycion he is Aggressive');
  const an = mk('ano'); T.setSides([g, an], [mkE()]); ok(run('glCalm')(g), 'with Ano he is Calm');
  /* Ano */
  const n = mk('ano'), f = mk('fuja'), z = mkE(); T.setSides([n, f], [z]); T.setCur(n);
  f.hp = 50; S.anbrace.run(n, f); ok(f.hp > 50 && has(f, 'anplate') && n.anStrain === 1, 'Metal Brace heals, plates, +1 Strain');
  T.setCur(z); f.hp = f.maxHp; const pv = f.st.find(s => s.k === 'anplate').v; T.damage(f, pv - 1, 'impact'); ok(f.hp === f.maxHp, 'the plate soaks damage');
  T.setCur(n); S.anwall.run(n); ok(n.anStrain === 3 && has(n, 'anplate'), 'Metal Wall plates everyone, +2 Strain');
  S.anrebar.run(n, z); S.anrebar.run(n, z); ok(n.anStrain === 0 && has(n, 'stun'), 'at 5 Strain his brain short-circuits: he loses a turn');
  ok(['anStrain', 'lyRage', 'lyForm'].every(k => T.CF.includes(k)), 'Strain, Rage and the Rage Form reset every wave');
  /* Lycion */
  const y = mk('lycion'), p = mk('fuja'), x = mkE(); T.setSides([y, p], [x]); T.setCur(x);
  T.hit(x, y, 1); ok((y.lyRage || 0) > 8, 'with the mask on, hits fill Rage (' + y.lyRage + ')');
  T.setCur(y); S.lycover.run(y, p); T.setCur(x); const ph = p.hp, yh = y.hp; T.hit(x, p, 1); ok(p.hp === ph && y.hp < yh, 'Cover: hits on the ally go to Lycion');
  y.lyRage = 30; ok(!!S.lymask.can(y), 'Mask Off needs 50 Rage');
  y.lyRage = 60; T.setCur(y); S.lymask.run(y); ok(y.lyForm && has(y, 'taunt') && has(x, 'lyterror'), 'Mask Off: Rage Form, Taunt, every enemy Terrified');
  T.setCur(x); x.hp = 9000; y.hp = y.maxHp; T.hit(x, y, 1); ok(x.hp < 9000, 'in Rage Form it bites back');
  y.lyRage = 20; await turn(y); ok(!y.lyForm && !has(x, 'lyterror'), 'when the Rage runs out the mask goes back on');
  y.lyRage = 80; T.setCur(y); S.lymask.run(y); const n2 = mk('ano'); T.setSides([y, n2], [x]); T.setCur(n2); y.hp = 60; S.anbrace.run(n2, y);
  ok(!y.lyForm && y.hp > 60, 'Ano\'s Metal Brace puts the mask back on and the leftover rage heals Lycion');
  /* ultimates */
  for (const k of ['gloom', 'ano', 'lycion']) { const u = mk(k), al = mk('sna'), en = mkE(); T.setSides([u, al], [en]); T.setCur(u); let er = ''; try { S['ult_' + k].run(u, en); } catch (e2) { er = String(e2); } ok(!er, k + ' ultimate runs' + (er ? ' ' + er : '')); }
  ok(!run('globalThis.__err'), 'no errors during turns');
  console.log(bad ? `\n${bad} problem(s).` : '\nGloom, Ano and Lycion OK.'); process.exit(bad ? 1 : 0);
})();
