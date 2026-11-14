#!/usr/bin/env node
'use strict';
/* fal125_redwalker_test.js: checks The Red Walker (0124, Damage, Doom's Curse), V264. USAGE: node fal125_redwalker_test.js [--html game.html] */
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
  run('RUN = newRun()');
  const c = G.CHARACTERS_BY('redwalker'); ok(c && c.role === 'Damage' && c.id === '0124' && c.name === 'The Red Walker' && c.skills.every(s => S[s]) && S.ult_redwalker, 'The Red Walker exists: Damage, 0124, 3 moves and an ultimate');
  ok(G.CHARACTERS_BY('walker') && G.CHARACTERS_BY('walker').id === '0068', 'Walker (0068) is still his own fighter');
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  const r = mk('redwalker'), al = mk('sna'), e = mkE(), e2 = mkE(); r.rwBlock = 0; T.setSides([r, al], [e, e2]); T.setCur(r);
  const mh = r.maxHp; let d0 = 0, d2 = 0; for (let i = 0; i < 20; i++) { e.hp = 9000; S.rwbash.run(r, e); d0 += 9000 - e.hp; }
  S.rwcurse.run(r); ok(r.rwCurse === 1 && r.maxHp === mh - Math.round(mh * .04) && has(r, 'haste'), 'Doom\'s Curse: +1 Curse, faster, and it takes 4% of his max HP as skin');
  const m1 = r.maxHp; S.rwcurse.run(r); ok(mh - r.rwSkin === r.maxHp && m1 - r.maxHp === Math.round(m1 * .06), 'the second one takes more skin (6%)');
  for (let i = 0; i < 20; i++) { e.hp = 9000; S.rwbash.run(r, e); d2 += 9000 - e.hp; } ok(d2 > d0 * 1.4, 'two Curses: Shield Bash hits much harder (' + d2 + ' vs ' + d0 + ')');
  for (let i = 0; i < 5; i++) if (!S.rwcurse.can(r)) S.rwcurse.run(r); ok(r.rwCurse === 5 && !!S.rwcurse.can(r) && r.hp >= 1, 'the curse stops at 5, and never kills him');
  e.hp = e2.hp = 9000; S.rwthrow.run(r, e); ok(e.hp < 9000 && e2.hp < 9000, 'Shield Throw hits the target and comes back through another enemy');
  ok(T.CF.includes('rwCurse'), 'the curse resets every wave');
  r.rwCurse = 0; await turn(r); ok(r.maxHp === mh && !r.rwSkin, 'and the skin grows back');
  const b = mk('redwalker'), z = mkE(); T.setSides([b, al], [z]); T.setCur(z); let blk = 0, pl = 0;
  for (let i = 0; i < 30; i++) { b.rwBlock = 1; b.hp = b.maxHp; T.hit(z, b, 1); blk += b.maxHp - b.hp; b.rwBlock = 0; b.hp = b.maxHp; T.hit(z, b, 1); pl += b.maxHp - b.hp; }
  ok(blk < pl * .65, 'a hit blocked by the Shield of Doom does about half (' + blk + ' vs ' + pl + ')');
  const u = mk('redwalker'), x = mkE(), um = u.maxHp; T.setSides([u, al], [x]); T.setCur(u); S.ult_redwalker.run(u, x); ok(u.rwCurse === 5 && u.maxHp === um && x.hp < 9000, 'ultimate: full Curse with no skin cost, and the shield hits');
  ok(!run('globalThis.__err'), 'no errors during turns');
  console.log(bad ? `\n${bad} problem(s).` : '\nThe Red Walker OK.'); process.exit(bad ? 1 : 0);
})();
