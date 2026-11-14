#!/usr/bin/env node
'use strict';
/* fal125_worldspecials_test.js: checks the V269 world specials of Worlds 1 to 5 (the Alarm, the Tide, the Searchlight, Hospitality, the Directive).
   USAGE: node fal125_worldspecials_test.js [--html game.html] [--runs 2] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), opt = k => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : null; }, html = findHtml(opt('html')), runs = +(opt('runs') || 2);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), W = run('WSP');
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 30; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  const world = (w, wv) => run(`CFG.world = ${w}; CFG.runlen = 'world'; RUN = newRun(); wave = ${wv || 0}; round = 1;`);
  ok(W.name.length === 5 && W.text.length === 5 && [0, 1, 2, 3, 4].every(w => /World special/.test(G.WORLD_DATA[w].note || '')), 'Worlds 1 to 5 each have a special, written in the world\'s note');
  ok(![5, 6, 7].some(w => /World special/.test(G.WORLD_DATA[w].note || '')), 'Worlds 6, 7 and 8 keep their own');
  /* World 1: the alarm */
  world(0, 6); let p = [mk('sna'), mk('fuja')], e = [mkE()]; T.setSides(p, e); run('wspWaveStart(6)');
  for (const r of [1, 2]) { run('round = ' + r); await H.drive(run('wspRoundEnd()')); } ok(!run('RUN.wsp.alarm'), 'the alarm stays quiet for the first 2 rounds');
  for (const r of [3, 4]) { run('round = ' + r); await H.drive(run('wspRoundEnd()')); } ok(run('RUN.wsp.alarm') === 2 && run('foes.length') === 1, 'it climbs from round 3');
  run('round = 5'); await H.drive(run('wspRoundEnd()')); ok(run('RUN.wsp.came') === true && run('foes.length') === 2, 'at 3 a Guard Drone arrives');
  run('round = 6'); await H.drive(run('wspRoundEnd()')); ok(run('foes.length') === 2, 'only once a wave');
  world(0, 2); T.setSides(p, [mkE()]); run('wspWaveStart(2); round = 9'); await H.drive(run('wspRoundEnd()')); ok(!run('RUN.wsp.alarm'), 'no alarm on the first floor');
  world(0, 9); T.setSides(p, [mkE()]); run('wspWaveStart(9); round = 9'); await H.drive(run('wspRoundEnd()')); ok(!run('RUN.wsp.alarm'), 'and none on a boss wave');
  /* World 2: the tide */
  world(1, 0); p = [mk('sna'), mk('fuja')]; e = [mkE(), mkE()]; e[1].hp = 5000; T.setSides(p, e); run('wspWaveStart(0)'); T.addStatus(p[0], 'burn', 3, .05); p[1].hp = 40;
  run('round = 2'); await H.drive(run('wspRoundEnd()')); ok(!has(p[0], 'soak') && has(p[0], 'burn'), 'no tide on round 2');
  run('round = 3'); await H.drive(run('wspRoundEnd()')); ok([...p, ...e].every(u => has(u, 'soak')) && !has(p[0], 'burn'), 'every 3rd round: everyone Soaked, and Irradiated is washed off');
  ok(p[0].hp < p[0].maxHp && p[1].hp === 40 && e[0].hp < 9000 && e[1].hp === 5000, 'something bites the healthiest fighter on each side');
  /* World 3: the searchlight */
  world(2, 0); p = [mk('sna'), mk('fuja')]; const z = mkE(), z2 = mkE(); T.setSides(p, [z, z2]); run('wspWaveStart(0); wspRoundStart()');
  const lit = p.find(u => has(u, 'wslit')), dark = p.find(u => !has(u, 'wslit')); ok(lit && dark, 'the floodlight settles on one fighter');
  let n = 0; for (let i = 0; i < 200; i++) if (run('foeTarget()') === lit) n++; ok(n > 140, 'enemies go for whoever is Lit (' + n + '/200)');
  T.addStatus(dark, 'taunt', 2, 1); n = 0; for (let i = 0; i < 50; i++) if (run('foeTarget()') === dark) n++; ok(n === 50, 'but a Taunt still wins');
  dark.st = dark.st.filter(s => s.k !== 'taunt'); lit.atk = dark.atk = 20; let dl = 0, dd = 0; for (let i = 0; i < 30; i++) { z.hp = z2.hp = 9000; T.hit(lit, z, 1); T.hit(dark, z2, 1); dl += 9000 - z.hp; dd += 9000 - z2.hp; }
  ok(dl > dd * 1.1, 'the Lit fighter hits harder (' + dl + ' vs ' + dd + ')');
  const first = lit.name; run('round = 2; wspRoundStart()'); ok(p.filter(u => has(u, 'wslit')).length === 1 && p.find(u => has(u, 'wslit')).name !== first, 'and the light moves every round');
  /* World 4: hospitality */
  world(3, 0); p = [mk('sna'), mk('thorn')]; const h = mkE(); T.setSides(p, [h]); run('wspWaveStart(0)'); p.forEach(u => u.hp = 50);
  for (let r = 2; r <= 3; r++) { run('round = ' + (r - 1)); T.hit(p[0], h, .1); run('round = ' + r + '; wspRoundStart()'); }
  ok(p[0].hp > 50 && p[1].hp > 50, 'tea: everyone heals a little every round');
  ok(!p[0].wsComfy && p[1].wsComfy === 2 && has(p[1], 'wscomfy'), 'a fighter who did not attack gets Comfortable; one who attacked does not');
  run('round = 3'); T.hit(p[0], h, .1); run('round = 4; wspRoundStart()'); ok(has(p[1], 'stun') && p[1].wsComfy === 0, 'at 3 they are too comfortable and lose a turn');
  /* World 5: the directive */
  world(4, 0); p = [mk('sna'), mk('fuja')]; const d = mkE(), seen = new Set(); T.setSides(p, [d]);
  for (let i = 0; i < 40; i++) { run('wspWaveStart(' + i + ')'); seen.add(run('RUN.wsp.dir')); } ok(seen.size === 5, 'five different orders (' + [...seen].join(', ') + ')');
  const dmg = (dir, att, tgt, rnd, who) => { run(`RUN.wsp.dir = '${dir}'; RUN.wsp.who = ${JSON.stringify(who || null)}; round = ${rnd || 1}`); let s = 0; for (let i = 0; i < 40; i++) { tgt.hp = tgt.maxHp; T.hit(att, tgt, 1); s += tgt.maxHp - tgt.hp; } return s; };
  T.setCur(p[0]); const base = dmg('medical', p[0], d), baseE = dmg('medical', d, p[1]);
  ok(dmg('lethal', p[0], d) > base * 1.08 && dmg('lethal', d, p[1]) > baseE * 1.08, 'Lethal Force: both sides hit harder');
  ok(dmg('alive', d, p[1], 1, p[1].name) < baseE * .8 && dmg('alive', d, p[1], 1, p[0].name) > baseE * 1.03, 'Recover Alive: one fighter is spared, the others are not');
  ok(dmg('hold', p[0], d, 1) < base * .92 && dmg('hold', p[0], d, 3) > base * 1.08, 'Hold the Line: tough for 2 rounds, then the line breaks');
  run("RUN.wsp.dir = 'medical'; round = 2"); p[0].hp = 50; d.hp = 5000; run('wspRoundStart()'); ok(p[0].hp > 50 && d.hp > 5000, 'Medical to All Floors: everyone heals, both sides');
  run("RUN.wsp.dir = 'overtime'; round = 2"); d.hp = 9000; run('wspRoundStart()'); ok(d.hp === 9000 - 270, 'Overtime: enemies pay 3% max HP a round');
  /* off where it should be */
  run("CFG.world = 0; CFG.runlen = 'archive'"); ok(!run('wspOn(0)'), 'not in The Archive'); run("CFG.runlen = 'world'; RUN.quest = 'neb'"); ok(!run('wspOn(0)'), 'not in quests');
  run('WSP.on[0] = false; RUN = newRun()'); ok(!run('wspOn(0)'), 'one world can be switched off'); run('WSP.on[0] = true');
  let errs = 0; const P = ['snavo', 'sna', 'eyianix', 'radiant'], xpMap = {}; P.forEach(k => xpMap[k] = 600);
  for (let w = 0; w < 5; w++) for (let i = 0; i < runs; i++) { H.reseed(6000 + w * 10 + i); try { await H.run(P, { world:w, runlen:'world', diff:'Normal', xp:0, xpMap, chips:[], smart:true, story:true, wave:1, foes:[] }); } catch (e2) { errs++; console.log('  W' + (w + 1) + ' run error: ' + String(e2.message).slice(0, 140)); } }
  ok(!errs, (5 * runs) + ' auto-played runs through Worlds 1 to 5 finish with no errors');
  console.log(bad ? `\n${bad} problem(s).` : '\nWorld specials OK.'); process.exit(bad ? 1 : 0);
})();
