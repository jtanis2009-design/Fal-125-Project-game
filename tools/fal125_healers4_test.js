#!/usr/bin/env node
'use strict';
/* fal125_healers4_test.js: checks the four V259 healers: Tangler (Stringy Body), Bearable (Ticking Clock), Blackbird (Moss) and
   Rainbow Ripper (Rainbow Machine). USAGE: node fal125_healers4_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 20; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  const turn = u => { T.addStatus(u, 'stun', 1, 1); return H.drive(run(`(async(u)=>{ try{ await takeTurn(u); }catch(e){ globalThis.__err=String(e); } })`)(u)); };
  run('RUN = newRun()');
  const want = { tangler:'0111', bearable:'0112', blackbird:'0113', rainbowripper:'0114' };
  for (const k in want) { const c = G.CHARACTERS_BY(k); ok(c && c.role === 'Healer' && c.id === want[k] && c.skills.length === 3 && c.skills.every(s => S[s]) && S['ult_' + k], `${c ? c.name : k}: Healer ${want[k]}, 3 moves and an ultimate`); }
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  ok(['tgBody', 'brTick', 'rrCol', 'bbGrief'].every(f => T.CF.includes(f)), 'clock, colour, string body and grief reset every wave');
  /* Tangler */
  const tg = mk('tangler'), al = mk('sna'), z = mkE(); z.atk = 40; T.setSides([tg, al], [z]);
  T.setCur(tg); al.hp = 50; S.tgstitch.run(tg, al); ok(al.hp > 50 && has(al, 'defUp'), 'Stitch Up heals and gives DEF');
  S.tgtie.run(tg, al); ok(has(al, 'tgtie'), 'Tether ties an ally');
  S.tgtie.run(tg, tg); ok(!has(tg, 'tgtie'), 'Tangler cannot tie itself');
  T.setCur(z); al.hp = al.maxHp; tg.hp = tg.maxHp; tg.tgBody = 1; T.damage(al, 100, 'impact');
  ok(al.maxHp - al.hp === 70 && tg.hp < tg.maxHp, 'a tied ally takes 70%, the rest runs down the string to Tangler (' + (al.maxHp - al.hp) + ')');
  tg.tgBody = 0; tg.hp = tg.maxHp; T.damage(tg, 40, 'impact'); ok(tg.maxHp - tg.hp === 20 && tg.tgBody === 1, 'its string body halves the first big hit of the wave');
  tg.hp = tg.maxHp; T.damage(tg, 40, 'impact'); ok(tg.maxHp - tg.hp === 40, 'but only the first');
  const z2 = mkE(); T.setSides([tg, al], [z2]); T.setCur(tg); al.hp = 50; S.tgtangle.run(tg, z2); ok(z2.hp < 9000 && has(z2, 'slow') && al.hp > 50, 'Tangle hits, Slows, and heals the most hurt ally');
  /* Bearable */
  const br = mk('bearable'), b2 = mk('sna'), y = mkE(); T.setSides([br, b2], [y]);
  await turn(br); await turn(br); await turn(br); ok(br.brTick === 3, 'the clock gains 1 tick each turn (' + br.brTick + ')');
  T.setCur(br); b2.hp = 1; S.brwind.run(br, b2); const w3 = b2.hp - 1; ok(br.brTick === 0 && w3 > 0, 'Wind Down spends every tick to heal');
  b2.hp = 1; S.brwind.run(br, b2); ok(b2.hp - 1 < w3, 'more ticks heal more (' + w3 + ' vs ' + (b2.hp - 1) + ')');
  S.brtick.run(br); ok(br.brTick === 2, 'Tick winds 2 more');
  br.brTick = 12; T.addStatus(b2, 'slow', 3, .3); S.brwind.run(br, b2); ok(!has(b2, 'slow'), 'MIDNIGHT: 12 ticks also cleanse');
  br.brTick = 10; br.hp = br.maxHp; y.hp = 9000; S.bralarm.run(br, y); const big = 9000 - y.hp;
  ok(br.brTick === 0 && br.maxHp - br.hp === Math.round(br.maxHp * .2), 'Alarm spends the ticks and costs 2% HP each');
  br.hp = br.maxHp; y.hp = 9000; S.bralarm.run(br, y); ok(9000 - y.hp < big / 2 && br.hp === br.maxHp, 'and an empty clock is a small free ring (' + big + ' vs ' + (9000 - y.hp) + ')');
  /* Blackbird */
  const bb = mk('blackbird'), c1 = mk('sna'), c2 = mk('snavo'), x = mkE(); T.setSides([bb, c1, c2], [x]); T.setCur(bb);
  S.bbspray.run(bb); ok([bb, c1, c2].every(p => has(p, 'bbmoss')), 'Moss Spray makes everyone Mossy');
  c1.hp = 50; await turn(c1); ok(c1.hp > 50, 'Mossy heals at the start of their turn');
  T.setCur(bb); S.bbinfect.run(bb, x); ok(has(x, 'bbinf'), 'Moss Infection');
  c1.hp = c1.maxHp; bb.hp = bb.maxHp; c2.hp = 50; const xh = x.hp; await turn(x); ok(x.hp <= xh - 450 && c2.hp > 50, 'the infected enemy loses 5% max HP and the most hurt ally heals');
  c1.maxHp = 3000; T.setCur(bb); c1.hp = 1; S.bbwhip.run(bb, x); const f3 = c1.hp - 1; c2.alive = false; c1.hp = 1; S.bbwhip.run(bb, x); const f2 = c1.hp - 1; c2.alive = true; c1.maxHp = c1.hp = 3000;
  ok(f3 > f2, 'Wants Friends: heals more with more allies standing (' + f3 + ' vs ' + f2 + ')');
  const alt = mkE(); alt.alt = true; alt.hp = 5; c1.hp = 50; T.setSides([bb, c1, c2], [alt, mkE()]); bb.bbGrief = 0; T.setCur(c1); T.damage(alt, 99, 'impact');
  ok(bb.bbGrief === 1 && c1.hp > 50, 'it grieves when an alternate falls, and the moss heals the team');
  /* Rainbow Ripper */
  const rr = mk('rainbowripper'), d1 = mk('fuja'), v = mkE(); T.setSides([rr, d1], [v]); T.setCur(rr);
  S.rrsteal.run(rr, v); ok(rr.rrCol === 1 && has(v, 'rrgrey'), 'Steal Colour greys the enemy and keeps the colour');
  const g0 = v.st.find(s => s.k === 'rrgrey').v; await turn(v); ok(v.st.find(s => s.k === 'rrgrey').v > g0, 'Grey gets worse every turn');
  const vg = mkE(), vn = mkE(); vg.atk = vn.atk = 30; T.setSides([rr, d1], [vg, vn]); T.addStatus(vg, 'rrgrey', 99, .3);
  let dg = 0, dn = 0; for (let i = 0; i < 30; i++) { d1.hp = d1.maxHp; T.hit(vg, d1, 1); dg += d1.maxHp - d1.hp; d1.hp = d1.maxHp; T.hit(vn, d1, 1); dn += d1.maxHp - d1.hp; }
  ok(dg < dn * .8, 'Grey enemies hit weaker (' + dg + ' vs ' + dn + ')');
  T.setCur(rr); rr.rrCol = 2; d1.hp = 50; S.rrgive.run(rr, d1); ok(rr.rrCol === 1 && has(d1, 'rrvivid') && d1.hp > 50, 'Give Colour spends 1, heals and makes them Colourful');
  S.rrgive.run(rr, d1); ok(has(d1, 'rrcrazy') && !has(d1, 'rrvivid'), 'a second dose makes them Vibrant');
  rr.rrCol = 0; d1.hp = 50; const h0 = d1.hp; S.rrgive.run(rr, d1); ok(d1.hp > h0 && !(rr.rrCol < 0), 'with no colour it still heals a little');
  rr.rrCol = 4; d1.hp = 50; S.rrmachine.run(rr); ok(rr.rrCol === 0 && d1.hp > 50, 'Rainbow Machine spends all colour on the team');
  rr.rrCol = 0; rr.hp = rr.maxHp; T.setSides([rr, d1], [mkE()]); await turn(rr); ok(rr.hp === rr.maxHp - Math.round(rr.maxHp * .02), 'with no colour, the machine costs 2% HP a turn');
  rr.rrCol = 1; rr.hp = rr.maxHp; await turn(rr); ok(rr.hp === rr.maxHp, 'but not when it has colour');
  /* ultimates */
  for (const k of ['tangler', 'bearable', 'blackbird', 'rainbowripper']) { const u = mk(k), p = mk('sna'), e = mkE(); T.setSides([u, p], [e]); T.setCur(u); p.hp = 30; let er = ''; try { S['ult_' + k].run(u, e); } catch (e2) { er = String(e2); } ok(!er && p.hp > 30, G.CHARACTERS_BY(k).name + ' ultimate heals the team' + (er ? ' ' + er : '')); }
  ok(!run('globalThis.__err'), 'no errors during turns');
  console.log(bad ? `\n${bad} problem(s).` : '\nTangler, Bearable, Blackbird and Rainbow Ripper OK.'); process.exit(bad ? 1 : 0);
})();
