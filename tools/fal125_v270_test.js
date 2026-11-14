#!/usr/bin/env node
'use strict';
/* fal125_v270_test.js: checks V270. Boss phase-2 helpers fit their world (no more Guard Drones everywhere), the endless extras call
   enemies from the world you are in, Clown's Massacre has six floor bosses (Clown.x25 and Clown.x33 are new) with rare unlock forms,
   the Clown.x25 doll / fusion and the Clown.x33 blood drinking work, and every world has a song for every floor.
   USAGE: node fal125_v270_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 9 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  const CW = run('WORLD_DATA.findIndex(w => w.name === "Clown\'s Massacre")'), CAS = run('WORLD_DATA.findIndex(w => w.casino)');
  const inWorld = w => run(`RUN = newRun(); CFG.world = ${w}; CFG.runlen = 'endless'; rollRun(); wave = 2; round = 1;`);
  const party = () => ['sna', 'snavo', 'radiant'].map(k => { const u = mk(k); u.maxHp = u.hp = 99999; return u; });
  const boss = k => run(`makeUnit(ENEMIES[${JSON.stringify(k)}], 'enemy')`);
  const p2 = (w, k) => { inWorld(w); const b = boss(k); T.setSides(party(), [b]); run('enterPhase2(foes[0])'); return JSON.parse(run('JSON.stringify(foes.slice(1).map(f => ({ k: f.key, n: f.name, hp: f.maxHp })))')); };

  /* 1. phase 2 helpers */
  const bosses = JSON.parse(run(`JSON.stringify(WORLD_DATA.flatMap((w, i) => (w.bosses || []).map(k => [k, i])).filter(([k]) => ENEMIES[k] && !ENEMIES[k].final))`));
  const drones = bosses.filter(([k, w]) => w > 0).filter(([k, w]) => p2(w, k).some(f => f.k === 'drone'));
  ok(drones.length === 0, 'no boss outside World 1 calls a Guard Drone in phase 2' + (drones.length ? ' (still: ' + drones.map(x => x[0]).join(', ') + ')' : ''));
  const sl = p2(1, 'sludgemother'); ok(sl.length === 1 && sl[0].k === 'sludge', 'Sludge Mother calls a Sludge Crawler');
  const pb = p2(CAS, 'casino_pitboss'); ok(pb.length === 1 && pb[0].k === 'casino_bouncer' && pb[0].hp <= Math.round(90 * 1.5), 'the Pit Boss calls a Bouncer, capped in size (' + (pb[0] && pb[0].hp) + ' HP)');
  ok(p2(6, 'reflection').length === 0, 'The Reflection fights alone');
  inWorld(7); const ab = boss('altboss'); T.setSides(party(), [ab]); run('enterPhase2(foes[0])');
  ok(run('foes.length === 2 && !!foes[1].alt'), 'a World 8 alternate boss calls another alternate (' + run('foes[1] && foes[1].name') + ')');

  /* 2. endless extras call world enemies */
  inWorld(CW); T.setSides(party(), [boss('clown_x1')]); run('FIT_ON = 1; summon("drone"); FIT_ON = 0;');
  ok(run('/^clown_/.test(foes[1].key)'), 'in Clown\'s Massacre an endless "Swarm" drone becomes a clown (' + run('foes[1].name') + ')');
  inWorld(0); T.setSides(party(), [boss('husk')]); run('FIT_ON = 1; summon("drone"); FIT_ON = 0;');
  ok(run('foes[1].key === "drone"'), 'World 1 keeps its Guard Drones');

  /* 3. clown floors */
  inWorld(CW); run('for (wave = 0; WAVES.length < 200 && wave < 400; wave += 5) extendEndless(); wave = 2;');
  const bw = JSON.parse(run('JSON.stringify(WAVES.filter((w, i) => i % 5 === 4).map(w => w[1]))'));
  ok(bw.every(k => /^clown_/.test(k)), 'every Clown\'s Massacre boss wave up to wave 200 is a clown (no World 1-3 bosses in loop 2+)');
  ok(run('WD().bosses.length === 6 && WD().floors.length === 6 && WD().fsc.length === 6'), 'six floors and six floor bosses');
  ok(bw.slice(0, 6).every((k, i) => k.startsWith(['clown_x3', 'clown_x2', 'clown_x25', 'clown_x14', 'clown_x33', 'clown_x5'][i]) || /_rise$|x40boss/.test(k)), 'first lap in order: x3, x2, x25, x14, x33, x5 (' + bw.slice(0, 6).join(', ') + ')');
  ok(bw.slice(0, 3).every(k => k !== 'clown_x40boss'), 'the Flesh cannot replace the first three floor bosses');
  let r25 = 0, r33 = 0; for (let i = 0; i < 2000; i++) { run('WAVES = []'); if (run('cwBoss("clown_x25boss")') === 'clown_x25alt') r25++; if (run('cwBoss("clown_x33boss")') === 'clown_x33alt') r33++; }
  ok(r25 > 140 && r25 < 260 && r33 > 140 && r33 < 260, 'the rare forms come about 1 time in 10 (x25 ' + r25 / 20 + '%, x33 ' + r33 / 20 + '%)');
  ok(run('cwBoss("clown_x2alt")') === 'clown_x2alt', 'a rare form is never swapped out for the Flesh or a risen clown');
  ok(run('JSON.stringify(CLOWN_UNLOCK_FOES.clownx25) === \'["clown_x25alt"]\' && JSON.stringify(CLOWN_UNLOCK_FOES.clownx33) === \'["clown_x33alt"]\''), 'Clown.x25 and Clown.x33 unlock only from their rare form');

  /* 4. Clown.x25 */
  inWorld(CW); const x0 = boss('clown_x25boss'); T.setSides(party(), [x0]); run('x25Spawn(foes[0])');
  ok(run('foes.length === 2 && foes[1].key === "clown_x25bdoll" && foes[0].mate === foes[1]'), 'Clown.x25 comes on stage holding its doll');
  /* (the test harness cannot hit a unit after a mid-fight summon, so the shield check builds both sides directly) */
  inWorld(CW); const P = party(); const x = boss('clown_x25boss'), xd = boss('clown_x25bdoll'); x.hp = x.maxHp = 2000; x.mate = xd; xd.mate = x; x.mateDone = true; T.setSides(P, [x, xd]);
  const h1 = run('(() => { const u = foes[0], t = party[0]; const h = u.hp; hit(t, u, 1); return h - u.hp; })()');
  run('foes[1].alive = false; foes[1].hp = 0'); run('foes[0].mate = null; foes[0].fused = false');
  const h2 = run('(() => { const u = foes[0], t = party[0]; const h = u.hp; hit(t, u, 1); return h - u.hp; })()');
  ok(h1 > 0 && h1 < h2 * .85, 'while the doll holds its hand the armor takes less damage (' + h1 + ' vs ' + h2 + ')');
  inWorld(CW); const y = boss('clown_x25boss'); T.setSides(party(), [y]); run('x25Spawn(foes[0])'); T.setCur(y);
  for (let i = 0; i < 4; i++) run('x25AI(foes[0])');
  ok(run('foes[0].fused && !foes[1].alive && /Fused/.test(foes[0].name)'), 'after 4 turns with the doll alive they fuse');
  inWorld(CW); const z = boss('clown_x25boss'); T.setSides(party(), [z]); run('x25Spawn(foes[0]); foes[1].alive = false; foes[1].hp = 0;'); T.setCur(z); run('x25AI(foes[0])');
  ok(run('foes[0].lone && !foes[0].fused && foes[0].st.some(s => s.k === "atkUp")'), 'kill the doll first and the armor is left behind (angry, never fuses)');
  inWorld(CW); const w = boss('clown_x25boss'); T.setSides(party(), [w]); run('x25Spawn(foes[0]); enterPhase2(foes[0])');
  ok(run('foes[0].fused'), 'phase 2 with the doll alive: they fuse at once');

  /* 5. Clown.x33 */
  inWorld(CW); const Q = party(); const c = boss('clown_x33boss'); c.hp = 200; T.setSides(Q, [c]); T.setCur(c);
  run('party.forEach(p => addStatus(p, "bleed", 3, .04))'); const hp0 = c.hp; run('x33AI(foes[0])');
  ok(c.hp > hp0, 'Clown.x33 heals at the start of its turn while heroes bleed (' + hp0 + ' -> ' + c.hp + ')');
  run('foes[0].n = 3'); run('x33AI(foes[0])');
  ok(run('foes.some(f => f.key === "clown_x33patch" && f.alive)'), 'Stitch Up: a Bandaged Clown joins');
  const hb = c.hp; run('(() => { const p = foes.find(f => f.key === "clown_x33patch"); ENEMIES.clown_x33patch.ai(p); })()');
  ok(c.hp > hb, 'the Bandaged Clown patches Clown.x33 up');

  /* 6. unlock */
  run('SAVE.clownUnlock = {}; SAVE.roster = ["fuja","radiant","eyianix","bearer"]; SAVE.mode = "story"');
  inWorld(CW); const ra = boss('clown_x25alt'); T.setSides(party(), [ra]); run('foes[0].alive = false; foes[0].hp = 0; window.__noIntro = 1');
  try { await H.drive(run('(async () => { const ask = evtAsk; evtAsk = async () => 0; try { await x2Recruit(); } finally { evtAsk = ask; } })()')); } catch (e) {}
  ok(run('!!(SAVE.clownUnlock || {}).clownx25'), 'beating Clown.x25 (Double Act) unlocks Clown.x25');

  /* 7. music lists */
  const mus = JSON.parse(run('JSON.stringify(WORLD_DATA.map(w => [w.name, w.floors.length, (w.music.floor || []).filter(Boolean).length, (w.music.boss || []).filter(Boolean).length]))'));
  ok(mus.every(([n, f, a, b]) => a >= f && b >= f), 'every world has a floor song and a boss song for every floor (Casino: ' + mus.find(m => /Casino/.test(m[0])).slice(1).join('/') + ')');

  /* 8. clown phase 2 moves */
  inWorld(CW); const x2 = boss('clown_x2boss'); T.setSides(party(), [x2]); run('enterPhase2(foes[0])');
  ok(run('foes.some(f => f.key === "clown_x2copy")'), 'Clown.x2 splits in phase 2 (no drone)');
  console.log(bad ? `\n${bad} check(s) FAILED` : '\nV270 OK.'); process.exit(bad ? 1 : 0);
})();
