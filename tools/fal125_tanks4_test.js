#!/usr/bin/env node
'use strict';
/* fal125_tanks4_test.js: checks Parda (0120), Xainbow (0121), Dollion (0122) and Vein Ripper (0123), all Tanks, V263. USAGE: node fal125_tanks4_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 30; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  run('RUN = newRun()');
  const want = { parda:'0120', xainbow:'0121', dollion:'0122', veinripper:'0123' };
  for (const k in want) { const c = G.CHARACTERS_BY(k); ok(c && c.role === 'Tank' && c.id === want[k] && c.skills.every(s => S[s]) && S['ult_' + k], `${c ? c.name : k}: Tank ${want[k]}, 3 moves and an ultimate`); }
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  /* Parda */
  const p = mk('parda'), al = mk('fuja'), e = mkE(); p.paChance = 0; T.setSides([p, al], [e]); T.setCur(p);
  S.paparry.run(p); ok(has(p, 'paready') && has(p, 'taunt'), 'Parry: ready and Taunting');
  T.setCur(e); const ph = p.hp; T.hit(e, p, 1); T.hit(e, p, 1); ok(p.hp === ph && e.hp < 9000 && p.paCount === 2, 'the next 2 hits do nothing and go back into the attacker');
  const ph2 = p.hp; T.hit(e, p, 1); ok(p.hp < ph2, 'the third one lands');
  T.setCur(p); S.pacover.run(p, al); T.setCur(e); const ah = al.hp, eh = e.hp; T.hit(e, al, 1); ok(al.hp === ah && e.hp < eh && !has(al, 'pacover'), 'Cover Parry parries one hit meant for an ally');
  T.setCur(p); let r0 = 0, r3 = 0; const z1 = mkE(), z2 = mkE(); T.setSides([p, al], [z1, z2]);
  for (let i = 0; i < 20; i++) { p.paCount = 0; z1.hp = 9000; S.pariposte.run(p, z1); r0 += 9000 - z1.hp; p.paCount = 6; z2.hp = 9000; S.pariposte.run(p, z2); r3 += 9000 - z2.hp; }
  ok(r3 > r0 * 1.5, 'Riposte grows with every parry (' + r3 + ' vs ' + r0 + ')');
  const p2 = mk('parda'), e2 = mkE(); p2.paChance = 1; T.setSides([p2, al], [e2]); T.setCur(e2); const h2 = p2.hp; T.hit(e2, p2, 1); ok(p2.hp === h2, 'it can parry on its own, without getting ready');
  /* Xainbow */
  const x = mk('xainbow'), f = mk('fuja'), xe = mkE(); T.setSides([x, f], [xe]); T.setCur(xe);
  for (let i = 0; i < 7; i++) { x.hp = x.maxHp; T.hit(xe, x, 1); } ok(x.xbCol === 5, 'every hit knocks colour loose (max 5)');
  let dc = 0, d0 = 0; for (let i = 0; i < 20; i++) { x.xbCol = 5; x.hp = x.maxHp; T.hit(xe, x, 1); dc += x.maxHp - x.hp; x.xbCol = 0; x.hp = x.maxHp; T.hit(xe, x, 1); d0 += x.maxHp - x.hp; }
  ok(dc < d0 * .9, 'colour makes it take less damage (' + dc + ' vs ' + d0 + ')');
  T.setCur(x); S.xbconfetti.run(x); ok(has(x, 'taunt') && has(xe, 'blur'), 'Confetti Taunts and Blurs');
  x.xbCol = 4; f.hp = 50; xe.hp = 9000; S.xbburst.run(x); ok(x.xbCol === 0 && xe.hp < 9000 && f.hp > 50, 'Colour Burst hurts every enemy and heals every ally');
  const rr = mk('rainbowripper'), x2 = mk('xainbow'), xe2 = mkE(); T.setSides([x2, rr], [xe2]); T.setCur(xe2); run('round = 3'); T.hit(xe2, x2, 1); ok(rr.rrCol === 1, 'with its maker there, a hit also fills Rainbow Ripper\'s machine');
  /* Dollion */
  run('RUN = newRun()'); const dl = mk('dollion'), da = mk('fuja'), d1 = mkE(), d2 = mkE(); T.setSides([dl, da], [d1, d2]); T.setCur(dl);
  S.dodoll.run(dl, d1); ok(has(d1, 'dodoll'), 'Voodoo Doll');
  T.setCur(d2); const h1 = d1.hp, hh2 = d2.hp; T.hit(d2, dl, 1); ok(d1.hp < h1, 'hits on Dollion also hurt the enemy it has a doll of');
  T.setCur(dl); S.dodecoy.run(dl); ok(dl.doDecoy > 0 && has(dl, 'taunt'), 'Doll Decoy');
  T.setCur(d2); const fa = da.hp; const dd0 = dl.doDecoy; T.hit(d2, da, 1); ok(dl.doDecoy < dd0 && fa - da.hp < 67, 'the decoy soaks hits meant for an ally');
  const mh = dl.maxHp; d1.hp = 1; T.setCur(dl); T.hit(dl, d1, 1); ok(!d1.alive && dl.doKept === 1 && dl.maxHp > mh, 'an enemy dies before its doll: Dollion keeps it and gets tougher');
  ok(!T.CF.includes('doKept'), 'kept dolls stay for the whole run');
  T.setCur(dl); const pz = mkE(), pn = mkE(); T.setSides([dl, da], [pz, pn]); T.addStatus(pz, 'dodoll', 99, 1); let w1 = 0, w0 = 0;
  for (let i = 0; i < 20; i++) { pz.hp = pn.hp = 9000; S.dopin.run(dl, pz); w1 += 9000 - pz.hp; S.dopin.run(dl, pn); w0 += 9000 - pn.hp; } ok(w1 > w0 * 1.3, 'Pin hits harder with the doll (' + w1 + ' vs ' + w0 + ')');
  /* Vein Ripper */
  const v = mk('veinripper'), va = mk('fuja'), v1 = mkE(), v2 = mkE(); T.setSides([v, va], [v1, v2]); T.setCur(v);
  S.vrweb.run(v); ok(has(v, 'taunt') && has(v1, 'slow') && has(v2, 'vrweb'), 'Vein Web Taunts and webs everyone');
  v.hp = 50; S.vrrip.run(v, v1); ok(v.hp > 50 && has(v, 'vrveins') && v1.hp < 9000, 'Vein Rip hits, heals and adds stolen veins');
  T.setCur(v1); const vh = v.hp, vv = v.st.find(s => s.k === 'vrveins').v; T.damage(v, vv - 1, 'impact'); ok(v.hp === vh, 'stolen veins soak damage');
  T.setCur(v); S.vrcontrol.run(v, v2); ok(has(v2, 'stun'), 'Vein Control: the enemy loses its next turn');
  v.st = v.st.filter(s => s.k !== 'vrveins'); v.hp = v.maxHp; T.damage(v, 40, 'impact'); const n0 = v.maxHp - v.hp; v.hp = v.maxHp; T.damage(v, 40, 'fire'); ok(v.maxHp - v.hp === 50 && n0 === 40, 'weak to fire');
  T.addStatus(v, 'frost', 3, .05); v.hp = v.maxHp; T.damage(v, 40, 'impact'); ok(v.maxHp - v.hp === 50, 'and weak while it has Frostbite');
  for (const k of ['parda', 'xainbow', 'dollion', 'veinripper']) { const u = mk(k), b = mk('sna'), en = mkE(); T.setSides([u, b], [en]); T.setCur(u); let er = ''; try { S['ult_' + k].run(u, en); } catch (e3) { er = String(e3); } ok(!er, k + ' ultimate runs' + (er ? ' ' + er : '')); }
  console.log(bad ? `\n${bad} problem(s).` : '\nParda, Xainbow, Dollion and Vein Ripper OK.'); process.exit(bad ? 1 : 0);
})();
