#!/usr/bin/env node
'use strict';
/* fal125_v257_test.js: shared Bond Combo cooldown, character events, Last Stand. USAGE: node fal125_v257_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = () => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = 9000; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  run('RUN = newRun()');
  /* Bond Combo */
  const A = mk('sna'), B = mk('snavo'), C = mk('radiant'), e = mkE(); T.setSides([A, B, C], [e]); run('round = 5');
  ok(S.bondcombo.can(A) === null, 'Bond Combo is free at the start');
  T.setCur(A); S.bondcombo.run(A, e); ok(/Team ready in 3/.test(S.bondcombo.can(B) || '') && /Team ready/.test(S.bondcombo.can(C) || ''), 'after one Bond Combo, NOBODY else can use one (' + S.bondcombo.can(B) + ')');
  run('round = 7'); ok(/ready in 1/.test(S.bondcombo.can(A) || ''), 'it counts down by rounds');
  run('round = 8'); ok(S.bondcombo.can(A) === null, 'and is back after 3 rounds');
  /* character events */
  const CE = run('CHAR_EVENTS'); ok(CE.length >= 10 && CE.every(x => G.CHARACTERS_BY(x.who)), CE.length + ' character events, all for real fighters');
  let errs = 0; for (const ev of CE) { const u = mk(ev.who); T.setSides([u, mk('sna')], [mkE()]); run('RUN.coins = 200');
    for (const c of ev.ch) { try { const m = c.run(u); if (typeof m !== 'string' || !m) errs++; } catch (x) { errs++; console.log('   ', ev.t, x.message); } } }
  ok(!errs, 'every choice in every character event runs and returns a line');
  /* Last Stand */
  const P = [mk('sna'), mk('snavo'), mk('demure')], f = mkE(); T.setSides(P, [f]); P[0].alive = P[1].alive = false; P[0].hp = P[1].hp = 0;
  run('CFG.auto = false'); const pr = run(`(async()=>{ const u=party[2]; const p = playerTurn(u); await new Promise(r=>setTimeout(r,0)); return u.skills.includes('laststand'); })()`); const has = await H.drive(pr);
  ok(P[2].skills.includes('laststand'), 'the last fighter standing gets Last Stand');
  T.setCur(P[2]); P[2].hp = 20; const h0 = f.hp; S.laststand.run(P[2], f);
  ok(P[2].hp > 20 && f.hp < h0 && P[2].st.some(s => s.k === 'atkUp') && P[2].lsUsed && !P[2].skills.includes('laststand'), 'Last Stand heals, boosts ATK, hits hard, and is used up for the wave');
  ok(run("COUNTER_FIELDS.includes('lsUsed')"), 'it comes back next wave');
  console.log(bad ? `\n${bad} problem(s).` : '\nV257 OK.'); process.exit(bad ? 1 : 0);
})();
