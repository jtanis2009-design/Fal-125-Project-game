#!/usr/bin/env node
'use strict';
/* fal125_gutter_test.js: checks Gutter (V241): the Arsenal (kills become weapons that do what the enemy did), Put In, Take Out, Swallow and Spit.
   USAGE: node fal125_gutter_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const mkE = (k, hp) => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[k], { key: k }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 20; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  run('RUN = newRun()');
  const c = G.CHARACTERS_BY('gutter'); ok(c && c.role === 'Damage' && c.id === '0102' && c.build === 'Collector', 'Gutter exists: Damage, 0102, build Collector');
  const gt = mk('gutter'), al = mk('sna');
  /* weapons are read from what the enemy did */
  const keys = Object.keys(G.ENEMIES).filter(k => !G.ENEMIES[k].boss);
  const shapes = run(`(${JSON.stringify(keys)}).map(k=>{ const w=gtWeapon(Object.assign({},ENEMIES[k],{key:k,st:[],team:'enemy'})); return w; })`);
  ok(shapes.every(w => w && w.name && w.uses === 2 && w.mult > 0), 'every one of the ' + keys.length + ' normal enemies can be turned into a weapon');
  ok(shapes.some(w => w.all) && shapes.some(w => !w.all) && shapes.some(w => w.st) && shapes.some(w => w.drain), 'weapons come out different: ' + shapes.filter(w => w.all).length + ' hit everyone, ' + shapes.filter(w => w.st).length + ' carry a status, ' + shapes.filter(w => w.drain).length + ' drain');
  const sweeper = keys.find(k => { try { return /all|every|sweep/i.test(G.ENEMIES[k].intent({ n: 0, st: [] })); } catch (e) { return false; } });
  const biter = keys.find(k => { try { return /slow/i.test(G.ENEMIES[k].intent({ n: 0, st: [] })) && !/all|every/i.test(G.ENEMIES[k].intent({ n: 0, st: [] })); } catch (e) { return false; } });
  ok(!!sweeper && !!biter, 'found test enemies: ' + sweeper + ' (hits everyone), ' + biter + ' (slows)');
  /* Put In */
  const e1 = mkE(biter, 100); T.setSides([gt, al], [e1, mkE(sweeper)]); T.setCur(gt); e1.hp = 20;
  ok(!!S.gtout.can(gt), 'Take Out is locked while storage is empty');
  S.gtput.run(gt, e1); ok(!e1.alive && run('gtStore().length') === 1, 'Put In finishes a nearly dead enemy and stores it as a weapon');
  const w1 = run('gtStore()[0]'); ok(w1.st && w1.st[0] === 'slow', 'the weapon made from it still slows (' + w1.name + ')');
  /* Take Out */
  const tgt = mkE(sweeper), tgt2 = mkE(sweeper); T.setSides([gt, al], [tgt, tgt2]); T.setCur(gt);
  ok(S.gtout.can(gt) === null, 'Take Out unlocks once something is stored');
  S.gtout.run(gt, tgt); ok(tgt.hp < 9000 && tgt2.hp === 9000 && has(tgt, 'slow'), 'Take Out uses it: one target, and it Slows');
  S.gtout.run(gt, tgt); ok(run('gtStore().length') === 0, 'after 2 uses the weapon breaks');
  /* an AoE weapon from a kill by any of his hits */
  const sw = mkE(sweeper, 30); T.setSides([gt, al], [sw, tgt, tgt2]); T.setCur(gt); T.hit(gt, sw, 5.0);
  ok(!sw.alive && run('gtStore().length') === 1 && run('gtStore()[0].all'), 'a kill by any of his hits is stored, and a sweeping enemy becomes a weapon that hits everyone');
  const h1 = tgt.hp, h2 = tgt2.hp; S.gtout.run(gt, tgt); ok(tgt.hp < h1 && tgt2.hp < h2, 'that weapon hits every enemy');
  /* storage lasts the run, not the wave */
  run('party[0].cd={}; party[0].st=[]'); ok(run('gtStore().length') === 1, 'storage is kept between waves');
  run('RUN = newRun()'); ok(run('gtStore().length') === 0, 'and empties when a new run starts');
  /* Swallow and Spit */
  const att = mkE(sweeper); att.atk = 60; T.setSides([gt, al], [att]); T.setCur(gt); S.gtswallow.run(gt); ok(has(gt, 'gtportal'), 'Swallow and Spit opens the portal');
  const ah = al.hp; T.setCur(att); T.hit(att, al, 2.0); ok(al.hp === ah && gt.gtHeld > 0 && !has(gt, 'gtportal'), 'the next enemy hit on an ally is swallowed whole (' + gt.gtHeld + ' held)');
  const ah2 = al.hp; T.hit(att, al, 2.0); ok(al.hp < ah2, 'only one hit is swallowed');
  const fh = att.hp, held = gt.gtHeld; await H.drive(run(`(async()=>{ try{ await takeTurn(party[0]); }catch(e){} })()`));
  ok(att.hp === fh - held && gt.gtHeld === 0, 'on his next turn it comes back out at whoever sent it, as hard as it went in (' + held + ')');
  console.log(bad ? `\n${bad} problem(s).` : '\nGutter OK.'); process.exit(bad ? 1 : 0);
})();
