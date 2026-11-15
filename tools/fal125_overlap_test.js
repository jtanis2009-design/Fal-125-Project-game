#!/usr/bin/env node
'use strict';
/* fal125_overlap_test.js: checks the V271 reworks that stop five healers playing like their twins: Tearwing, Inkating, Ghost, Thorn
   (Blackbird's changed move is checked in fal125_healers4_test.js). USAGE: node fal125_overlap_test.js [--html game.html] */
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
  run('RUN = newRun(); round = 1;');
  /* Tearwing */
  const tw = mk('tearwing'), al = mk('fuja'), e = mkE(); T.setSides([tw, al], [e]); T.setCur(tw);
  S.twtear.run(tw, e); ok(!tw.tears && has(e, 'bleed') && e.hp < 9000, 'Tearwing: Bleeding Tear is an attack that Bleeds, and gives no Tear');
  al.hp = al.maxHp; S.twwrap.run(tw, al); ok(!tw.tears, 'Bandage Wrap gives no Tear when there was nothing to take off');
  T.addStatus(al, 'slow', 2, .3); S.twwrap.run(tw, al); ok(tw.tears === 1 && !has(al, 'slow'), 'and one Tear when she takes suffering off them');
  T.setCur(e); tw.tears = 0; al.hp = al.maxHp; T.damage(al, Math.round(al.maxHp * .03), 'impact'); ok(!tw.tears, 'a scratch on an ally does not make her cry');
  run('_hitAtt = foes[0]'); T.damage(al, Math.round(al.maxHp * .12), 'impact'); ok(tw.tears === 1, 'a big hit on an ally: +1 Tear');
  const al2 = mk('sna'); T.setSides([tw, al, al2], [e]); run('_hitAtt = foes[0]'); T.damage(al2, 99999, 'impact'); ok(tw.tears === 3, 'an ally falling: +2 Tears');
  al.hp = 40; tw.tears = 3; await turn(tw); ok(al.hp > 40 && tw.tears === 3, 'at the start of her turn her Tears fall on the most hurt ally, and are not used up');
  /* Inkating */
  const ik = mk('inkating'), f1 = mk('fuja'), z = mkE(); T.setSides([ik, f1], [z]); T.setCur(ik); run('_hitAtt = null');
  T.addStatus(z, 'atkUp', 3, .3); S.inksiphon.run(ik, z); ok(!has(z, 'atkUp'), 'Inkating: Ink Siphon rubs a buff off the enemy');
  T.addStatus(z, 'atkUp', 99, .3); S.inksiphon.run(ik, z); ok(has(z, 'atkUp'), 'but not a permanent one');
  f1.hp = f1._ikHp = 100; let g1 = 0, g2 = 0; S.inkredraw.run(ik, f1); g1 = f1.hp - 100; f1._ikHp = 160; f1.hp = 100; S.inkredraw.run(ik, f1); g2 = f1.hp - 100;
  ok(g2 > g1 && g1 > 0, 'Redraw gives back more to an ally who has just been hurt (' + g2 + ' vs ' + g1 + ')');
  T.addStatus(f1, 'venom', 3, .05); T.addStatus(f1, 'atkUp', 3, .2); z.st = []; T.addStatus(z, 'guard', 2, 1); f1.hp = 50; S.inkpage.run(ik);
  ok(!has(f1, 'venom') && has(f1, 'atkUp') && !has(z, 'guard') && f1.hp > 50, 'Fresh Page: bad statuses off the party (their buffs stay), buffs off the enemy, and a heal');
  /* Ghost */
  const gh = mk('ghost_0072'), d = mk('fuja'), y = mkE(); T.setSides([gh, d], [y]); T.setCur(gh);
  S.ghstatic.run(gh, y); ok(has(y, 'ghrec') && !has(y, 'blur') && gh.tapes === 1, 'Ghost: Dead Air records the enemy (no Blur), +1 Tape');
  T.setCur(y); let hr = 0, hn = 0; const y2 = mkE(); T.setSides([gh, d], [y, y2]); for (let i = 0; i < 20; i++) { d.hp = 100; T.hit(y, d, .5); hr += 100 - d.hp; d.hp = 100; T.hit(y2, d, .5); hn += 100 - d.hp; }
  ok(hr < hn - 40, 'a fighter hit by a Recorded enemy gets health back (' + hr + ' vs ' + hn + ' lost)');
  ok(S.ghdead.target === 'ally' && !!S.ghdead.can(Object.assign(gh, { tapes:1 })), 'Dead Media is aimed at one ally and needs 2 Tapes');
  T.setCur(d); run('cur = party[1]; resolveChoice = function(){}; submit({ skill: party[1].skills[0], target: foes[0] }); resolveChoice = null;'); ok(d._lastMv && d._lastMv.k === d.skills[0], 'the game remembers everyone\'s last move');
  T.setCur(gh); gh.tapes = 3; y.hp = 9000; T.addStatus(d, 'slow', 2, .3); S.ghdead.run(gh, d); ok(y.hp < 9000 && gh.tapes === 0 && !has(d, 'slow'), 'Dead Media: the ally is cleansed and does their last move again');
  const d2 = mk('sna'); T.setSides([gh, d2], [y]); gh.tapes = 2; d2.hp = 50; S.ghdead.run(gh, d2); ok(d2.hp > 50, 'an ally who has not moved yet is healed instead');
  /* Thorn */
  const th = mk('thorn'), p = mk('fuja'), x = mkE(); T.setSides([th, p], [x]); T.setCur(th);
  p.hp = 80; S.thwatch.run(th, p); ok(has(p, 'ththorn') && has(p, 'guard') && p.hp > 80, 'Thorn: Hidden Eye heals, Guards and covers the ally in thorns');
  T.setCur(x); const xh = x.hp; p.st = p.st.filter(s => s.k !== 'guard'); p.hp = 120; T.hit(x, p, 1); ok(x.hp < xh, 'whoever hits a thorned ally takes damage back (' + (xh - x.hp) + ')');
  let lt = 0, ln = 0; for (let i = 0; i < 20; i++) { p.hp = 150; T.hit(x, p, .5); lt += 150 - p.hp; } p.st = p.st.filter(s => s.k !== 'ththorn'); for (let i = 0; i < 20; i++) { p.hp = 150; T.hit(x, p, .5); ln += 150 - p.hp; }
  ok(lt < ln, 'and the thorned ally gets some health back each time (' + lt + ' vs ' + ln + ' lost)');
  T.setCur(th); const q = mk('sna'); T.setSides([th, p, q], [x]); S.thrend.run(th); ok([th, p, q].every(u => has(u, 'ththorn') && has(u, 'defUp')), 'Claw Guard: DEF and thorns for the whole party');
  ok(!run('globalThis.__err'), 'no errors during turns');
  console.log(bad ? `\n${bad} problem(s).` : '\nOverlap reworks OK.'); process.exit(bad ? 1 : 0);
})();
