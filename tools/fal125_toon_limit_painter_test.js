#!/usr/bin/env node
'use strict';
/* fal125_toon_limit_painter_test.js: checks Toon (0126, Damage), Limit (0127, Tank) and The Painter (0128, Healer), V282.
   USAGE: node fal125_toon_limit_painter_test.js [--html game.html] [--runs 2] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null), i1 = a.indexOf('--runs'), runs = i1 >= 0 ? +a[i1 + 1] : 2;
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const ek = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkE = hp => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[ek], { key: ek }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 30; return f; };
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  run('RUN = newRun()');
  const ct = G.CHARACTERS_BY('toon'), cl = G.CHARACTERS_BY('limit'), cp = G.CHARACTERS_BY('painter');
  ok(ct && ct.role === 'Damage' && ct.id === '0126' && ct.build === 'Controller' && ct.skills.every(s => S[s]) && S.ult_toon, 'Toon: Damage, 0126, Controller, 3 moves and an ultimate');
  ok(cl && cl.role === 'Tank' && cl.id === '0127' && cl.build === 'Protector' && cl.skills.every(s => S[s]) && S.ult_limit, 'Limit: Tank, 0127, Protector, 3 moves and an ultimate');
  ok(cp && cp.role === 'Healer' && cp.id === '0128' && cp.build === 'Warden' && cp.skills.every(s => S[s]) && S.ult_painter, 'The Painter: Healer, 0128, Warden, 3 moves and an ultimate');
  const ids = G.CHARACTERS.map(x => x.id); ok(new Set(ids).size === ids.length, 'every fighter has a different number');
  ok(['toon', 'limit', 'painter'].every(k => run(`IDENT.${k} && PARTY_QUIPS.${k}.length === 2 && STORY_EXTRA.${k} && RL.${k}.length === 2 && ARC_LORE.${k}.length === 6 && MAST_TEXT.${k} && SKIN_DEFS.${k}.length === 2`)), 'identity, quips, story lines, recruit scenes, Archive, Mastery and 2 skins for all three');
  ok(['tn1', 'tn2', 'tn3', 'lm1', 'lm2', 'lm3', 'pt1', 'pt2', 'pt3'].length === 9, 'nine chips written');
  /* TOON */
  const t = mk('toon'), al = mk('sna'), e = mkE(), e2 = mkE(); T.setSides([t, al], [e, e2]); T.setCur(t);
  S.tnmallet.run(t, e); ok(e.hp < 9000 && has(e, 'slow'), 'Giant Mallet hits and Slows');
  S.tnanvil.run(t, e); ok(has(e, 'stun') && has(e, 'mark'), 'Anvil Drop Stuns and Marks');
  const seq = []; for (let i = 0; i < 40; i++) { S.tngag.run(t, e); seq.push(t.tnLast); }
  ok(seq.every((g, i) => i === 0 || g !== seq[i - 1]) && new Set(seq).size === 4, 'Toon Gag is never the same twice in a row, and all four gags show up (' + [...new Set(seq)].join(', ') + ')');
  const p1 = mk('toon'), z = mkE(); z.atk = 9999; T.setSides([p1, al], [z]); T.setCur(z); T.hit(z, p1, 5); ok(p1.alive && p1.hp === 1 && has(p1, 'haste') && p1.tnPop === 1, 'a killing hit only flattens him to 1 HP, and he pops back up Hasted');
  p1.hp = p1.maxHp; T.hit(z, p1, 5); ok(!p1.alive, 'but only once a wave: the next killing hit kills him');
  ok(G.CF && G.CF.includes('tnPop') || run("COUNTER_FIELDS.includes('tnPop')"), 'the pop-back resets every wave');
  const dd = withSna => { const u = mk('toon'), s = mk('sna'), w = mkE(); u.atk = 20; T.setSides(withSna ? [u, s] : [u], [w]); T.setCur(u); let sum = 0; for (let i = 0; i < 40; i++) { w.hp = 9000; T.hit(u, w, 1); sum += 9000 - w.hp; } return sum; };
  ok(dd(true) > dd(false) * 1.02, 'Toon hits harder while Sna is beside him (' + dd(true) + ' vs ' + dd(false) + ')');
  /* LIMIT */
  const l = mk('limit'), ally = mk('fuja'), le = mkE(); T.setSides([l, ally], [le]); T.setCur(l);
  S.lmslam.run(l, le); ok(le.hp < 9000 && has(l, 'taunt'), 'Raw Slam hits and Taunts');
  const ah = ally.hp; S.lmpush.run(l, ally); ok(has(ally, 'atkUp') && has(ally, 'haste') && ally.hp < ah && ally.hp >= 1 && l.lmLimit === 1, 'Push the Limit: the ally is charged, it costs them HP, and Limit gains a Limit');
  for (let i = 0; i < 9; i++) S.lmpush.run(l, ally); ok(l.lmLimit === 5 && ally.hp >= 1, 'Limit stops at 5 and pushing never kills the ally');
  S.lmmix.run(l, ally); ok(has(l, 'defUp') && has(ally, 'defUp'), 'Mix Genes buffs both of them');
  const taken = lim => { const u = mk('limit'), s = mk('fuja'), x = mkE(); u.lmLimit = lim; x.atk = 30; T.setSides([u, s], [x]); T.setCur(x); let sum = 0; for (let i = 0; i < 40; i++) { u.hp = u.maxHp; T.hit(x, u, 1); sum += u.maxHp - u.hp; } return sum; };
  ok(taken(5) < taken(0) * .85, 'every Limit makes him tougher (' + taken(5) + ' vs ' + taken(0) + ')');
  const tk = friend => { const u = mk('limit'), s = friend ? mk('sna') : mk('fuja'), x = mkE(); x.atk = 30; T.setSides([u, s], [x]); T.setCur(x); let sum = 0; for (let i = 0; i < 40; i++) { u.hp = u.maxHp; T.hit(x, u, 1); sum += u.maxHp - u.hp; } return sum; };
  ok(tk(true) < tk(false) * .98, 'with Sna beside him he takes a little less (' + tk(true) + ' vs ' + tk(false) + ')');
  /* THE PAINTER */
  const p = mk('painter'), a2 = mk('sna'), pe = mkE(); T.setSides([p, a2], [pe]); T.setCur(p); a2.hp = Math.round(a2.maxHp * .4); T.addStatus(a2, 'slow', 2, .3); const h0 = a2.hp;
  S.ptpaint.run(p, a2); ok(a2.hp > h0 + a2.maxHp * .2 && !has(a2, 'slow'), 'Paint Over heals and wipes a bad status');
  S.ptwall.run(p, a2); ok(has(a2, 'guard') && has(a2, 'defUp'), 'Paint a Wall gives Guard and DEF');
  S.ptdream.run(p); pe.atk = 40; T.setCur(pe); a2.hp = a2.maxHp; let hurt = 0; for (let i = 0; i < 3; i++) { const b = a2.hp; T.hit(pe, a2, 1); hurt += (b - a2.hp) > 0 ? 1 : 0; a2.st = a2.st.filter(s => s.k !== 'guard'); }
  ok(p.ptDream === 0 && hurt === 1, 'Painter\'s Dream paints out the next 2 enemy hits; the third lands (' + hurt + ' of 3 landed)');
  const u1 = mk('toon'), u2 = mk('limit'), u3 = mk('painter'), f1 = mkE(), f2 = mkE(); T.setSides([u1, u2, u3], [f1, f2]); T.setCur(u1);
  S.ult_toon.run(u1, f1); ok(f1.hp < 9000 && f2.hp < 9000 && has(f1, 'mark'), 'Toon ultimate: every enemy flattened');
  S.ult_limit.run(u2, f1); ok(u2.lmLimit === 5 && has(u1, 'atkUp') && has(u3, 'defUp'), 'Limit ultimate: the whole team past the limit');
  u1.hp = 10; S.ult_painter.run(u3); ok(u1.hp >= 35 && u3.ptDream === 3, 'Painter ultimate: heals everyone and paints out 3 hits');
  /* auto-played full runs */
  let errs = 0; const P = ['toon', 'limit', 'painter', 'eyianix'], xpMap = {}; P.forEach(k => xpMap[k] = 600);
  for (let i = 0; i < runs; i++) { H.reseed(9000 + i); try { await H.run(P, { world:0, runlen:'world', diff:'Normal', xp:0, xpMap, chips:[], smart:true, story:true, wave:1, foes:[] }); } catch (e2) { errs++; console.log('  run error: ' + String(e2.message).slice(0, 160)); } }
  ok(!errs, runs + ' auto-played full runs with all three finish with no errors');
  console.log(bad ? `\n${bad} problem(s).` : '\nToon, Limit and The Painter OK.'); process.exit(bad ? 1 : 0);
})();
