#!/usr/bin/env node
'use strict';
/* fal125_soundemon_test.js: checks Soundemon (V252): things made of sound (Noise Blade, Shrieker), max 2, they act at the end of his turns and
   last 3 of them, Burst fires them again, kills make them last longer. USAGE: node fal125_soundemon_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 20; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  const turn = () => H.drive(run(`(async()=>{ try{ await takeTurn(party.find(p=>p.key==='soundemon')); }catch(e){} })()`));
  run('RUN = newRun()');
  const c = G.CHARACTERS_BY('soundemon'); ok(c && c.role === 'Damage' && c.id === '0106' && c.build === 'Composer', 'Soundemon exists: Damage, 0106, build Composer');
  ok(c.skills.join() === 'sdweapon,sdentity,sdburst', 'three moves: Sound Weapon, Sound Entity, Burst');
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  const sd = mk('soundemon'), al = mk('sna'); let e1 = mkE(), e2 = mkE(); e2.hp = 5000;
  T.setSides([sd, al], [e1, e2]); T.setCur(sd);
  S.sdweapon.run(sd, e1); ok(e1.hp < 9000 && sd.sdC.length === 1 && sd.sdC[0].k === 'blade' && sd.sdC[0].t === 3, 'Sound Weapon hits and makes a Noise Blade for 3 turns');
  S.sdentity.run(sd); ok(sd.sdC.length === 2 && sd.sdC[1].k === 'shriek', 'Sound Entity makes a Shrieker');
  const b1 = e1.hp, b2 = e2.hp; await turn();
  ok(e2.hp < b2 && has(e1, 'blur') && has(e2, 'blur'), 'at the start of his turn the blade cuts the weakest and the Shrieker Blurs everyone');
  ok(sd.sdC.every(x => x.t === 2), 'and they lose a turn');
  S.sdweapon.run(sd, e1); ok(sd.sdC.length === 2 && sd.sdC[0].k === 'shriek' && sd.sdC[1].k === 'blade' && sd.sdC[1].t === 3, 'a third replaces the oldest');
  const c1 = e1.hp, c2 = e2.hp, t0 = sd.sdC.map(x => x.t).join(); S.sdburst.run(sd, e1);
  ok(e1.hp < c1 && e2.hp < c2 && sd.sdC.map(x => x.t).join() === t0, 'Burst hits and makes everything fire again, without using up a turn');
  /* kills keep the noise going */
  const e3 = mkE(); e3.hp = 1; T.setSides([sd, al], [e1, e3]); const t1 = sd.sdC.map(x => x.t); S.sdburst.run(sd, e3);
  ok(!e3.alive && sd.sdC.every((x, i) => x.t === Math.min(5, t1[i] + 1)), 'a kill makes everything he made last a turn longer');
  for (let i = 0; i < 6; i++) await turn(); ok((sd.sdC || []).length === 0, 'they fade after their turns run out');
  ok(run("COUNTER_FIELDS.includes('sdC')"), 'they are gone at the start of each wave');
  /* chips */
  const s2 = mk('soundemon'); s2.sdMax = 3; s2.sdLife = 4; T.setSides([s2, al], [mkE(), mkE()]); S.sdweapon.run(s2, run('foes[0]')); S.sdentity.run(s2); S.sdweapon.run(s2, run('foes[0]'));
  ok(s2.sdC.length === 3 && s2.sdC[0].t === 4, 'Third Voice and Long Echo: 3 at once, 4 turns each');
  const s3 = mk('soundemon'), x1 = mkE(); T.setSides([s3, al], [x1]); S.ult_soundemon.run(s3, x1);
  ok(s3.sdC.length === 2 && has(x1, 'blur') && x1.hp < 9000, 'Full Volume: hits everyone, makes a blade and a Shrieker, and fires them');
  console.log(bad ? `\n${bad} problem(s).` : '\nSoundemon OK.'); process.exit(bad ? 1 : 0);
})();
