'use strict';
/* fal125_story_check.js  (V177)
   Prints the "remembered" story cards of World 5 (reads World 4) and World 7 (reads World 6) for every boss-talk outcome,
   so you can read every variant without playing a world. It loads your REAL game code and never changes your game file.
   Run from the main game folder:   node tools/fal125_story_check.js
     --world 5 | 7      only that world        --talk defy|reason|bargain|appeal|ruthless   only that outcome        --html path/to/game.html */
const vm = require('vm'), fs = require('fs');
const { load } = require('./fal125_headless.js');
const arg = n => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : null; };
const L = load({ html: arg('html') }), sb = L.sb, run = c => vm.runInContext(c, sb);
const src = fs.readFileSync(L.htmlPath, 'utf8');
const a = src.indexOf('async function storyScene('), m = /\n}\n/g; m.lastIndex = a; const e = m.exec(src);
run('globalThis.realStoryScene = ' + src.slice(a, e.index + 2).replace('async function storyScene', 'async function'));
let out = []; sb.evtAsk = async (t, p) => { out.push('[' + t + ']\n' + p); return 0; };
const TALKS = ['defy', 'reason', 'bargain', 'appeal', 'ruthless'];
const W4 = { thehost: 'W4', deeds: { 'The Guest Book': 'Tear out a page', 'Turndown Service': 'Take the mints', 'The Haven Clinic': 'Accept the checkup' } };
const W6 = { deeds: { 'The Yellow Wallpaper': 'Look behind it', 'The Wellness Room': 'Drink the herbal tea', 'The Friendly Neighbour': 'Ask about the cellar' } };
(async () => {
  run(`SAVE.mode = 'story'; CFG.runlen = 'world'; RUN = newRun(); RUN.daily = null;
       party = ['rue','maw','weepingangel','serpentine'].map(k => CHARACTERS.find(c => c.key === k)).filter(Boolean).map(c => makeUnit(c, 'party'));`);
  for (const w of [5, 7]) { if (arg('world') && +arg('world') !== w) continue;
    for (const t of TALKS) { if (arg('talk') && arg('talk') !== t) continue;
      const rec = (d, key) => JSON.stringify({ talk: t, talkKey: key, kind: t === 'appeal' ? 2 : 0, greed: t === 'ruthless' ? 2 : 0, deeds: d, allies: [], walked: [] });
      run(`SAVE.sc = { 3: ${rec(W4.deeds, 'thehost')}, 5: ${rec(W6.deeds, 'shepherd')} }; SAVE.storySeen = {};`);
      console.log('\n' + '='.repeat(70) + `\nWORLD ${w}: the previous world was finished with the "${t}" talk\n` + '='.repeat(70));
      for (const tag of ['start', 'mid', 'end']) { out = []; await run(`realStoryScene(${w - 1}, '${tag}')`); console.log(`\n--- ${tag} ---\n` + out.join('\n\n')); }
      out = []; run(`WAVES = [['${w === 5 ? 'fal125' : 'openeye'}']]; RUN = newRun(); RUN.daily = null;`); await run('bossTalk(0)');
      console.log('\n--- boss talk prompt ---\n' + (out[0] || '(none)'));
    } }
})();
