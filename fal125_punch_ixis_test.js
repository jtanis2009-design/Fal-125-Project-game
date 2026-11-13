#!/usr/bin/env node
'use strict';
/* fal125_punch_ixis_test.js: checks Punchline (Absolute Joke) and Ixis (Absorb), V254. USAGE: node fal125_punch_ixis_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 20; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  run('RUN = newRun()');
  const pc = G.CHARACTERS_BY('punchline'), ic = G.CHARACTERS_BY('ixis');
  ok(pc.role === 'Damage' && pc.id === '0109' && ic.role === 'Tank' && ic.id === '0110', 'Punchline (Damage, 0109) and Ixis (Tank, 0110) exist');
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  /* Punchline */
  const p = mk('punchline'), al = mk('sna'); p.plLaugh = 1;
  const kinds = { slip:0, punch:0, pie:0 }; run('globalThis.__s=[]; const __q=say; say=function(t){ __s.push(String(t)); return __q.apply(this,arguments); }');
  for (let i = 0; i < 60; i++) { const e1 = mkE(), e2 = mkE(); T.setSides([p, al], [e1, e2]); T.setCur(p); run('__s=[]'); S.pljoke.run(p, e1);
    const t = run('__s').join(' '); if (/slips/.test(t)) kinds.slip++; if (/punches/.test(t)) kinds.punch++; if (/pie/.test(t)) kinds.pie++; }
  ok(kinds.slip > 5 && kinds.punch > 5 && kinds.pie > 5, 'when he laughs, a funny thing happens: slip, friendly punch or pie (' + JSON.stringify(kinds) + ')');
  ok(!run('__s').join(' ').match(/Punchline (makes|causes|uses Absolute)/), 'the log never credits him');
  const e1 = mkE(), e2 = mkE(); T.setSides([p, al], [e1, e2]); T.setCur(p); e2.boss = true; run('plFunny')(p, e2); ok(!has(e2, 'stun'), 'a boss is never Stunned by it');
  const f1 = mkE(), f2 = mkE(); T.setSides([p, al], [f1, f2]); f1._plFunny = 1;
  let a1 = 0, a2 = 0; for (let i = 0; i < 20; i++) { f1.hp = f2.hp = 9000; S.plslap.run(p, f1); S.plslap.run(p, f2); a1 += 9000 - f1.hp; a2 += 9000 - f2.hp; }
  ok(a1 > a2 * 1.4, 'Slapstick hits much harder after something funny happened (' + a1 + ' vs ' + a2 + ')');
  const g = [mkE(), mkE(), mkE()]; T.setSides([p, al], g); S.plbig.run(p); ok(g.every(x => x.hp < 9000), 'Big Laugh hits every enemy');
  p.plPass = 1; const h = mkE(); T.setSides([p, al], [h, mkE()]); T.setCur(al); run('round++'); run('addStatus')(h, 'slow', 2, .3);
  await new Promise(r => setTimeout(r, 5)); ok(h._plFunny === 1, 'when an enemy is Slowed, he finds it funny and something happens to it');
  /* Ixis */
  const x = mk('ixis'), y = mk('sna'), z = mkE(); T.setSides([x, y], [z]); T.setCur(z); z.atk = 30;
  const h0 = x.hp; T.hit(z, x, 1); const taken = h0 - x.hp; ok(x.ixStore === Math.round(taken * .3), 'Ixis Stores 30% of every hit (' + x.ixStore + ' of ' + taken + ')');
  T.setCur(x); S.ixswallow.run(x); ok(has(x, 'taunt') && has(x, 'ixguard'), 'Swallow the Hit taunts');
  T.setCur(z); let d1 = 0, d2 = 0; for (let i = 0; i < 20; i++) { x.hp = x.maxHp; T.hit(z, x, 1); d1 += x.maxHp - x.hp; }
  x.st = x.st.filter(s => s.k !== 'ixguard'); for (let i = 0; i < 20; i++) { x.hp = x.maxHp; T.hit(z, x, 1); d2 += x.maxHp - x.hp; }
  ok(d1 < d2 * .85, 'and takes less damage while swallowing (' + d1 + ' vs ' + d2 + ')');
  ok(x.ixStore === 120, 'the Store is capped at 120');
  const w = [mkE(), mkE()]; T.setSides([x, y], w); T.setCur(x); x.hp = 50; S.ixspit.run(x);
  ok(w.every(v => v.hp === 9000 - 72) && x.ixStore === 0 && x.hp > 50, 'Spit Back: every enemy takes 60% of the Store, Ixis heals');
  const q = [mkE(), mkE(), mkE()]; T.setSides([x, y], q); S.ixscythe.run(x, q[1]); ok(q.every(v => v.hp < 9000 && has(v, 'slow')) && (9000 - q[1].hp) > (9000 - q[0].hp), 'Scythe Arms hits the target hardest, the ones beside it too, and Slows all');
  ok(run("COUNTER_FIELDS.includes('ixStore')"), 'the Store empties every wave');
  console.log(bad ? `\n${bad} problem(s).` : '\nPunchline and Ixis OK.'); process.exit(bad ? 1 : 0);
})();
