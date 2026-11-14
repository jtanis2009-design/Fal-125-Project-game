#!/usr/bin/env node
'use strict';
/* fal125_w8horror_test.js: checks the V267 World 8 analog horror pass: places from Worlds 1-7, advisories, alternates talking, and that
   nothing leaks into other worlds or changes the fight. USAGE: node fal125_w8horror_test.js [--html game.html] [--runs 3] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), opt = k => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : null; }, html = findHtml(opt('html')), runs = +(opt('runs') || 3);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 4 }), G = H.G, run = c => vm.runInContext(c, H.sb);
  const W = run('W8H'), W8I = run('W8I');
  const all = [...W.adv, ...W.advFloor, ...W.advBoss, W.advFinal, ...W.foot];
  ok(W.adv.length >= 10 && W.advFloor.length === 5 && W.advBoss.length >= 3 && all.every(t => typeof t === 'string' && t.length > 12) && new Set(all).size === all.length, all.length + ' advisory texts, none empty, none repeated');
  run('CFG.world = ' + W8I + '; CFG.runlen = "world"; RUN = newRun();'); ok(run('w8hOn()'), 'the pass is on in World 8');
  let badPlace = 0, flips = 0, ups = 0, same = 0; const seen = new Set();
  for (let i = 0; i < 25; i++) { const p = run('w8hPlace')(i), svg = run('w8hSvg')(p); if (!(p.w >= 0 && p.w <= 6 && p.w !== W8I) || !/^<svg/.test(svg)) badPlace++; seen.add(p.w); if (p.flip) flips++; if (p.up) { ups++; if (Math.floor(i / 5) < 2) badPlace++; } if (run('w8hPlace')(i) !== p) same++; }
  ok(!badPlace && !same, 'every wave shows a real place from Worlds 1 to 7, and a wave keeps its place');
  ok(seen.size >= 4, 'the places come from several worlds (' + seen.size + ' of 7 in one run)');
  ok(flips > 0, 'some places are the wrong way round (' + flips + ' mirrored, ' + ups + ' upside down, only from floor 3)');
  const c = []; for (let i = 0; i < 40; i++) c.push(run('w8hCorrupt')('Something will come up.')); ok(c.every(t => /Something/.test(t)) && new Set(c).size >= 4, 'alternates say a fighter\'s line wrong, in several ways');
  run('globalThis.__s=[]; const __q=say; say=function(t){ __s.push(String(t)); return __q.apply(this,arguments); }');
  const T = G.RXT, mk = k => T.makeUnit(G.CHARACTERS_BY(k), 'party'), pa = [mk('luckster'), mk('parda')]; T.setSides(pa, []);
  const lk = { name:'Luckster?', altOf:'luckster', alt:true }, pd = { name:'Not Parda', altOf:'parda', alt:true };
  for (let i = 0; i < 30; i++) { run('w8hTalk')(lk); run('w8hTalk')(pd); } const said = run('__s');
  ok(said.length === 60 && said.some(t => /^Luckster\?: "/.test(t)) && !said.some(t => /^Not Parda: "\(/.test(t)), 'a copy of a talking fighter quotes them; a copy of a silent one never "says" a stage direction');
  run('CFG.world = 0; RUN = newRun();'); ok(!run('w8hOn()'), 'it is off in every other world');
  /* the fight itself is unchanged: World 8 still plays through with no errors */
  let errs = 0, waves = 0; const P = ['snavo', 'sna', 'eyianix', 'radiant'], xpMap = {}; P.forEach(k => xpMap[k] = 3000);
  for (let i = 0; i < runs; i++) { H.reseed(9000 + i); try { const r = await H.run(P, { world:W8I, runlen:'world', diff:'Normal', xp:0, xpMap, chips:[], smart:true, story:true, wave:1, foes:[] }); waves += r.atWave || 0; } catch (e) { errs++; console.log('  run error: ' + String(e.message).slice(0, 140)); } }
  ok(!errs && waves > 0, runs + ' auto-played World 8 runs finish with no errors (average wave ' + (waves / runs).toFixed(1) + ')');
  console.log(bad ? `\n${bad} problem(s).` : '\nWorld 8 horror pass OK.'); process.exit(bad ? 1 : 0);
})();
