#!/usr/bin/env node
'use strict';
/* fal125_hollowpoint_test.js: checks the V238 Hollowpoint rework (Tapped, shared leech, Void Shot without a Shell cost) and Radiant's wave start.
   USAGE: node fal125_hollowpoint_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
const H = load({ html }), G = H.G, T = G.RXT, run = c => vm.runInContext(c, H.sb); let bad = 0;
const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
const has = (u, k) => u.st.some(s => s.k === k);
const fk = Object.keys(G.ENEMIES).find(k => !G.ENEMIES[k].boss);
const hp = T.makeUnit(G.CHARACTERS_BY('hollowpoint'), 'party'), al = T.makeUnit(G.CHARACTERS_BY('sna'), 'party'), al2 = T.makeUnit(G.CHARACTERS_BY('snavo'), 'party');
const foes = [0, 1].map(() => { const f = T.makeUnit(Object.assign({}, G.ENEMIES[fk], { key: fk }), 'enemy'); f.boss = false; f.maxHp = f.hp = 9000; return f; });
T.setSides([hp, al, al2], foes); T.setCur(hp); const S = G.SKILLS;
hp.hp = 40; al.hp = 30; al2.hp = al2.maxHp; S.hpbuck.run(hp, foes[0]);
ok(has(foes[0], 'hptap') && !has(foes[1], 'hptap'), 'Buckshot Taps its target (not the one beside it)');
ok(hp.hp > 40 && al.hp > 30 && al2.hp === al2.maxHp, 'Buckshot heals Hollowpoint AND the most wounded other ally');
al2.hp = 20; T.setCur(al2); G.SKILLS[al2.skills[0]].run(al2, foes[0]); ok(al2.hp > 20, 'an ally who hits a Tapped enemy heals from it (' + 20 + ' > ' + Math.round(al2.hp) + ')');
al2.hp = 20; G.SKILLS[al2.skills[0]].run(al2, foes[1]); ok(al2.hp === 20, 'hitting an enemy that is not Tapped heals nobody');
T.setCur(hp); al.hp = 30; S.hpgive.run(hp, al); ok(al.hp > 30 && foes[0].hp < 9000, 'Transfusion shoots the Tapped enemy and heals the chosen ally');
hp.shells = 0; ok(!S.hpvoid.can || S.hpvoid.can(hp) == null, 'Void Shot can be fired with no Shells');
[hp, al, al2].forEach(u => { u.hp = 25; }); hp.shells = 3; S.hpvoid.run(hp, foes[0]);
ok([hp, al, al2].every(u => u.hp > 25) && hp.shells === 0 && [hp, al, al2].every(u => has(u, 'leech')), 'Void Shot on a Tapped enemy heals the whole party, spends the Shells and gives everyone Leech');
[hp, al, al2].forEach(u => { u.hp = 25; }); S.hpvoid.run(hp, foes[1]); ok(al2.hp === 25 || al.hp === 25, 'Void Shot on an untapped enemy does not drain into everyone');
/* Radiant */
const rd = T.makeUnit(G.CHARACTERS_BY('radiant'), 'party');
rd.meter = 0; ok(run('radCarry')(rd) === run('RX.startRad'), 'Radiant starts a wave with at least ' + run('RX.startRad') + ' Rad');
rd.meter = 100; ok(run('radCarry')(rd) === run('RX.carryCap'), 'and keeps at most ' + run('RX.carryCap') + ' of what he had');
ok(run('radCarry')(al) === 0, 'other fighters still start a wave at 0');
ok(!S.beam.can(Object.assign(rd, { meter: run('radCarry')(Object.assign(rd, { meter: 0 })) })), 'Radiation Beam is ready on his first turn');
console.log(bad ? `\n${bad} problem(s).` : '\nHollowpoint and Radiant OK.'); process.exit(bad ? 1 : 0);
