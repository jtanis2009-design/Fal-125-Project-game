#!/usr/bin/env node
'use strict';
/* fal125_ringer_test.js: checks V273, The Experimental Ringer (preview world) and its world rule, the Bell.
   USAGE: node fal125_ringer_test.js [--html game.html] [--runs 2] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), opt = k => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : null; }, html = findHtml(opt('html')), runs = +(opt('runs') || 2);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 7 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k);
  const W = run('RGW'), WD = G.WORLD_DATA[W];
  ok(WD && WD.preview && WD.ringer && WD.name === 'The Experimental Ringer', 'the Ringer is the last world in the list');
  ok(WD.floors.length === 5 && WD.bosses.length === 5, '5 floors and 5 floor bosses');
  ok(W >= 8 && G.WORLD_DATA.slice(0, 8).every(w => !w.ringer) && G.WORLD_DATA[0].name === 'Containment Facility' && G.WORLD_DATA[1].name === 'Sewer Network', 'no old world was moved');
  const keys = Object.keys(WD.unlock);
  ok(keys.length === 18 && keys.every(k => G.ENEMIES[k] && run('COST')[k] != null && !G.ENEMIES[k].boss), '18 enemies, each with a cost');
  ok(WD.bosses.every(k => G.ENEMIES[k] && G.ENEMIES[k].boss) && G.ENEMIES.rgapex.final && run('FINAL_GUARDS.rgapex.length') === 3, 'bosses exist; the Apex is a final boss with guards');
  const all = [...keys, ...WD.bosses, 'rgchick'];
  ok(all.every(k => typeof G.ENEMIES[k].intent === 'function' && typeof G.ENEMIES[k].ai === 'function' && run('ART')[G.ENEMIES[k].spriteKey || k]), 'every Ringer enemy has an intent, a move and a drawing');
  ok(run('worldTag(' + W + ')') === 'Preview' && run('worldTag(0)') === 'World 1', 'it is labelled Preview, other worlds keep their names');
  ok(run('worldOpen(' + W + ')'), 'the preview world is always open');
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  const mkE = (k, hp) => { const f = T.makeUnit(G.ENEMIES[k], 'enemy'); if (hp) f.maxHp = f.hp = hp; return f; };
  const world = () => run(`CFG.world = ${W}; CFG.runlen = 'world'; RUN = newRun(); wave = 0; round = 1;`);
  /* the bell */
  world(); ok(run('rgOn()'), 'the Bell is on in the Ringer'); run('CFG.world = 0'); ok(!run('rgOn()'), 'and off everywhere else'); world();
  let p = [mk('sna'), mk('fuja')], e = [mkE('rgcitizen', 9000), mkE('rgcat', 9000)]; T.setSides(p, e); run('rgCollarAll()');
  ok(e.every(f => f.rgCollar && has(f, 'rgcollar')), 'every enemy is Collared at the start of a wave');
  p[0].hp = 100; run('round = 3'); await H.drive(run('V17.roundEnd()')); ok(p[0].hp === 100 && !run('RUN.rg.rings'), 'no bell on round 3');
  run('round = 4'); await H.drive(run('V17.roundEnd()')); ok(run('RUN.rg.rings') === 1 && p[0].hp !== 100, 'the bell rings on round 4: collared enemies strike, your team heals');
  /* cutting a collar */
  const big = mkE('rgcitizen', 1000); T.setSides(p, [big]); run('rgCollarAll()'); p[0].atk = 200; T.setCur(p[0]); T.hit(p[0], big, 3);
  ok(big.rgWild && !big.rgCollar && has(big, 'rgwild') && has(big, 'atkUp'), 'one hard hit (40% of its HP) cuts the collar: it goes Wild with +ATK');
  const sm = mkE('rgcitizen', 99999); T.setSides(p, [sm]); run('rgCollarAll()'); T.hit(p[0], sm, .01); ok(sm.rgCollar, 'a small hit does not cut it');
  T.addStatus(sm, 'stun', 1, 1); ok(sm.rgWild && !sm.rgCollar, 'a stun cuts it too');
  const bs = T.makeUnit(G.ENEMIES.rgcaptain, 'enemy'); T.setSides(p, [bs]); run('rgCollarAll()'); ok(!bs.rgCollar, 'bosses are not collared');
  /* wild: sometimes lashes out at its own side */
  const wl = mkE('rgcitizen', 99999), vic = mkE('rgcat', 99999); wl.atk = 30; T.setSides([mk('sna')], [wl, vic]); run('rgCollarAll()'); T.addStatus(wl, 'stun', 1, 1); wl.st = wl.st.filter(s => s.k !== 'stun'); vic.hp = vic.maxHp;
  let hits = 0; for (let i = 0; i < 200; i++) { vic.hp = vic.maxHp; T.hit(wl, party0(), 1); if (vic.hp < vic.maxHp) hits++; } function party0() { return run('party[0]'); }
  ok(hits > 40 && hits < 110, 'a Wild enemy attacks its own side now and then (' + hits + '/200)');
  /* the bell can be rung early */
  world(); p = [mk('sna')]; T.setSides(p, [mkE('rgusher', 9000)]); run('rgCollarAll(); rgS().early = true; round = 1'); await H.drive(run('V17.roundEnd()')); ok(run('RUN.rg.rings') === 1 && !run('RUN.rg.early'), 'an Usher or Herald rings it early, once');
  /* some individual moves */
  world(); const t1 = mk('sna'); T.setSides([t1], [mkE('rgharvester', 9000)]); T.addStatus(t1, 'defUp', 3, .3); const hv = run('foes[0]'); G.ENEMIES.rgharvester.ai(hv); ok(!has(t1, 'defUp'), 'the Harvester strips a buff');
  const dm = mkE('rgram', 9000); T.setSides([mk('sna')], [dm]); G.ENEMIES.rgram.ai(dm); G.ENEMIES.rgram.ai(dm); ok(has(dm, 'stun'), 'the Dome Ram stuns itself after its head-butt');
  const eg = mkE('rgeggs', 9000); T.setSides([mk('sna')], [eg]); for (let i = 0; i < 3; i++) G.ENEMIES.rgeggs.ai(eg); ok(run('foes.length') === 2, 'the Egg Rack hatches a chick every 3rd turn');
  const cl = mkE('rgcleaner', 9000), z = mkE('rgcat', 9000); T.setSides([mk('sna')], [cl, z]); T.addStatus(z, 'slow', 2, .3); G.ENEMIES.rgcleaner.ai(cl); ok(!has(z, 'slow'), 'the Floor Cleaner cleanses an ally');
  /* full auto-played runs */
  let errs = 0; const P = ['snavo', 'sna', 'eyianix', 'radiant'], xpMap = {}; P.forEach(k => xpMap[k] = 600);
  for (let i = 0; i < runs; i++) { H.reseed(7000 + i); try { await H.run(P, { world:W, runlen:'world', diff:'Normal', xp:0, xpMap, chips:[], smart:true, story:false, wave:1, foes:[] }); } catch (e2) { errs++; console.log('  run error: ' + String(e2.message).slice(0, 160)); } }
  ok(!errs, runs + ' auto-played full Ringer runs finish with no errors');
  console.log(bad ? `\n${bad} problem(s).` : '\nThe Experimental Ringer OK.'); process.exit(bad ? 1 : 0);
})();
