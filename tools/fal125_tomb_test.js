#!/usr/bin/env node
'use strict';
/* fal125_tomb_test.js: checks Tomb (0116, Tank, Black Gasoline) and Outposter.M1's Forge (shop character), V261.
   USAGE: node fal125_tomb_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS, soak = run('tbSoak');
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 30; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  const turn = u => { T.addStatus(u, 'stun', 1, 1); return H.drive(run(`(async(u)=>{ try{ await takeTurn(u); }catch(e){ globalThis.__err=String(e); } })`)(u)); };
  run('RUN = newRun()');
  const c = G.CHARACTERS_BY('tomb'); ok(c && c.role === 'Tank' && c.id === '0116' && c.build === 'Gasoline' && c.skills.every(s => S[s]) && S.ult_tomb, 'Tomb exists: Tank, 0116, 3 moves and an ultimate');
  ok(!G.CHARACTERS.some(x => x.key === 'outposter'), 'Outposter is not a fighter');
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  const t = mk('tomb'), al = mk('sna'), e = mkE(), e2 = mkE(); T.setSides([t, al], [e, e2]); T.setCur(t);
  S.tbsplash.run(t, e); ok(soak(e) === 1 && has(e, 'slow'), 'Splash soaks and Slows');
  for (let i = 0; i < 8; i++) S.tbsplash.run(t, e); ok(soak(e) === 5, 'Soak caps at 5');
  let d5 = 0, d0 = 0; for (let i = 0; i < 30; i++) { e.hp = 9000; e2.hp = 9000; T.hit(al, e, 1); T.hit(al, e2, 1); d5 += 9000 - e.hp; d0 += 9000 - e2.hp; }
  ok(d5 > d0 * 1.2, 'Soaked enemies take more damage from everyone (' + d5 + ' vs ' + d0 + ')');
  S.tbpool.run(t); ok(has(t, 'taunt') && has(t, 'tbpool'), 'Gasoline Pool taunts');
  T.setCur(e2); let p1 = 0, p0 = 0, slips = 0;
  for (let i = 0; i < 40; i++) { t.hp = t.maxHp; e2.st = e2.st.filter(s => s.k !== 'stun'); T.hit(e2, t, 1); p1 += t.maxHp - t.hp; if (has(e2, 'stun')) slips++; }
  ok(soak(e2) === 5, 'every enemy that hits him in the pool gets Soaked');
  ok(slips > 2 && slips < 20, 'and sometimes slips and loses its turn (' + slips + '/40)');
  t.st = t.st.filter(s => s.k !== 'tbpool'); for (let i = 0; i < 40; i++) { t.hp = t.maxHp; T.hit(e2, t, 1); p0 += t.maxHp - t.hp; }
  ok(p1 < p0 * .9, 'he takes less damage in the pool (' + p1 + ' vs ' + p0 + ')');
  t.hp = t.maxHp; T.damage(t, 50, 'fire'); T.addStatus(t, 'scorch', 3, .05); ok(t.hp === t.maxHp && !has(t, 'scorch'), 'fire never hurts him');
  T.setCur(t); e.hp = e2.hp = 9000; S.tbignite.run(t); ok(soak(e) === 0 && soak(e2) === 0 && has(e, 'scorch') && e.hp < 9000, 'Light It burns all the Soak and leaves them Burning');
  const f1 = mkE(); T.setSides([t, al], [f1]); T.setCur(t); S.tbsplash.run(t, f1); S.tbsplash.run(t, f1); run('round = 5'); t.tbAuto = 0; const h0 = f1.hp; await turn(t);
  ok(t.tbAuto === 1 && soak(f1) === 0 && f1.hp < h0, 'from round 5 the gasoline lights itself, once a wave');
  ok(run("COUNTER_FIELDS.includes('tbAuto')"), 'and it can happen again next wave');
  const u = mk('tomb'), x = mkE(); T.setSides([u, al], [x]); T.setCur(u); S.ult_tomb.run(u, x); ok(x.hp < 9000 && has(u, 'taunt') && has(x, 'scorch'), 'Just Bone soaks, taunts and lights everything');
  /* Outposter's Forge */
  ok(typeof run('owVisit') === 'function' && run('EMBED.outposter'), 'the Forge and Outposter\'s sprite exist');
  run('RUN = newRun()'); const d = mk('sna'), atk0 = d.atk, hp0 = d.maxHp; run('owForge')(d, 'blade', .08);
  ok(d.owW === 'blade' && Math.abs(d.atk - atk0 * .92) < .01 && d.maxHp === Math.round(hp0 * .92) && run('RUN.owForged.sna') === 'blade', 'forging trades 8% of ATK, DEF and max HP for the weapon');
  const z1 = mkE(), z2 = mkE(), plain = mk('sna'); T.setSides([d, plain], [z1, z2]);
  let wb = 0, wp = 0; for (let i = 0; i < 40; i++) { z1.hp = z2.hp = 9000; T.hit(d, z1, 1); wb += 9000 - z1.hp; T.hit(plain, z2, 1); wp += 9000 - z2.hp; }
  ok(wb > wp * 1.08, 'Contracted Blade: hits harder even after the trade (' + wb + ' vs ' + wp + ')');
  const cl = mk('sna'); cl.owW = 'cleaver'; const y1 = mkE(), y2 = mkE(); T.setSides([cl, plain], [y1, y2]); T.hit(cl, y1, 1); ok(y2.hp < 9000, 'Chain Cleaver also hits another enemy');
  const tk = mk('sna'); tk.owW = 'spikes'; const s1 = mkE(); T.setSides([tk, plain], [s1]); T.setCur(s1); T.hit(s1, tk, 1); ok(s1.hp < 9000, 'Spiked Shell sends damage back');
  const pairs = ['blade','cleaver','hook','plate','spikes','anchor','saw','scalpel','pump']; ok(pairs.every(k => run('OW_ALL').some(w => w.k === k)), 'nine weapons, three per role');
  /* a full visit, answers picked at random by the test harness */
  run('RUN = newRun()'); const v = mk('sna'), w = mk('fuja'); T.setSides([v, w], [mkE()]); let er = '';
  for (let i = 0; i < 12; i++) { v.owW = w.owW = undefined; try { await H.drive(run('owVisit()')); } catch (e3) { er = String(e3); } }
  ok(!er, 'the Forge visit runs without errors' + (er ? ' ' + er : ''));
  ok(!run('globalThis.__err'), 'no errors during turns');
  console.log(bad ? `\n${bad} problem(s).` : '\nTomb and the Forge OK.'); process.exit(bad ? 1 : 0);
})();
