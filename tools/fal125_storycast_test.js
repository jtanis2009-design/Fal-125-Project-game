#!/usr/bin/env node
'use strict';
/* fal125_storycast_test.js: checks the Story Mode cast (V235): the starting four, the guaranteed first encounter, and old saves.
   USAGE: node fal125_storycast_test.js [--html game.html] */
const vm = require('vm'); const { load, findHtml } = require('./fal125_headless.js');
const a = process.argv.slice(2), i0 = a.indexOf('--html'), html = findHtml(i0 >= 0 ? a[i0 + 1] : null);
let bad = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
(async () => {
  const H = load({ html, seed: 3 }), sb = H.sb, run = c => vm.runInContext(c, sb), T = H.G.RXT;
  run(`Object.assign(CFG,{auto:true,routes:false,draft:false,pace:1,diff:'Normal',world:0,runlen:'world'});CFG.autoStyle='smart';SAVE.mode='story';delete SAVE.roster;delete SAVE.castV;SAVE.unlocked=0;SAVE.bw={};`);
  ok(run(`storyRoster().join(',')`) === 'fuja,radiant,eyianix,bearer', 'a new Story save starts with Fuja, Radiant, Eyianix, Bearer: ' + run(`storyRoster().join(',')`));
  ok(run(`!!RL.snavo && !!RL.sna && !!recruitLines(CHARACTERS.find(c=>c.key==='snavo'))`), 'Snavo and Sna have recruit lines');
  /* the first encounter */
  run(`party = STORY_START.map(k => makeUnit(CHARACTERS.find(c => c.key === k), 'party')); party.forEach(u => { u.maxHp = u.hp = u.maxHp * 3; u.atk *= 3; }); foes = []; wave = 0; RUN.allyMiss = 0; RUN.forceAlly = false; Math.random = (r => () => Math.max(.9, r()))(Math.random);`);   /* random pinned high: an unforced encounter roll would fail */
  sb.allyEncounter = sb.__orig.allyEncounter;   /* the harness switches encounters off; this test needs the real one */
  sb.recruitIntro = async () => {}; sb.recruitJoin = async () => {}; sb.show = () => {};
  let seen = null; const _rb = sb.runBattle; sb.runBattle = async function () { seen = run(`foes.map(f => f.key).join(',')`); return 'win'; };
  const r = await H.drive(run(`allyEncounter(0)`), 400000, 20000);
  ok(!r.error && seen === 'wild_snavo', 'the first encounter is guaranteed and is Snavo: ' + seen + (r.error ? ' ' + r.error : ''));
  ok(run(`storyRoster().includes('snavo')`), 'beating him adds Snavo to the roster: ' + run(`storyRoster().join(',')`));
  seen = null; await H.drive(run(`RUN.allyMiss = 0; allyEncounter(1)`), 400000, 20000);
  ok(seen === null, 'after Snavo, encounters go back to the normal odds (none on a failed roll)');
  /* an old save */
  run(`SAVE.roster=['snavo','sna','eyianix','radiant','vor'];delete SAVE.castV;`);
  ok(run(`storyRoster().join(',')`) === 'snavo,sna,eyianix,radiant,vor,fuja,bearer', 'an older save keeps everyone and gains Fuja and Bearer: ' + run(`storyRoster().join(',')`));
  run(`delete SAVE.roster;delete SAVE.castV;SAVE.unlocked=2;`);
  ok(run(`storyRoster().join(',')`) === 'snavo,sna,eyianix,radiant,fuja,bearer', 'an older save with no recruits keeps the old four and gains the new ones');
  console.log(bad ? `\n${bad} problem(s).` : '\nStory cast OK.'); process.exit(bad ? 1 : 0);
})();
