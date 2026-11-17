#!/usr/bin/env node
'use strict';
/* fal125_marrowline_test.js: checks Marrowline (V243): Powder, Light the Fuse (countdown, set it off, hits burn it faster), Red X, City Block, the death blast.
   USAGE: node fal125_marrowline_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 20; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  const turn = u => H.drive(run(`(async()=>{ try{ await takeTurn(party.find(p=>p.key==='${u}')); }catch(e){} })()`));
  run('RUN = newRun()');
  const c = G.CHARACTERS_BY('marrowline'); ok(c && c.role === 'Damage' && c.id === '0103' && c.build === 'Bomber', 'Marrowline exists: Damage, 0103, build Demolition');
  ok(c.skills.join() === 'mlfuse,mlred,mlcity' && S.mlfuse && S.mlred && S.mlcity, 'three moves: Light the Fuse, Red X, City Block');
  let ml = mk('marrowline'), al = mk('sna'), e1 = mkE(), e2 = mkE();
  T.setSides([ml, al], [e1, e2]); T.setCur(ml);
  /* Powder */
  await turn('marrowline'); ok(ml.mlPow === 1, 'Powder +1 at the start of his turn');
  let d1 = 0, d5 = 0; for (let i = 0; i < 20; i++) { ml.mlPow = 1; e1.hp = e1.maxHp; T.hit(ml, e1, 1); d1 += e1.maxHp - e1.hp; ml.mlPow = 5; e1.hp = e1.maxHp; T.hit(ml, e1, 1); d5 += e1.maxHp - e1.hp; } ml.mlPow = 1;   /* V262: averaged over 20 hits (one hit each was at the mercy of the random spread) */
  ok(d5 > d1 * 1.12, 'each Powder adds damage (' + d1 + ' at 1, ' + d5 + ' at 5)');
  /* City Block */
  ml.mlPow = 4; ok(!!S.mlcity.can(ml), 'City Block is locked under 5 Powder'); ml.mlPow = 5; ok(S.mlcity.can(ml) === null, 'and open at 5');
  const a1 = e1.hp, a2 = e2.hp, mh = ml.hp; S.mlcity.run(ml);
  ok(e1.hp < a1 && e2.hp < a2 && ml.mlPow === 0, 'City Block hits every enemy and spends the Powder');
  ok(ml.hp < mh && has(ml, 'stun'), 'the recoil burns him and he loses his next turn');
  /* Light the Fuse: counts down 3 of his turns, lands on the Red X */
  ml = mk('marrowline'); e1 = mkE(); e2 = mkE(); T.setSides([ml, al], [e1, e2]); T.setCur(ml);
  S.mlfuse.run(ml, e2); ok(ml.mlFuse === 3 && has(e2, 'mlx'), 'Light the Fuse: 3 turns, Red X on the target');
  await turn('marrowline'); await turn('marrowline'); ok(ml.mlFuse === 1 && e2.hp === 9000, 'it burns down at the start of his turns');
  const p = ml.mlPow; await turn('marrowline'); ok(ml.mlFuse === 0 && e2.hp < 9000 && e1.hp < 9000 && e2.hp < e1.hp && ml.mlPow === 0, 'when it runs out the shell lands on the Red X (' + (9000 - e2.hp) + ') and splashes the rest (' + (9000 - e1.hp) + ') with ' + (p + 1) + ' Powder');
  /* Set It Off */
  e1 = mkE(); e2 = mkE(); T.setSides([ml, al], [e1, e2]); S.mlfuse.run(ml, e1); S.mlfuse.run(ml, e1); ok(ml.mlFuse === 0 && e1.hp < 9000, 'using it again while it burns sets it off at once');
  /* Red X moves the shell */
  e1 = mkE(); e2 = mkE(); T.setSides([ml, al], [e1, e2]); S.mlfuse.run(ml, e1); S.mlred.run(ml, e2);
  ok(has(e2, 'mark') && has(e2, 'mlx') && !has(e1, 'mlx'), 'Red X Marks its target and moves the Red X there');
  /* enemy hits burn it faster and pack Powder */
  const pw = ml.mlPow; T.setCur(e1); run('round++'); T.hit(e1, ml, .5); ok(ml.mlFuse === 2 && ml.mlPow === pw + 1, 'an enemy hit on him packs Powder and burns the fuse 1 turn faster');
  T.hit(e1, ml, .5); ok(ml.mlFuse === 2, 'the same enemy only burns it once a round');
  run('round++'); T.hit(e1, ml, .5); run('round++'); const b2 = e2.hp; T.hit(e2, ml, .5); ok(ml.mlFuse === 0 && e2.hp < b2, 'enough hits set it off early, still at the Red X');
  /* Thick Fuse chip */
  ml.alive = true; ml.hp = ml.maxHp; ml.mlFuse = 0; ml.mlThick = 1; S.mlfuse.run(ml, e1); run('round++'); T.hit(e1, ml, .5); ok(ml.mlFuse === 3, 'Thick Fuse: hits no longer burn it down'); ml.mlThick = 0;
  /* the death blast */
  ml = mk('marrowline'); e1 = mkE(); e2 = mkE(); T.setSides([ml, al], [e1, e2]); ml.mlFuse = 2; ml.mlPow = 3; ml.hp = 1; T.setCur(e1); run('round++'); T.hit(e1, ml, 3);
  ok(!ml.alive && e1.hp < 9000 && e2.hp < 9000 && Math.abs(e1.hp - e2.hp) < 9000 * .2, 'if he falls with the fuse lit, the shell hits every enemy');
  /* the ultimate */
  const u2 = mk('marrowline'); e1 = mkE(); e2 = mkE(); T.setSides([u2, al], [e1, e2]); T.setCur(u2); S.ult_marrowline.run(u2, e1);
  ok(e1.hp < 9000 && e2.hp < 9000 && u2.mlPow === 0, 'Full Barrel fires a full shell at once (' + (9000 - e1.hp) + ')');
  /* counters reset per wave */
  ok(run("COUNTER_FIELDS.includes('mlPow') && COUNTER_FIELDS.includes('mlFuse')"), 'Powder and the fuse reset every wave');
  console.log(bad ? `\n${bad} problem(s).` : '\nMarrowline OK.'); process.exit(bad ? 1 : 0);
})();
