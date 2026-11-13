#!/usr/bin/env node
'use strict';
/* fal125_rework3_test.js: checks the V239 reworks of Whiplash (Leash), Crushdeath (Junk Wall) and Flokelore (Presents and the List).
   USAGE: node fal125_rework3_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb);
  const has = (u, k) => u.st.some(s => s.k === k), S = G.SKILLS;
  const fk = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
  const mkFoes = n => Array.from({ length: n }, () => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[fk], { key: fk }), 'enemy'); f.boss = false; f.maxHp = f.hp = 9000; f.atk = 20; return f; });
  const mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party');
  /* ---------- Whiplash ---------- */
  { const wh = mk('whiplash'), al = mk('sna'), al2 = mk('snavo'), fs = mkFoes(3); T.setSides([wh, al, al2], fs);
    ok(!['whlash', 'whweave', 'whstorm'].some(k => /taunt/i.test(S[k].desc)), 'Whiplash: none of his moves Taunt any more');
    ok(!!S.whstorm.can(wh), 'Reel In is locked while nothing is Leashed');
    T.setCur(wh); S.whlash.run(wh, fs[0]); ok(has(fs[0], 'leash') && !has(fs[1], 'leash'), 'Wire Lash leashes its target');
    const hp0 = fs[0].hp; S.whlash.run(wh, fs[0]); ok(has(fs[0], 'slow') && (hp0 - fs[0].hp) > 0, 'Wire Lash on an already Leashed enemy yanks it (extra hit + Slow)');
    T.addStatus(al, 'taunt', 3, 1);
    let toWh = 0, toTaunt = 0; for (let i = 0; i < 40; i++) { T.setCur(fs[0]); const t = run('foeTarget()'); if (t === wh) toWh++; T.setCur(fs[1]); if (run('foeTarget()') === al) toTaunt++; }
    ok(toWh === 40, 'a Leashed enemy always picks Whiplash, even with a Taunting ally (' + toWh + '/40)');
    ok(toTaunt === 40, 'an enemy that is not Leashed still follows Taunt (' + toTaunt + '/40)');
    const e1 = fs[0].hp; T.setCur(fs[0]); T.hit(fs[0], wh, 1.0); ok(fs[0].hp < e1, 'a Leashed enemy that hits him is lashed back');
    T.hit(fs[2], al2, 1.0); T.setCur(wh); S.whweave.run(wh, al2); ok(has(fs[2], 'leash') && has(al2, 'guard'), 'Pull Them Behind guards the ally and leashes the enemy that hurt them');
    ok(!has(fs[1], 'leash'), 'and leaves the enemy that did not hurt them alone');
    ok(S.whstorm.can(wh) === null, 'Reel In unlocks once something is Leashed');
    const before = fs.map(f => f.hp); S.whstorm.run(wh); const L = fs.filter((f, i) => f.hp < before[i]).length;
    ok(L === 2 && has(fs[0], 'slow') && !has(fs[1], 'slow') && has(wh, 'guard'), 'Reel In hits only the Leashed enemies (' + L + ') and braces him');
    const fs2 = mkFoes(2); T.setSides([mk('whiplash'), al], fs2); const w2 = run("party.find(p=>p.key==='whiplash')"); T.setCur(fs2[0]); T.damage(w2, 99999, 'impact');
    ok(w2.alive && fs2.every(f => has(f, 'leash')), 'Death Rage leashes every enemy to him'); }
  /* ---------- Crushdeath ---------- */
  { const cd = mk('crushdeath'), al = mk('flick'), fs = mkFoes(3); T.setSides([cd, al], fs);
    ok(!['cdslam', 'cdplate', 'cdthrash'].some(k => /taunt/i.test(S[k].desc)), 'Crushdeath: no Taunt; the wall is his protection');
    ok(!!S.cdthrash.can(cd), 'Thrasher is locked with no wall');
    T.setCur(cd); S.cdslam.run(cd, fs[0]); ok((cd.wall || 0) > 0, 'Scrap Slam puts what it rips off onto the wall (' + cd.wall + ')');
    S.cdplate.run(cd); const w0 = cd.wall; ok(w0 > 0 && w0 <= Math.round(cd.maxHp * .6), 'Junk Wall builds it (' + w0 + ' of max ' + Math.round(cd.maxHp * .6) + ')');
    for (let i = 0; i < 6; i++) S.cdplate.run(cd); ok(cd.wall === Math.round(cd.maxHp * .6), 'the wall stops at 60% of his max HP');
    const wA = cd.wall, aHp = al.hp; T.setCur(fs[1]); T.hit(fs[1], al, 2.0); const lost = aHp - al.hp, soaked = wA - cd.wall;
    ok(soaked > 0 && lost > 0, 'an enemy hit on an ALLY takes half out of the wall (ally lost ' + lost + ', wall soaked ' + soaked + ')');
    const wB = cd.wall, aHp2 = al.hp; T.addStatus(al, 'bleed', 2, .05); run("damage(party[1], 30, 'impact')"); ok(cd.wall === wB, 'damage over time and other non-hit damage goes past the wall');
    T.setCur(cd); ok(S.cdthrash.can(cd) === null, 'Thrasher unlocks with a big enough wall');
    cd.wall = Math.round(cd.maxHp * .6); const t0 = fs[0].hp, o0 = fs[2].hp; S.cdthrash.run(cd, fs[0]);   /* throw a full wall */ const big = t0 - fs[0].hp, small = o0 - fs[2].hp;
    ok(cd.wall === 0 && big > small && small > 0 && has(fs[0], 'mark'), 'Thrasher throws the wall: big hit on the target (' + big + '), splash on the rest (' + small + '), wall gone');
    const c2 = mk('crushdeath'), f2 = mkFoes(1); T.setSides([c2, al], f2); T.setCur(c2); S.cdplate.run(c2); const tw = c2.wall; const big2 = (() => { const h = f2[0].hp; T.setCur(c2); c2.wall = Math.round(c2.maxHp * .21); S.cdthrash.run(c2, f2[0]); return h - f2[0].hp; })();
    ok(big2 < big, 'a small wall throws for less than a full one (' + big2 + ' < ' + big + ')');
    const c3 = mk('crushdeath'), f3 = mkFoes(1); f3[0].atk = 400; T.setSides([c3, al], f3); T.setCur(c3); c3.wall = 5; const fh = f3[0].hp; T.setCur(f3[0]); T.hit(f3[0], al, 1.0);
    ok(c3.wall === 0 && f3[0].hp < fh, 'when enemies knock the wall down, the junk flies back at whoever did it'); }
  /* ---------- Flokelore ---------- */
  { const fl = mk('flokelore'), al = mk('sna'), al2 = mk('snavo'), fs = mkFoes(2); T.setSides([fl, al, al2], fs);
    al.hp = 100; T.setCur(fl); S.flstock.run(fl, al); ok(al.hp === 100 && has(al, 'present'), 'Stocking Stuffer wraps a Present: nothing heals yet');
    S.flstock.run(fl, al); const pv = al.st.find(s => s.k === 'present').v; ok(Math.abs(pv - .40) < 1e-9, 'a second Present on the same ally makes it bigger (' + pv + ')');
    const h0 = al.hp; await H.drive(run(`(async()=>{ try{ await takeTurn(party[1]); }catch(e){} })()`)); const opened = al.hp - h0;
    ok(opened > 0 && !has(al, 'present'), 'the Present opens at the start of the ally’s own turn (+' + opened + ' HP)');
    al.hp = al.maxHp; T.setCur(fl); S.flstock.run(fl, al); T.setCur(fs[0]); al.atk = al.atk; run("damage(party[1], Math.round(party[1].maxHp*.7), 'impact')");
    ok(!has(al, 'present') && al.hp > al.maxHp * .3, 'a Present opens early if the ally drops below half HP');
    const fresh = mkFoes(1)[0]; T.setSides([fl, al, al2], [fresh, fs[1]]); al2.hp = 50; T.setCur(fl); S.flnaughty.run(fl, fresh);
    ok(!has(fresh, 'coal') && has(al2, 'present'), 'Naughty List on an enemy that has hurt nobody (Nice): no Coal, the most wounded ally gets a Present');
    T.setCur(fs[1]); T.hit(fs[1], al, 1.0); T.setCur(fl); S.flnaughty.run(fl, fs[1]); ok(has(fs[1], 'coal') && has(fs[1], 'mark'), 'Naughty List on an enemy that has hurt someone (Naughty): Coal and Mark');
    const ch = fs[1].hp; await H.drive(run(`(async()=>{ try{ await takeTurn(foes[1]); }catch(e){} })()`)); ok(fs[1].hp < ch && !has(fs[1], 'coal'), 'Coal bursts at the start of the enemy’s turn');
    T.setSides([mk('flokelore'), mk('sna')], mkFoes(1)); const f2 = run('party[0]'); T.setCur(f2); ok(!!S.flnight.can(f2), 'Silent Night is locked with nothing wrapped');
    S.flstock.run(f2, run('party[1]')); run('party[1].hp=40'); ok(S.flnight.can(f2) === null, 'Silent Night unlocks once something is wrapped');
    T.addStatus(run('party[1]'), 'slow', 2, .3); S.flnight.run(f2); ok(run('party[1].hp') > 40 && !run("party[1].st.some(s=>s.k==='slow'||s.k==='present')"), 'Silent Night opens everything now and clears Slow'); }
  console.log(bad ? `\n${bad} problem(s).` : '\nWhiplash, Crushdeath and Flokelore OK.'); process.exit(bad ? 1 : 0);
})();
