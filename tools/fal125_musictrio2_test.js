#!/usr/bin/env node
'use strict';
/* fal125_musictrio2_test.js: checks Music trio.v2 as reworked in V300: Tape-21 (0137, Damage), Luv-4 (0138, Healer) and Skatebored (0139, Tank).
   Keys stay dethtech, izumi and anhero (from V298) so saves keep their progress.
   USAGE: node fal125_musictrio2_test.js [--html game.html] [--runs 2] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null), i1 = a.indexOf('--runs'), runs = i1 >= 0 ? +a[i1 + 1] : 2;
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = 'husk';
  const mkE = (hp) => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek]), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 30; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  run('RUN = newRun(); round = 1');
  const want = [['dethtech', 'Tape-21', 'Damage', '0137', 'Plague', 'Virtual'], ['izumi', 'Luv-4', 'Healer', '0138', 'Warden', 'Anomaly'], ['anhero', 'Skatebored', 'Tank', '0139', 'Guardian', 'Human']];
  want.forEach(([k, n, r, id, b, ty]) => { const c = G.CHARACTERS_BY(k); ok(c && c.name === n && c.role === r && c.id === id && c.build === b && c.type === ty && c.skills.every(s => S[s]) && S['ult_' + k], `${n}: ${r}, ${id}, ${b}, ${ty}, 3 moves and an ultimate`); });
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  ok(want.every(([k]) => run(`IDENT.${k} && PARTY_QUIPS.${k}.length === 2 && STORY_EXTRA.${k} && RL.${k}.length === 2 && ARC_LORE.${k}.length === 6 && MAST_TEXT.${k} && SKIN_DEFS.${k}.length === 2`)), 'identity, quips, story lines, recruit scenes, Archive, Mastery and 2 skins for all three');
  ok(['dth', 'izm', 'anh'].every(p => [1, 2, 3].every(n => run(`!!CHIP['${p}${n}']`))), 'nine chips are defined');
  ok(run("['skMis','lvSaved'].every(k => COUNTER_FIELDS.includes(k))"), 'Misery and Dying For You reset every wave');
  /* TAPE-21 */
  const d = mk('dethtech'), al = mk('sna'), e1 = mkE(), e2 = mkE(); T.setSides([d, al], [e1, e2]); T.setCur(d);
  S.tpshot.run(d, e1); ok((e1.hp < 9000 || e2.hp < 9000) && has(d, 'soak'), 'Shot in the Dark hits an enemy and Soaks him');
  S.tpsick.run(d, e1); ok(has(d, 'venom') && has(d, 'burn'), 'Still Sick! gives him Venom and Burn');
  const dmgWith = n => { const q = mk('dethtech'), w = mkE(); q.atk = 20; T.setSides([q, al], [w]); T.setCur(q); q.st = []; ['slow', 'venom', 'soak', 'mark', 'bleed', 'burn'].slice(0, n).forEach(k => T.addStatus(q, k, 5, .01)); let s = 0; for (let i = 0; i < 20; i++) { w.hp = 9000; T.hit(q, w, 1); s += 9000 - w.hp; } return s; };
  ok(dmgWith(3) > dmgWith(0) * 1.2, 'Still Sick!: more bad statuses on him, harder hits (' + dmgWith(3) + ' vs ' + dmgWith(0) + ')');
  ok(!!S.tppave.can(mk('dethtech')), 'The Pavement needs a bad status on him');
  const p1 = mk('dethtech'), pt = mkE(); T.setSides([p1, al], [pt]); T.setCur(p1); T.addStatus(p1, 'venom', 3, .03); T.addStatus(p1, 'slow', 3, .2); S.tppave.run(p1, pt);
  ok(has(pt, 'venom') && has(pt, 'slow') && !has(p1, 'venom') && !has(p1, 'slow') && pt.hp < 9000, 'The Pavement throws his statuses onto the enemy and hits it');
  const u1 = mk('dethtech'), x1 = mkE(), x2 = mkE(); T.setSides([u1, al], [x1, x2]); T.setCur(u1); T.addStatus(u1, 'venom', 3, .03); S.ult_dethtech.run(u1); ok(x1.hp < 9000 && has(x2, 'venom') && has(u1, 'venom'), 'ngmi: every enemy hit and given his statuses, he keeps his');
  /* LUV-4 */
  const z = mk('izumi'), za = mk('sna'), zb = mk('fuja'), ze = mkE(); T.setSides([z, za, zb], [ze]); T.setCur(z);
  za.hp = Math.round(za.maxHp * .4); const za0 = za.hp; S.lvbite.run(z, ze); ok(ze.hp < 9000 && za.hp > za0, 'Emo Vampires Near You!: bites and heals the most hurt ally');
  const hb = () => { const q = mk('sna'); q.hp = Math.round(q.maxHp * .3); const h0 = q.hp; T.setSides([z, q], [ze]); S.lvheart.run(z, q); return q.hp - h0; };
  const aliveHeal = hb(); S.lvdoa.run(z); ok(z.lvDead && has(z, 'hidden'), 'Dead or Alive: she goes Dead and Hidden');
  ok(!!S.lvbite.can(z), 'she cannot bite while Dead');
  const deadHeal = hb(); ok(deadHeal > aliveHeal * 1.4, 'she heals much better while Dead (' + deadHeal + ' vs ' + aliveHeal + ')');
  const tq = mk('sna'); tq.hp = Math.round(tq.maxHp * .5); T.setSides([z, tq], [ze]); const tq0 = tq.hp; z.lvT = 1; try { await H.drive(run('(u => takeTurn(u))')(z)); } catch (e) {} ok(tq.hp > tq0 && !z.lvDead, 'while Dead the team heals at the start of her turn, and she comes back when her turns run out');
  const zr = mk('izumi'), zs = mk('sna'); T.setSides([zr, zs], [ze]); T.setCur(zr); S.lvdoa.run(zr); zs.hp = Math.round(zs.maxHp * .5); const zs0 = zs.hp; S.lvdoa.run(zr); ok(!zr.lvDead && zs.hp > zs0, 'coming back early heals the team');
  const zu = mk('izumi'), zv = mk('sna'); zv.hp = Math.round(zv.maxHp * .4); T.addStatus(zv, 'slow', 2, .3); T.setSides([zu, zv], [mkE()]); T.setCur(zu); const zv0 = zv.hp; S.ult_izumi.run(zu); ok(zv.hp > zv0 && !has(zv, 'slow') && zu.lvDead, 'Butterflies Will Fill the Sky Once Again: heals, cleanses, and she goes Dead');
  /* SKATEBORED */
  const sk = mk('anhero'), sa = mk('sna'), sb = mk('fuja'), se = mkE(); se.atk = 30; T.setSides([sk, sa, sb], [se]); T.setCur(sk);
  S.skout.run(sk, se); ok(se.hp < 9000 && has(sk, 'taunt'), 'Out To Lunch hits and Taunts');
  T.setCur(se); sa.hp = sa.maxHp; T.hit(se, sa, .3); ok(sk.skMis === 1, 'Misery grows when an ally takes a hit');
  T.setCur(sk); T.addStatus(sb, 'venom', 3, .03); S.skroll.run(sk, sb); ok(has(sb, 'skcover') && !has(sb, 'venom'), 'Wasted Youth covers an ally and knocks a bad status off');
  const sb0 = sb.hp, sk0 = sk.hp; T.setCur(se); T.hit(se, sb, 1); ok(sb.hp === sb0 && sk.hp < sk0, 'single attacks on a covered ally go to him');
  const s2 = mk('anhero'), m1 = mk('sna'), m2 = mk('fuja'); T.setSides([s2, m1, m2], [mkE()]); s2.skMis = 4; s2.hp = Math.round(s2.maxHp * .4); const s20 = s2.hp; T.setCur(s2); S.sksick.run(s2);
  ok(s2.hp > s20 && s2.skMis === 0 && has(s2, 'taunt') && has(m1, 'defUp') && has(m2, 'defUp'), 'Sick Of It spends Misery: heals, Taunts and gives the team DEF');
  const vt = v => { const q = mk('anhero'), w = mkE(); T.setSides([q], [w]); T.setCur(w); let s = 0; for (let i = 0; i < 20; i++) { q.skMis = v; q.hp = q.maxHp; T.hit(w, q, 1); s += q.maxHp - q.hp; } return s; };
  ok(vt(6) < vt(0), 'Misery makes him harder to hurt (' + vt(6) + ' vs ' + vt(0) + ')');
  const s3 = mk('anhero'), y1 = mkE(), y2 = mkE(), ya = mk('sna'); T.setSides([s3, ya], [y1, y2]); T.setCur(s3); S.ult_anhero.run(s3); ok(y1.hp < 9000 && y2.hp < 9000 && has(ya, 'guard') && s3.skMis === 6, 'For The Hell Of It: every enemy hit, team Guard, full Misery');
  /* the trio bond */
  const sum = mate => { const q = mk('dethtech'), w = mkE(); q.atk = 20; T.setSides([q, mk(mate)], [w]); T.setCur(q); let s = 0; for (let i = 0; i < 30; i++) { w.hp = 9000; T.hit(q, w, 1); s += 9000 - w.hp; } return s; };
  ok(sum('izumi') > sum('sna'), 'Music trio.v2: they hit harder together');
  /* auto-play */
  let errs = 0; const P = ['dethtech', 'izumi', 'anhero', 'fuja'], xpMap = {}; P.forEach(k => xpMap[k] = 600);
  for (let i = 0; i < runs; i++) { H.reseed(9800 + i); try { await H.run(P, { world:0, runlen:'world', diff:'Normal', xp:0, xpMap, chips:[], smart:true, story:true, wave:1, foes:[] }); } catch (e2) { errs++; console.log('  run error: ' + String(e2.message).slice(0, 160)); } }
  ok(!errs, runs + ' auto-played full runs with all three finish with no errors');
  console.log(bad ? `\n${bad} problem(s).` : '\nMusic trio.v2 (Tape-21, Luv-4, Skatebored) OK.'); process.exit(bad ? 1 : 0);
})();
