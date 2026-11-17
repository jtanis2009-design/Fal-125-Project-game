#!/usr/bin/env node
'use strict';
/* fal125_hemo_test.js: checks Hemo (0125, Damage, Blood Flow), V280. USAGE: node fal125_hemo_test.js [--html game.html] [--runs 2] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null), i1 = a.indexOf('--runs'), runs = i1 >= 0 ? +a[i1 + 1] : 2;
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 30; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  run('RUN = newRun()');
  const c = G.CHARACTERS_BY('hemo'); ok(c && c.role === 'Damage' && c.id === '0125' && c.name === 'Hemo' && c.skills.every(s => S[s]) && S.ult_hemo, 'Hemo exists: Damage, 0125, 3 moves and an ultimate');
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  ok(run("BUILDS['Phobic'] && BUILDS['Phobic'].role === 'Damage'") && c.build === 'Phobic', 'his build exists');
  ok(run("IDENT.hemo && PARTY_QUIPS.hemo.length === 2 && STORY_EXTRA.hemo && RL.hemo.length === 2 && ARC_LORE.hemo.length === 6 && MAST_TEXT.hemo && SKIN_DEFS.hemo.length === 2"), 'identity, quips, story lines, recruit scenes, Archive, Mastery and 2 skins are there');
  const h = mk('hemo'), al = mk('sna'), e = mkE(), e2 = mkE(), e3 = mkE(); T.setSides([h, al], [e, e2, e3]); T.setCur(h);
  S.hmtouch.run(h, e); ok(h.hmTaps === 1, 'Thorn Touch is one Tap');
  S.hmbrush.run(h); ok(h.hmTaps === 4 && e.hp < 9000 && e2.hp < 9000 && e3.hp < 9000, 'Brush Past touches every enemy: +1 Tap each (' + h.hmTaps + ')');
  T.addStatus(e, 'bleed', 3, .04); S.hmtouch.run(h, e); ok(h.hmTaps === 6, 'touching a Bleeding enemy gives an extra Tap');
  const t0 = mk('hemo'); T.setSides([t0, al], [e]); T.setCur(t0); ok(!!S.hmflow.can(t0), 'Blood Flow needs at least 1 Tap');
  const dmg = n => { const u = mk('hemo'); u.atk = 20; T.setSides([u, al], [e]); T.setCur(u); let s = 0; for (let i = 0; i < 30; i++) { u.hmTaps = n; e.hp = 9000; e.st = []; S.hmflow.run(u, e); s += 9000 - e.hp; } return s / 30; };
  const d2 = dmg(2), d10 = dmg(10), d20 = dmg(20);
  ok(d10 > d2 * 3.5 && d20 > d10 * 1.7, 'the beam gets stronger with every Tap (2 Taps ' + Math.round(d2) + ', 10 Taps ' + Math.round(d10) + ', 20 Taps ' + Math.round(d20) + ')');
  const u2 = mk('hemo'); T.setSides([u2, al], [e]); T.setCur(u2); u2.hmTaps = 7; S.hmflow.run(u2, e); ok(u2.hmTaps === 0, 'Blood Flow spends every Tap');
  const u3 = mk('hemo'); T.setSides([u3, al], [e]); u3.hmTaps = 19; T.setCur(u3); S.hmtouch.run(u3, e); S.hmtouch.run(u3, e); ok(u3.hmTaps === 20, 'Taps stop at 20');
  ok(!T.CF.includes('hmTaps'), 'Taps are kept from wave to wave');
  const u4 = mk('hemo'), s1 = mkE(), s2 = mkE(), s3 = mkE(); u4.hmPow = .06; u4.hmSplash = .5; T.setSides([u4, al], [s1, s2, s3]); T.setCur(u4); u4.hmTaps = 10; S.hmflow.run(u4, s2); ok(s1.hp < 9000 && s3.hp < 9000 && s2.hp < s1.hp, 'Deadly Flow chip: bigger Taps, and the neighbours are hit too');
  const u5 = mk('hemo'), f1 = mkE(), f2 = mkE(); T.setSides([u5, al], [f1, f2]); T.setCur(u5); S.ult_hemo.run(u5, f1); ok(f1.hp < 9000 && f2.hp < 9000 && !u5.hmTaps, 'ultimate: a beam through every enemy, and the Taps go back to 0');
  /* auto-play full runs */
  let errs = 0; const P = ['hemo', 'sna', 'eyianix', 'radiant'], xpMap = {}; P.forEach(k => xpMap[k] = 600);
  for (let i = 0; i < runs; i++) { H.reseed(8000 + i); try { await H.run(P, { world:0, runlen:'world', diff:'Normal', xp:0, xpMap, chips:[], smart:true, story:true, wave:1, foes:[] }); } catch (e2) { errs++; console.log('  run error: ' + String(e2.message).slice(0, 160)); } }
  ok(!errs, runs + ' auto-played full runs with Hemo finish with no errors');
  console.log(bad ? `\n${bad} problem(s).` : '\nHemo OK.'); process.exit(bad ? 1 : 0);
})();
