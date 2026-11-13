#!/usr/bin/env node
'use strict';
/* fal125_rework4_test.js: checks the V240 reworks of Pyrelash (Six Lashes), Triggerfinger (real mines) and Marrow (the Book).
   USAGE: node fal125_rework4_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const fk = Object.keys(G.ENEMIES).filter(k => !G.ENEMIES[k].boss);
  const mkFoes = (n, hp, key) => Array.from({ length: n }, (_, i) => { const k = key || fk[0]; const f = T.makeUnit(Object.assign({}, G.ENEMIES[k], { key: k }), 'enemy'); f.boss = false; f.maxHp = f.hp = hp || 9000; f.atk = 20; return f; });
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  /* ---------- Pyrelash ---------- */
  { const py = mk('pyrelash'), al = mk('sna'), fs = mkFoes(3); T.setSides([py, al], fs); T.setCur(py);
    ok(!!S.pyerupt.can(py), 'Strangle is locked while no lash is out');
    S.pylash.run(py, fs[0]); ok(fs[0].pyLash === 1 && !fs[1].pyLash && py.pyFree === 5, 'Lash wraps one lash around the target (5 of 6 free)');
    S.pylash.run(py, fs[0]); ok(fs[0].pyLash === 2 && has(fs[0], 'slow'), 'a second lash in the same enemy Slows it');
    const avg = f => { let n = 0; for (let i = 0; i < 30; i++) { al.hp = al.maxHp; T.setCur(f); T.hit(f, al, .3); n += al.maxHp - al.hp; } al.hp = al.maxHp; return Math.round(n / 30); };   /* V248: averaged, one hit was within the random spread */
    const dA = avg(fs[0]), dB = avg(fs[2]);
    ok(dA < dB, 'an enemy with 2 lashes in it hits weaker (' + dA + ' vs ' + dB + ')');
    T.setCur(py); S.pywhirl.run(py); ok(fs.every(f => f.pyLash >= 1) && run('pyOut()') === 6, 'Whirl sends every free lash out, spread over the line (' + fs.map(f => f.pyLash).join('/') + ')');
    fs[2].pyLash = 0; fs[0].pyLash = 4; fs[1].pyLash = 2; S.pylash.run(py, fs[2]); ok(fs[2].pyLash === 1 && run('pyOut()') === 6, 'with all six out, Lash pulls one back from the enemy holding the most');
    ok(S.pyerupt.can(py) === null, 'Strangle unlocks once lashes are out');
    const h0 = fs.map(f => f.hp); S.pyerupt.run(py); const dd = fs.map((f, i) => h0[i] - f.hp);
    ok(has(fs[0], 'stun') && !has(fs[2], 'stun') && dd[0] > dd[2], 'Strangle: more lashes = more damage (' + dd.join('/') + '), 3+ lashes Interrupts');
    const lashedFoe = fs[0]; T.damage(lashedFoe, 99999, 'impact'); run('refresh(party[0])'); ok(py.pyFree === 3, 'when an enemy dies its lashes come back (' + py.pyFree + ' free)'); }
  /* ---------- Triggerfinger ---------- */
  { const tf = mk('triggerfinger'), al = mk('sna'), fs = mkFoes(3); T.setSides([tf, al], fs); T.setCur(tf);
    ok(!!S.tferupt.can(tf), 'Landmine Eruption is locked with no mines down');
    S.tfdash.run(tf, fs[0]); ok(fs[0].tfMine === 1 && !fs[1].tfMine, 'Speed Dash leaves a mine under the target');
    const h = fs[0].hp; T.setCur(fs[0]); fs[0]._tfStep = false; T.hit(fs[0], al, 1.0); ok(fs[0].tfMine === 0 && fs[0].hp < h, 'a mined enemy that attacks steps on it: the mine goes off');
    T.setCur(tf); S.tfdash.run(tf, fs[0]); T.setCur(fs[0]); fs[0]._tfStep = false; T.hit(fs[0], al, 1.0); const left = fs[0].tfMine; T.hit(fs[0], al, 1.0); ok(left === 0, 'only the first attack of its turn sets a mine off');
    T.setCur(tf); S.tfdash.run(tf, fs[1]); S.tfdash.run(tf, fs[2]); S.tfbeacon.run(tf, fs[0]); ok(fs[0].tfMine === 3 && !fs[1].tfMine && !fs[2].tfMine && has(fs[0], 'mark'), 'Beacon pulls every mine under its target, plus one (' + fs[0].tfMine + ')');
    ok(S.tferupt.can(tf) === null, 'Landmine Eruption unlocks once a mine is down');
    const h0 = fs.map(f => f.hp); S.tferupt.run(tf); const dd = fs.map((f, i) => h0[i] - f.hp);
    ok(dd[0] > dd[1] && dd[1] > 0 && fs.every(f => !f.tfMine), 'Eruption: big blast under the mined enemy, splash beside it, all mines gone (' + dd.join('/') + ')'); }
  /* ---------- Marrow ---------- */
  { run('RUN = newRun()'); const mr = mk('marrow'), al = mk('sna'); const fs = mkFoes(3, 30); T.setSides([mr, al], fs); T.setCur(mr);
    ok(!mr.meterKind, 'Marrow no longer has the Toll meter');
    ok(run('mrBones()') === 0 && run('mrBook().length') === 0, 'a new run starts with an empty Book and no bones');
    S.mrname.run(mr, fs[0]); ok(!fs[0].alive && run('mrBook().length') === 1 && run('mrBones()') === 1, 'a kill writes the name in the Book and takes a bone');
    const big = mkFoes(2, 9000, fk[0]).concat(mkFoes(1, 9000, fk.find(k => k !== fk[0]))); T.setSides([mr, al], big); T.setCur(mr);
    const k1 = big[0].hp; S.mrname.run(mr, big[0]); const known = k1 - big[0].hp; const k2 = big[2].hp; S.mrname.run(mr, big[2]); const unknown = k2 - big[2].hp;
    ok(known > unknown, 'a kind already in the Book takes more from him (' + known + ' vs ' + unknown + ')');
    S.mrtoll.run(mr); ok(has(big[1], 'mark') && !has(big[2], 'mark'), 'Death Toll Marks the enemies whose name is written, not the others');
    run('RUN.mrBones = 12'); const atkHit = (() => { const f = mkFoes(1, 9000, fk.find(k => k !== fk[0]))[0]; T.setSides([mr, al], [f]); T.setCur(mr); const h = f.hp; T.hit(mr, f, 1.0); return h - f.hp; })();
    run('RUN.mrBones = 0'); const atk0 = (() => { const f = mkFoes(1, 9000, fk.find(k => k !== fk[0]))[0]; T.setSides([mr, al], [f]); T.setCur(mr); const h = f.hp; T.hit(mr, f, 1.0); return h - f.hp; })();
    ok(atkHit > atk0, 'bones make him hit harder (' + atk0 + ' -> ' + atkHit + ')');
    run('RUN = newRun()'); ok(run('mrBook().length') === 0, 'the Book empties when a new run starts'); }
  console.log(bad ? `\n${bad} problem(s).` : '\nPyrelash, Triggerfinger and Marrow OK.'); process.exit(bad ? 1 : 0);
})();
