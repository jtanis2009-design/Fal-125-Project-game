#!/usr/bin/env node
'use strict';
/* fal125_demure_test.js: checks Demure (V245): the Four Seasons (one step per turn, reset each wave), Knife and Nature's Call in every season, Out of Season.
   USAGE: node fal125_demure_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 20; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  const turn = () => H.drive(run(`(async()=>{ try{ await takeTurn(party.find(p=>p.key==='demure')); }catch(e){} })()`));
  run('RUN = newRun()');
  const c = G.CHARACTERS_BY('demure'); ok(c && c.role === 'Damage' && c.id === '0104' && c.build === 'Seasonal', 'Demure exists: Damage, 0104, build Seasonal');
  ok(G.CHARACTERS_BY('marrowline').id === '0103', 'Marrowline has his new number, 0103');
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  const dm = mk('demure'), al = mk('sna'); let e1 = mkE(), e2 = mkE(); T.setSides([dm, al], [e1, e2]); T.setCur(dm);
  const sea = () => run("dmSea(party.find(p=>p.key==='demure'))");
  const seen = []; for (let n = 0; n < 5; n++) { await turn(); seen.push(sea()); }
  ok(seen.join() === '0,1,2,3,0', 'the season moves on every turn: Spring, Summer, Autumn, Winter, Spring');
  /* Knife in every season */
  const knife = async s => { dm.dmSeason = s + 1; const t = mkE(); T.setSides([dm, al], [t, mkE()]); T.setCur(dm); dm.hp = 50; S.dmknife.run(dm, t); return t; };
  let t = await knife(0); ok(dm.hp > 50, 'Spring Knife heals him');
  const t1 = await knife(1), d1 = 9000 - t1.hp; const t2 = await knife(0), d0 = 9000 - t2.hp; ok(d1 > d0 * 1.2, 'Summer Knife hits hardest (' + d1 + ' vs ' + d0 + ')');
  t = await knife(2); ok(has(t, 'bleed'), 'Autumn Knife makes it Bleed');
  t = await knife(3); ok(has(t, 'slow'), 'Winter Knife Slows');
  /* Nature's Call in every season */
  const call = s => { dm.dmSeason = s + 1; e1 = mkE(); e2 = mkE(); e2.atk = 40; T.setSides([dm, al], [e1, e2]); T.setCur(dm); S.dmcall.run(dm); return [e1, e2]; };
  let [a1, a2] = call(0); ok(a1.hp < 9000 && a2.hp < 9000 && has(a2, 'stun') && !has(a1, 'stun'), 'Spring Call hits everyone and roots the strongest');
  [a1, a2] = call(1); ok(has(a1, 'scorch') && has(a2, 'scorch'), 'Summer Call sets everyone Burning');
  [a1, a2] = call(2); ok(has(a1, 'dmrot') && has(a2, 'dmrot'), 'Autumn Call makes everyone Rot');
  const h0 = a1.hp; T.hit(al, a1, 1); const rotD = h0 - a1.hp; const f = mkE(); T.setSides([dm, al], [f]); T.hit(al, f, 1); const plainD = 9000 - f.hp;
  ok(rotD > plainD * 1.12, 'a Rotting enemy takes more damage from anyone (' + rotD + ' vs ' + plainD + ')');
  [a1, a2] = call(3); ok(has(a1, 'slow') && has(a2, 'slow'), 'Winter Call Slows everyone');
  const bs = mkE(); bs.boss = true; bs.atk = 99; dm.dmSeason = 1; T.setSides([dm, al], [bs]); S.dmcall.run(dm); ok(!has(bs, 'stun') && has(bs, 'slow'), 'a boss is Slowed instead of rooted');
  /* Out of Season */
  dm.dmSeason = 4; e1 = mkE(); T.setSides([dm, al], [e1]); S.dmskip.run(dm, e1); ok(sea() === 0 && e1.hp < 9000, 'Out of Season hits and jumps Winter to Spring');
  await turn(); ok(sea() === 1, 'and the next turn moves on as usual');
  /* Call of the Wild */
  dm.dmQuick = 1; dm.cd.dmcall = 2; await turn(); ok(dm.cd.dmcall <= 1, 'Call of the Wild: Nature\'s Call comes back a turn sooner');
  ok(run("COUNTER_FIELDS.includes('dmSeason')"), 'the season goes back to Spring every wave');
  const u2 = mk('demure'); e1 = mkE(); e2 = mkE(); T.setSides([u2, al], [e1, e2]); T.setCur(u2); S.ult_demure.run(u2, e1);
  ok(has(e1, 'scorch') && has(e1, 'dmrot') && has(e1, 'slow') && e1.hp < 9000, 'Turn of the Year: all four seasons at once');
  console.log(bad ? `\n${bad} problem(s).` : '\nDemure OK.'); process.exit(bad ? 1 : 0);
})();
