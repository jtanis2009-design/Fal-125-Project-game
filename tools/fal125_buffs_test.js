#!/usr/bin/env node
'use strict';
/* fal125_buffs_test.js: checks the V272 buffs for the weakest healers and Sna. USAGE: node fal125_buffs_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb), S = G.SKILLS, B = run('BUFF272');
  const has = (u, k) => u.st.some(s => s.k === k);
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = () => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = 9000; f.atk = 30; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  run('RUN = newRun(); round = 1;');
  const weak = ['sadie', 'bearable', 'vendor', 'stillborn', 'velara', 'sevalio', 'proto_0066', 'hush', 'serpentine', 'seam', 'moon'];
  ok(weak.every(k => B[k] && B[k].heal > 1 && G.CHARACTERS_BY(k).role === 'Healer'), weak.length + ' weak healers have a stronger heal');
  ok(['wugang', 'iris', 'maw', 'parda', 'goodbye', 'eyianix'].every(k => !B[k]), 'nobody strong was touched');
  const sn = G.CHARACTERS_BY('sna'); ok(sn.hp === 180 && sn.def === 14, 'Sna: 180 HP and 14 DEF (were 150 and 11)');
  const s = mk('sna'), e = mkE(); T.setSides([s, mk('fuja')], [e]); T.setCur(s);
  S.constrict.run(s, e); ok(has(s, 'taunt') && has(e, 'slow'), 'Constrict Slows and makes Sna Taunt');
  s.st = []; S.skin.run(s); ok(has(s, 'taunt') && S.skin.cd === 3, 'Shared Skin makes him Taunt and comes back after 3 turns');
  s.hp = 50; S.claws.run(s, e); ok(s.hp > 50, 'Symbiote Claws heals him');
  const sa = mk('sadie'), f = mk('fuja'); T.setSides([sa, f], [mkE()]); T.setCur(sa); f.hp = 1; S.sdlure.run(sa, f); const g1 = f.hp - 1;
  run('BUFF272.sadie.heal = 1'); f.hp = 1; S.sdlure.run(sa, f); const g0 = f.hp - 1; run('BUFF272.sadie.heal = ' + B.sadie.heal);
  ok(g1 > g0 * 1.3, 'Sadie heals more with the buff (' + g1 + ' vs ' + g0 + ')');
  ok(S.sdbark.cd === 2 && S.svstitch.cd === 2 && S.vdbogo.cd === 1 && S.vdsale.cd === 3 && S.smpatch.cd === 3 && S.sttether.cd === 1, 'shorter cooldowns are in');
  const v = mk('vendor'); T.setSides([v, f], [mkE()]); T.setCur(v); v.meter = 3; S.vdsale.run(v); ok(has(f, 'atkUp'), 'Clearance Sale gives the team +ATK');
  const sm = mk('seam'), z = mkE(); T.setSides([sm, f], [z]); T.setCur(sm); S.smstitch.run(sm, z); ok(z.hp < 9000 && /1\.0x/.test(S.smstitch.desc), 'Seam\'s Checker Lash is 1.0x');
  let errs = 0; const P = ['sadie', 'vendor', 'sna', 'fuja'], xp = {}; P.forEach(k => xp[k] = 0);
  for (let i = 0; i < 2; i++) { H.reseed(4400 + i); try { await H.run(P, { world:1, runlen:'world', diff:'Normal', xp:0, xpMap:xp, chips:[], smart:true, story:true, wave:1, foes:[] }); } catch (e2) { errs++; console.log('  run error ' + String(e2.message).slice(0, 120)); } }
  ok(!errs, 'two auto-played runs with Sadie, The Vendor and Sna finish with no errors');
  console.log(bad ? `\n${bad} problem(s).` : '\nBuffs OK.'); process.exit(bad ? 1 : 0);
})();
