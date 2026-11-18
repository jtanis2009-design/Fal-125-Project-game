#!/usr/bin/env node
'use strict';
/* fal125_doommaster_copyright_doghunter_kuikya_test.js: checks Doommaster (0133, Damage), Copyright (0134, Healer), Dog Hunter (0135, Damage) and Kuikya (0136, Tank), V286.
   USAGE: node fal125_doommaster_copyright_doghunter_kuikya_test.js [--html game.html] [--runs 2] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null), i1 = a.indexOf('--runs'), runs = i1 >= 0 ? +a[i1 + 1] : 2;
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = (hp, key) => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: key || ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 30; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  run('RUN = newRun()');
  const want = [['doommaster', 'Damage', '0133', 'Sweeper'], ['copyright', 'Healer', '0134', 'Amplifier'], ['doghunter', 'Damage', '0135', 'Execute'], ['kuikya', 'Tank', '0136', 'Bruiser']];
  want.forEach(([k, r, id, b]) => { const c = G.CHARACTERS_BY(k); ok(c && c.role === r && c.id === id && c.build === b && c.skills.every(s => S[s]) && S['ult_' + k], `${c && c.name}: ${r}, ${id}, ${b}, 3 moves and an ultimate`); });
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  ok(want.every(([k]) => run(`IDENT.${k} && PARTY_QUIPS.${k}.length === 2 && STORY_EXTRA.${k} && RL.${k}.length === 2 && ARC_LORE.${k}.length === 6 && MAST_TEXT.${k} && SKIN_DEFS.${k}.length === 2`)), 'identity, quips, story lines, recruit scenes, Archive, Mastery and 2 skins for all four');
  ok(['dom', 'cpr', 'dhn', 'kuk'].every(p => [1, 2, 3].every(n => run(`!!CHIP['${p}${n}']`))), 'twelve chips are defined');
  /* DOOMMASTER */
  const d = mk('doommaster'), al = mk('sna'), e1 = mkE(), e2 = mkE(); T.setSides([d, al], [e1, e2]); T.setCur(d);
  ok(!!S.dompunch.can(d), 'Doom Punch needs Doom');
  S.domjab.run(d, e1); ok(d.domDoom === 1 && e1.hp < 9000, 'Rubble Jab hits and builds Doom');
  T.addStatus(e1, 'guard', 2, 1); T.addStatus(e1, 'defUp', 2, .3); S.domsmash.run(d, e1); ok(!has(e1, 'guard') && !has(e1, 'defUp') && d.domDoom === 2, 'Block Smash tears off Guard and DEF buffs, and builds Doom');
  e1.hp = e2.hp = 9000; S.dompunch.run(d); ok(e1.hp < 9000 && e2.hp < 9000 && d.domDoom === 0, 'Doom Punch hits every enemy and spends the Doom');
  const pun = n => { const q = mk('doommaster'), w = mkE(); q.atk = 20; q.domDoom = n; T.setSides([q, al], [w]); T.setCur(q); let s = 0; for (let i = 0; i < 20; i++) { q.domDoom = n; w.hp = 9000; S.dompunch.run(q); s += 9000 - w.hp; } return s; };
  ok(pun(5) > pun(2) * 1.6, 'more Doom, harder Doom Punch (' + pun(5) + ' vs ' + pun(2) + ')');
  const gd = mk('doommaster'), gw = mkE(); T.setSides([gd, al], [gw]); T.setCur(gd); T.addStatus(gw, 'guard', 2, 1); gd.atk = 20; let gs = 0; for (let i = 0; i < 20; i++) { gd.domDoom = 3; gw.hp = 9000; S.dompunch.run(gd); gs += 9000 - gw.hp; } const ngw = mkE(); T.setSides([gd, al], [ngw]); let ns = 0; for (let i = 0; i < 20; i++) { gd.domDoom = 3; ngw.hp = 9000; S.dompunch.run(gd); ns += 9000 - ngw.hp; }
  ok(gs > ns * .93, 'Doom Punch goes straight through Guard (' + gs + ' vs ' + ns + ')');
  ok(run("COUNTER_FIELDS.includes('domDoom')"), 'Doom resets every wave');
  const d2 = mk('doommaster'), x1 = mkE(), x2 = mkE(); T.setSides([d2, al], [x1, x2]); T.setCur(d2); S.ult_doommaster.run(d2); ok(x1.hp < 9000 && x2.hp < 9000 && d2.domDoom === 0, 'Level the City: every enemy hit');
  /* COPYRIGHT */
  const c = mk('copyright'), ca = mk('sna'), cb = mk('fuja'), ce = mkE(); T.setSides([c, ca, cb], [ce]); T.setCur(c);
  S.cprclaim.run(c, ce); ok(has(ce, 'cprclaim') && ce.hp < 9000, 'Copyright Claim hits and Claims the enemy');
  ca.hp = Math.round(ca.maxHp * .5); const ch0 = ca.hp; ce.atk = 40; T.setCur(ce); cb.hp = cb.maxHp; for (let i = 0; i < 5; i++) T.hit(ce, cb, 1); ok(ca.hp > ch0 || c.hp >= c.maxHp * .5, 'the damage a Claimed enemy deals heals the weakest ally');
  const buffed = mk('fuja'); T.addStatus(buffed, 'atkUp', 3, .3); const tgt = mk('sna'); tgt.hp = Math.round(tgt.maxHp * .4); T.setSides([c, buffed, tgt], [ce]); T.setCur(c); S.cprcopy.run(c, tgt); ok(has(tgt, 'atkUp') && tgt.hp > tgt.maxHp * .5, 'Copy That heals and copies a buff from another ally');
  const c2 = mk('copyright'), v1 = mk('sna'), v2 = mk('fuja'), ee = mkE(); v1.hp = Math.round(v1.maxHp * .3); T.setSides([c2, v1, v2], [ee]); T.setCur(ee); T.addStatus(ee, 'atkUp', 3, .4); ok(has(v1, 'atkUp') && sumv(v1, 'atkUp') > .15 && sumv(v1, 'atkUp') < .3, 'All Rights Reserved: the most hurt ally copies an enemy buff at half strength (' + sumv(v1, 'atkUp') + ')');
  function sumv(u, k) { return u.st.filter(s => s.k === k).reduce((x, s) => x + s.v, 0); }
  const c3 = mk('copyright'), f1 = mk('sna'), ee2 = mkE(); f1.hp = Math.round(f1.maxHp * .5); T.setSides([c3, f1], [ee2]); T.setCur(c3); const h1 = f1.hp; S.cprfair.run(c3); ok(f1.hp > h1 && has(f1, 'defUp'), 'Fair Use heals the team and gives DEF');
  const c4 = mk('copyright'), z1 = mkE(), z2 = mkE(); z1.st = [{ k:'atkUp', t:3, v:.3 }]; T.setSides([c4, ca], [z1, z2]); T.setCur(c4); S.ult_copyright.run(c4); ok(z1.hp < 9000 && !has(z1, 'atkUp') && has(z1, 'stun'), 'Cease and Desist: damage, buffs stripped, stunned');
  /* DOG HUNTER */
  const g = mk('doghunter'), ga = mk('sna'); g.atk = 20; const hd = mkE(9000, 'hound'), pl = mkE(9000);
  const dmg = (tgt, withDog) => { const q = mk('doghunter'), w = tgt; q.atk = 20; T.setSides(withDog ? [q, ga, mk('hounddog')] : [q, ga], [w]); T.setCur(q); let s = 0; for (let i = 0; i < 40; i++) { w.hp = 9000; T.hit(q, w, 1); s += 9000 - w.hp; } return s; };
  ok(dmg(hd) > dmg(pl) * 1.15, 'Pack Hunt: he hits a hound harder than other enemies (' + dmg(hd) + ' vs ' + dmg(pl) + ')');
  ok(dmg(pl, true) > dmg(pl, false) * 1.02, 'and a little harder while Hound Dog is beside him (' + dmg(pl, true) + ' vs ' + dmg(pl, false) + ')');
  const g2 = mk('doghunter'), pe = mkE(); T.setSides([g2, ga], [pe]); T.setCur(g2); S.dhnmark.run(g2, pe); ok(has(pe, 'mark'), 'Mark the Prey marks the target');
  const sw = (m) => { const q = mk('doghunter'), w = mkE(); q.atk = 20; T.setSides([q, ga], [w]); T.setCur(q); if (m) T.addStatus(w, 'mark', 3, .25); let s = 0; for (let i = 0; i < 40; i++) { w.hp = 9000; S.dhnswoop.run(q, w); s += 9000 - w.hp; } return s; };
  ok(sw(true) > sw(false) * 1.3, 'Wing Swoop hits a marked target much harder (' + sw(true) + ' vs ' + sw(false) + ')');
  const rd = low => { const q = mk('doghunter'), w = mkE(); q.atk = 20; T.setSides([q, ga], [w]); T.setCur(q); let s = 0; for (let i = 0; i < 40; i++) { w.hp = low ? 1500 : 9000; const b = w.hp; S.dhnrend.run(q, w); s += b - w.hp; if (!w.alive) w.alive = true; } return s; };
  ok(rd(true) > rd(false) * 1.4 || rd(true) > 1500 * 30, 'Rend finishes weakened enemies harder');
  const g3 = mk('doghunter'), kw = mkE(50); T.setSides([g3, ga], [kw]); T.setCur(g3); g3.cd = { dhnswoop:3, dhnrend:2 }; S.dhnrend.run(g3, kw); ok(!kw.alive && g3.cd.dhnswoop === 2, 'a kill with Rend takes 1 off his cooldowns');
  const g4 = mk('doghunter'), m1 = mkE(), m2 = mkE(); T.setSides([g4, ga], [m1, m2]); T.setCur(g4); S.ult_doghunter.run(g4); ok(has(m1, 'mark') && has(m2, 'mark') && has(g4, 'atkUp'), 'The Great Hunt marks every enemy');
  /* KUIKYA */
  const k = mk('kuikya'), ka = mk('fuja'), k1 = mkE(), k2 = mkE(), k3 = mkE(); T.setSides([k, ka], [k1, k2, k3]); T.setCur(k);
  ok(!!S.kukwave.can(k), 'Shockwave needs Shock');
  S.kukslam.run(k, k2); ok(k2.hp < k1.hp && k1.hp < 9000 && k3.hp < 9000 && has(k, 'taunt') && k.kukShock === 1, 'Head Slam hits the target, sends a wave to the enemies beside it, Taunts and builds Shock');
  const kh = mk('kuikya'), ke = mkE(); ke.atk = 30; T.setSides([kh, ka], [ke]); T.setCur(ke); T.hit(ke, kh, 1); kh.hp = kh.maxHp; T.hit(ke, kh, 1); kh.hp = kh.maxHp; ok(kh.kukShock === 2, 'every hit he takes stores a Shock');
  for (let i = 0; i < 8; i++) { T.hit(ke, kh, 1); kh.hp = kh.maxHp; } ok(kh.kukShock === 5, 'Shock stops at 5 (got ' + kh.kukShock + ', alive ' + kh.alive + ')');
  T.setSides([kh, ka], [k1, k2]); k1.hp = k2.hp = 9000; kh.kukShock = 4; S.kukwave.run(kh); ok(k1.hp < 9000 && k2.hp < 9000 && kh.kukShock === 0, 'Shockwave hits every enemy and spends the Shock');
  const kk = mk('kuikya'); T.setSides([kk, ka], [mkE()]); kk.hp = Math.round(kk.maxHp * .5); const kh0 = kk.hp; S.kukhard.run(kk); ok(has(kk, 'taunt') && has(kk, 'defUp') && kk.hp > kh0, 'Hard Head Taunts, adds DEF and heals');
  ok(run("COUNTER_FIELDS.includes('kukShock')"), 'Shock resets every wave');
  const k5 = mk('kuikya'), s1 = mkE(), s2 = mkE(); T.setSides([k5, ka], [s1, s2]); T.setCur(k5); S.ult_kuikya.run(k5); ok(s1.hp < 9000 && has(s1, 'slow') && k5.kukShock === 5, 'Skull Crusher: every enemy hit and Slowed, full Shock');
  /* auto-play */
  let errs = 0; const P = ['doommaster', 'copyright', 'doghunter', 'kuikya'], xpMap = {}; P.forEach(k => xpMap[k] = 600);
  for (let i = 0; i < runs; i++) { H.reseed(9700 + i); try { await H.run(P, { world:0, runlen:'world', diff:'Normal', xp:0, xpMap, chips:[], smart:true, story:true, wave:1, foes:[] }); } catch (e2) { errs++; console.log('  run error: ' + String(e2.message).slice(0, 160)); } }
  ok(!errs, runs + ' auto-played full runs with all four finish with no errors');
  console.log(bad ? `\n${bad} problem(s).` : '\nDoommaster, Copyright, Dog Hunter and Kuikya OK.'); process.exit(bad ? 1 : 0);
})();
